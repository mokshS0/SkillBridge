const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Check if Google Generative AI is available
let genAI;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (err) {
  console.warn('Google Generative AI package not installed. Run: npm install @google/generative-ai');
  genAI = null;
}

// Cache for available model name
let cachedModelName = null;
let modelCheckAttempted = false;

// Helper function to find available model by listing models
async function findAvailableModel() {
  if (!genAI) return null;
  
  if (cachedModelName) {
    return cachedModelName;
  }
  
  // Only try to list models once
  if (modelCheckAttempted) {
    // Return a default if we've already tried
    return 'gemini-1.5-flash';
  }
  
  modelCheckAttempted = true;
  
  try {
    // Try to list models using direct API call
    const https = require('https');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    
    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.models && jsonData.models.length > 0) {
              // Find a model that supports generateContent
              const availableModel = jsonData.models.find(model => 
                model.supportedGenerationMethods && 
                model.supportedGenerationMethods.includes('generateContent')
              );
              
              if (availableModel) {
                // Remove 'models/' prefix if present
                cachedModelName = availableModel.name.replace('models/', '');
                console.log(`✓ Found available model: ${cachedModelName}`);
                resolve(cachedModelName);
                return;
              }
            }
          } catch (err) {
            console.warn('Error parsing model list:', err.message);
          }
          // Fallback
          resolve('gemini-1.5-flash');
        });
      }).on('error', (err) => {
        console.warn('Error fetching model list:', err.message);
        resolve('gemini-1.5-flash');
      });
    });
  } catch (err) {
    console.warn('Could not list models:', err.message);
    return 'gemini-1.5-flash';
  }
}

// Helper function to get model
async function getModel() {
  if (!genAI) return null;
  
  // Try to find available model, but also try common names directly
  const modelNamesToTry = [
    'gemini-1.5-flash',  // Most common current model
    'gemini-1.5-pro',
    'gemini-pro',
  ];
  
  // First try to get from API
  let modelName = await findAvailableModel();
  if (!modelName) {
    modelName = modelNamesToTry[0];
  }
  
  // Try each model name until one works
  for (const name of [modelName, ...modelNamesToTry]) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      console.log(`Using model: ${name}`);
      cachedModelName = name; // Cache the working model
      return model;
    } catch (err) {
      // Try next model
      continue;
    }
  }
  
  console.error('Failed to get any Gemini model');
  return null;
}

// POST /generate-filter
router.post('/generate-filter', auth, async (req, res) => {
  try {
    const { jobPosts, users, jobDescription } = req.body;
    
    // Always return fallback recommendations for demo (AI code commented out below)
    const mockFilters = {
      job_type_tag: ['Remote', 'Part-time'],
      industry_tag: ['Education', 'Technology'],
      filteredJobs: jobPosts?.slice(0, 5) || []
    };
    return res.json(mockFilters);

    /* AI CODE - COMMENTED OUT FOR DEMO (uncomment to enable AI job recommendations)
    // If Gemini is not configured, return mock data
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn('Gemini not configured, returning mock filters');
      const mockFilters = {
        job_type_tag: ['Remote', 'Part-time'],
        industry_tag: ['Education', 'Technology'],
        filteredJobs: jobPosts?.slice(0, 5) || []
      };
      return res.json(mockFilters);
    }

    // Build prompt for job filtering
    const user = users?.[0] || {};
    const userProfile = `
User Profile:
- Name: ${user.real_name || 'N/A'}
- Bio: ${user.bio || 'No bio provided'}
- Skills: ${user.skills?.map(s => s.skill_name).join(', ') || 'None listed'}
- Projects: ${user.projects?.map(p => p.project_name).join(', ') || 'None listed'}
- Work History: ${user.history?.map(h => h.title).join(', ') || 'None listed'}
- Achievements: ${user.achievements?.map(a => a.achievement_name).join(', ') || 'None listed'}
`;

    const jobsList = jobPosts?.map((job, idx) => 
      `${idx + 1}. ${job.jobTitle || job.job_title} - ${job.jobDescription || job.job_description?.substring(0, 100)}...`
    ).join('\n') || 'No jobs available';

    const prompt = `You are a career matching assistant. Based on the user's profile and available job postings, recommend the top 5 most suitable jobs.

${userProfile}

Available Jobs:
${jobsList}

Analyze the user's skills, experience, and interests, then recommend the top 5 job IDs (numbers) that best match their profile. Consider:
- Skill alignment
- Experience relevance
- Career growth potential
- Interest match

Respond ONLY with a JSON array of job numbers (1-based index), like: [1, 3, 5, 7, 9]`;

    const model = await getModel();
    if (!model) {
      throw new Error('No Gemini model available');
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    let recommendedIndices = [];
    
    try {
      // Try to parse JSON array from response
      recommendedIndices = JSON.parse(response);
      if (!Array.isArray(recommendedIndices)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      // If parsing fails, try to extract numbers from the response
      const numbers = response.match(/\d+/g);
      recommendedIndices = numbers ? numbers.map(n => parseInt(n) - 1).slice(0, 5) : [0, 1, 2, 3, 4];
    }

    // Get recommended jobs (convert 1-based to 0-based index)
    const recommendedJobs = recommendedIndices
      .map(idx => jobPosts?.[idx - 1]) // Convert to 0-based
      .filter(job => job !== undefined)
      .slice(0, 5);

    res.json({
      filteredJobs: recommendedJobs,
      job_type_tag: recommendedJobs.flatMap(job => job.jobTypes || []),
      industry_tag: recommendedJobs.flatMap(job => job.industries || [])
    });
    */

  } catch (err) {
    console.error('AI filter generation error:', err.message);
    console.error('Full error:', err);
    // Fallback to mock data on error
    res.json({
      job_type_tag: ['Remote', 'Part-time'],
      industry_tag: ['Education', 'Technology'],
      filteredJobs: req.body.jobPosts?.slice(0, 5) || []
    });
  }
});

// POST /generate-bio
router.post('/generate-bio', auth, async (req, res) => {
  try {
    const { userInfo, userInput } = req.body;
    
    // If Gemini is not configured, return mock data
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn('Gemini not configured, returning mock bio');
      const mockBio = `Experienced professional with a passion for ${userInfo?.field || userInput || 'technology'}. 
Dedicated to continuous learning and professional growth.`;
      return res.json({ bio: mockBio });
    }

    // Build prompt for bio generation - short, small, no formatting
    const userData = userInfo || {};
    const existingBio = userInput || userData.bio || '';
    
    const prompt = `Generate a short professional bio (2-3 sentences, max 100 words, plain text only, no formatting, no markdown, no asterisks, no bold, no special characters). 

User information:
${userData.real_name ? `Name: ${userData.real_name}` : ''}
${userData.school_name ? `School: ${userData.school_name}` : ''}
${userData.skills ? `Skills: ${userData.skills.map(s => s.skill_name || s).join(', ')}` : ''}
${userData.projects ? `Projects: ${userData.projects.map(p => p.project_name || p).join(', ')}` : ''}
${userData.achievements ? `Achievements: ${userData.achievements.map(a => a.achievement_name || a).join(', ')}` : ''}
${userData.history ? `Experience: ${userData.history.map(h => h.title || h).join(', ')}` : ''}
${existingBio ? `Current bio: ${existingBio}` : ''}

Return only plain text. No markdown formatting, no asterisks, no bold text, no special characters. Just simple sentences.`;

    const model = await getModel();
    if (!model) {
      throw new Error('No Gemini model available');
    }

    const result = await model.generateContent(prompt);
    let generatedBio = result.response.text().trim();
    
    // Remove any markdown formatting that might slip through
    generatedBio = generatedBio
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/__/g, '') // Remove underline markdown
      .replace(/_/g, '') // Remove italic markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/#{1,6}\s*/g, '') // Remove heading markdown
      .trim();

    res.json({ bio: generatedBio });

  } catch (err) {
    console.error('AI bio generation error:', err.message);
    // Fallback to mock bio
    const mockBio = `Experienced professional with a passion for ${req.body.userInfo?.field || req.body.userInput || 'technology'}. 
Dedicated to continuous learning and professional growth.`;
    res.json({ bio: mockBio });
  }
});

// POST /api/chat (for messaging assistant)
router.post('/api/chat', auth, async (req, res) => {
  try {
    const { message, context, userData } = req.body;
    
    // If Gemini is not configured, return a helpful message
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return res.json({ 
        response: 'AI assistant is not configured. Please add your Gemini API key to enable this feature.' 
      });
    }

    const systemPrompt = `You are a helpful career and job search assistant for SkillBridge, a platform connecting students with job opportunities. 
Help users with career advice, job search tips, application guidance, and platform navigation.
Be friendly, professional, and concise. Keep responses under 200 words.
IMPORTANT: Return only plain text. Do not use any markdown formatting. No asterisks, no bold text, no special characters. Just simple, readable text.`;

    const userPrompt = `User context:
${userData?.real_name ? `Name: ${userData.real_name}` : ''}
${userData?.is_teacher ? 'Role: Teacher' : 'Role: Student'}
${userData?.school_name ? `School: ${userData.school_name}` : ''}

User question: ${message}

Context: ${context || 'general'}`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const model = await getModel();
    if (!model) {
      return res.status(500).json({ 
        response: 'AI model is not available. Please check your API key and model configuration.' 
      });
    }

    const result = await model.generateContent(fullPrompt);
    let response = result.response.text().trim();
    
    // Remove any markdown formatting that might slip through
    response = response
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/__/g, '') // Remove underline markdown
      .replace(/_/g, '') // Remove italic markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/#{1,6}\s*/g, '') // Remove heading markdown
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .trim();

    res.json({ response });

  } catch (err) {
    console.error('AI chat error:', err.message);
    console.error('Full error details:', err);
    
    // More detailed error for debugging
    if (err.message && err.message.includes('404')) {
      return res.status(500).json({ 
        response: 'The AI model is not available. Please check your API key has access to Gemini models. Error: Model not found (404).' 
      });
    }
    
    res.status(500).json({ 
      response: 'I apologize, but I encountered an error. Please try again later.' 
    });
  }
});

// Debug route to check available models (remove in production)
router.get('/debug/models', async (req, res) => {
  try {
    if (!genAI || !process.env.GEMINI_API_KEY) {
      return res.json({ error: 'Gemini not configured' });
    }
    
    const https = require('https');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          res.json({
            success: true,
            models: jsonData.models?.map(m => ({
              name: m.name,
              displayName: m.displayName,
              supportedMethods: m.supportedGenerationMethods
            })) || [],
            raw: jsonData
          });
        } catch (err) {
          res.json({ error: 'Parse error', message: err.message, raw: data });
        }
      });
    }).on('error', (err) => {
      res.json({ error: 'Request error', message: err.message });
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ============================================
// MOCK INTERVIEW API ENDPOINTS
// ============================================

// POST /api/interview/generate-questions
router.post('/api/interview/generate-questions', auth, async (req, res) => {
  try {
    const { jobDetails, applicationDetails, questionCount } = req.body;
    
    // Always return mock questions for demo (AI code commented out below)
    const mockQuestions = [
      'Tell me about yourself and why you\'re interested in this position.',
      'What relevant skills do you have that make you a good fit for this role?',
      'What do you hope to gain from this experience?',
      'Can you describe a challenging project you\'ve worked on?',
      'Where do you see yourself in the next few years?'
    ].slice(0, questionCount || 5);
    
    return res.json({ questions: mockQuestions });

    /* AI CODE - COMMENTED OUT FOR DEMO (uncomment to enable AI question generation)
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn('Gemini not configured, returning mock questions');
      const mockQuestions = [
        'Tell me about yourself and why you\'re interested in this position.',
        'What relevant skills do you have that make you a good fit for this role?',
        'What do you hope to gain from this experience?',
        'Can you describe a challenging project you\'ve worked on?',
        'Where do you see yourself in the next few years?'
      ].slice(0, questionCount || 5);
      return res.json({ questions: mockQuestions });
    }

    const jobTitle = jobDetails?.job_title || jobDetails?.jobTitle || 'this position';
    const jobDescription = jobDetails?.job_description || jobDetails?.jobDescription || '';
    const whyInterested = applicationDetails?.why_interested || '';
    const relevantSkills = applicationDetails?.relevant_skills || '';
    const hopeToGain = applicationDetails?.hope_to_gain || '';

    const prompt = `Generate ${questionCount || 5} interview questions for a mock interview. 
The candidate is applying for: ${jobTitle}
Job Description: ${jobDescription}
Candidate's interest: ${whyInterested}
Candidate's skills: ${relevantSkills}
Candidate's goals: ${hopeToGain}

Generate relevant, professional interview questions that would be appropriate for this position. 
Return ONLY a JSON array of question strings, like: ["Question 1", "Question 2", "Question 3"]`;

    const model = await getModel();
    if (!model) {
      throw new Error('No Gemini model available');
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    let questions = [];
    try {
      // Try to parse JSON array from response
      questions = JSON.parse(response);
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      // If parsing fails, split by newlines and clean up
      questions = response.split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !/^\d+/.test(q))
        .slice(0, questionCount || 5);
    }

    res.json({ questions });
    */

  } catch (err) {
    console.error('Interview question generation error:', err.message);
    // Return fallback questions on error
    const fallbackQuestions = [
      'Tell me about yourself and why you\'re interested in this position.',
      'What relevant skills do you have that make you a good fit for this role?',
      'What do you hope to gain from this experience?'
    ].slice(0, req.body?.questionCount || 5);
    res.json({ questions: fallbackQuestions });
  }
});

// POST /api/interview/text-to-speech
router.post('/api/interview/text-to-speech', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // For demo purposes, we'll use a simple TTS approach
    // In production, you might use Google Cloud Text-to-Speech, AWS Polly, or similar
    // For now, we'll return a simple audio file or use browser's built-in TTS
    
    // Since we can't easily generate audio server-side without external services,
    // we'll return a success response and let the frontend handle TTS using browser APIs
    // Alternatively, you could use a free TTS API like Google's or AWS Polly
    
    // For demo: return a simple response indicating success
    // The frontend should use browser's SpeechSynthesis API instead
    res.json({ 
      success: true, 
      message: 'Use browser SpeechSynthesis API for TTS',
      text: text 
    });

    /* PRODUCTION TTS CODE (example with Google Cloud TTS)
    const textToSpeech = require('@google-cloud/text-to-speech');
    const client = new textToSpeech.TextToSpeechClient();
    
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
    */

  } catch (err) {
    console.error('Text-to-speech error:', err.message);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// POST /api/interview/speech-to-text
router.post('/api/interview/speech-to-text', auth, async (req, res) => {
  try {
    // For demo purposes, we'll return a mock transcription
    // In production, you would use Google Cloud Speech-to-Text, AWS Transcribe, or similar
    
    // Since we're receiving audio as FormData, we need to handle it
    // For now, return a mock response
    const mockTranscription = 'This is a mock transcription. In production, this would be generated using a speech-to-text service.';
    
    res.json({ text: mockTranscription });

    /* PRODUCTION STT CODE (example with Google Cloud Speech-to-Text)
    const speech = require('@google-cloud/speech');
    const client = new speech.SpeechClient();
    
    // The audio file would be in req.file or req.body.audio
    const audioBytes = req.file.buffer.toString('base64');
    
    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    res.json({ text: transcription });
    */

  } catch (err) {
    console.error('Speech-to-text error:', err.message);
    res.status(500).json({ error: 'Failed to process speech', text: 'Could not transcribe audio. Please try again.' });
  }
});

// POST /api/interview/generate-feedback
router.post('/api/interview/generate-feedback', auth, async (req, res) => {
  try {
    const { responses, jobDetails } = req.body;
    
    // Always return mock feedback for demo (AI code commented out below)
    const mockFeedback = `Thank you for completing the mock interview! 

Based on your responses, here are some key observations:

Strengths:
- You demonstrated clear interest in the position
- Your answers showed relevant experience and skills
- You articulated your goals well

Areas for Improvement:
- Consider providing more specific examples in your answers
- Try to connect your experiences more directly to the role
- Practice speaking more concisely while still being thorough

Overall, you did well! Keep practicing and refining your interview skills.`;

    return res.json({ feedback: mockFeedback });

    /* AI CODE - COMMENTED OUT FOR DEMO (uncomment to enable AI feedback generation)
    if (!genAI || !process.env.GEMINI_API_KEY) {
      console.warn('Gemini not configured, returning mock feedback');
      const mockFeedback = `Thank you for completing the mock interview! Based on your responses, you demonstrated good communication skills and relevant experience. Keep practicing!`;
      return res.json({ feedback: mockFeedback });
    }

    const jobTitle = jobDetails?.job_title || jobDetails?.jobTitle || 'this position';
    const responsesText = responses.map((r, i) => 
      `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}`
    ).join('\n\n');

    const prompt = `You are an interview coach providing constructive feedback on a mock interview.

Job Position: ${jobTitle}
Interview Responses:
${responsesText}

Provide constructive, professional feedback that:
1. Highlights strengths in the candidate's responses
2. Suggests specific areas for improvement
3. Offers actionable advice for future interviews
4. Is encouraging and supportive

Keep the feedback concise (3-4 paragraphs) and professional.`;

    const model = await getModel();
    if (!model) {
      throw new Error('No Gemini model available');
    }

    const result = await model.generateContent(prompt);
    const feedback = result.response.text().trim();

    res.json({ feedback });
    */

  } catch (err) {
    console.error('Feedback generation error:', err.message);
    // Return fallback feedback on error
    const fallbackFeedback = 'Thank you for completing the mock interview! Your responses were thoughtful. Keep practicing to improve your interview skills.';
    res.json({ feedback: fallbackFeedback });
  }
});

module.exports = router;

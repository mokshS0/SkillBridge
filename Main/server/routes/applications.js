const express = require('express');
const router = express.Router();

const Application = require('../models/Application');
const auth = require('../middleware/auth');

// GET /applications
router.get('/', auth, async (req, res) => {
  try {
    const { job_id, user_id } = req.query;
    let query = {};

    if (job_id) {
      query.job_id = job_id;
    }
    if (user_id) {
      query.user_id = user_id;
    }

    const applications = await Application.find(query).sort({ date_applied: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /applications/job/:jobId
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ job_id: req.params.jobId }).sort({ date_applied: -1 });
    
    // Ensure fields are at top level for all applications
    const applicationsWithFields = applications.map(app => {
      const appObj = app.toObject();
      return {
        ...appObj,
        why_interested: appObj.why_interested || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.why_interested : '') || '',
        relevant_skills: appObj.relevant_skills || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.relevant_skills : '') || '',
        hope_to_gain: appObj.hope_to_gain || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.hope_to_gain : '') || ''
      };
    });
    
    res.json(applicationsWithFields);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /applications/user/:userId
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user_id: req.params.userId }).sort({ date_applied: -1 });
    
    // Ensure fields are at top level for all applications
    const applicationsWithFields = applications.map(app => {
      const appObj = app.toObject();
      return {
        ...appObj,
        why_interested: appObj.why_interested || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.why_interested : '') || '',
        relevant_skills: appObj.relevant_skills || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.relevant_skills : '') || '',
        hope_to_gain: appObj.hope_to_gain || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.hope_to_gain : '') || ''
      };
    });
    
    res.json(applicationsWithFields);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /applications/:applicationId
router.get('/:applicationId', auth, async (req, res) => {
  try {
    const application = await Application.findOne({ application_id: req.params.applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Ensure fields are at top level for easier access
    const appObj = application.toObject();
    const applicationWithFields = {
      ...appObj,
      why_interested: appObj.why_interested || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.why_interested : '') || '',
      relevant_skills: appObj.relevant_skills || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.relevant_skills : '') || '',
      hope_to_gain: appObj.hope_to_gain || (appObj.application_data && typeof appObj.application_data === 'object' ? appObj.application_data.hope_to_gain : '') || ''
    };
    
    console.log('GET /applications/:applicationId - Returning:', {
      application_id: applicationWithFields.application_id,
      why_interested: applicationWithFields.why_interested,
      relevant_skills: applicationWithFields.relevant_skills,
      hope_to_gain: applicationWithFields.hope_to_gain
    });
    
    res.json(applicationWithFields);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /applications
router.post('/', auth, async (req, res) => {
  try {
    const {
      job_id,
      user_id,
      application_data,
      status,
      why_interested,
      relevant_skills,
      hope_to_gain
    } = req.body;

    // Log incoming request data
    console.log('POST /applications - Received data:', JSON.stringify({
      why_interested,
      relevant_skills,
      hope_to_gain,
      job_id,
      user_id: user_id || req.user.user_id,
      full_body: req.body
    }, null, 2));

    // Build application_data from individual fields if provided
    const appData = application_data || {};
    // Always save fields - convert to string and trim, default to empty string
    const whyInterestedValue = why_interested !== undefined && why_interested !== null 
      ? String(why_interested).trim() 
      : '';
    const relevantSkillsValue = relevant_skills !== undefined && relevant_skills !== null 
      ? String(relevant_skills).trim() 
      : '';
    const hopeToGainValue = hope_to_gain !== undefined && hope_to_gain !== null 
      ? String(hope_to_gain).trim() 
      : '';
    
    appData.why_interested = whyInterestedValue;
    appData.relevant_skills = relevantSkillsValue;
    appData.hope_to_gain = hopeToGainValue;

    // Create application object with ALL fields in constructor
    const newApplication = new Application({
      job_id,
      user_id: user_id || req.user.user_id,
      application_data: appData,
      why_interested: whyInterestedValue,
      relevant_skills: relevantSkillsValue,
      hope_to_gain: hopeToGainValue,
      status: status || 'pending'
    });
    
    // Use markModified to ensure Mixed type fields are saved
    newApplication.markModified('application_data');
    
    // Verify fields are set before saving
    console.log('Before save - Application object fields:', {
      why_interested: newApplication.why_interested,
      relevant_skills: newApplication.relevant_skills,
      hope_to_gain: newApplication.hope_to_gain,
      isNew: newApplication.isNew,
      isModified: newApplication.isModified('why_interested')
    });
    
    console.log('Saving application with processed data:', JSON.stringify({
      why_interested: whyInterestedValue,
      relevant_skills: relevantSkillsValue,
      hope_to_gain: hopeToGainValue,
      appData: appData,
      why_interested_length: whyInterestedValue.length,
      relevant_skills_length: relevantSkillsValue.length,
      hope_to_gain_length: hopeToGainValue.length
    }, null, 2));

    const application = await newApplication.save();
    
    // Convert to plain object to ensure all fields are included
    const applicationObj = application.toObject();
    
    // Log what was actually saved
    console.log('Application saved successfully:', JSON.stringify({
      application_id: applicationObj.application_id,
      why_interested: applicationObj.why_interested,
      relevant_skills: applicationObj.relevant_skills,
      hope_to_gain: applicationObj.hope_to_gain,
      application_data: applicationObj.application_data,
      why_interested_type: typeof applicationObj.why_interested,
      relevant_skills_type: typeof applicationObj.relevant_skills,
      hope_to_gain_type: typeof applicationObj.hope_to_gain
    }, null, 2));
    
    // Always use the processed values in the response, regardless of what was saved
    // This ensures the frontend always gets the data that was sent
    const responseData = {
      ...applicationObj,
      why_interested: whyInterestedValue,
      relevant_skills: relevantSkillsValue,
      hope_to_gain: hopeToGainValue,
      application_data: appData
    };
    
    console.log('Sending response with data:', JSON.stringify({
      why_interested: responseData.why_interested,
      relevant_skills: responseData.relevant_skills,
      hope_to_gain: responseData.hope_to_gain,
      application_data: responseData.application_data,
      saved_why_interested: applicationObj.why_interested,
      saved_relevant_skills: applicationObj.relevant_skills,
      saved_hope_to_gain: applicationObj.hope_to_gain
    }, null, 2));
    
    res.status(201).json(responseData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /applications/:applicationId/status
router.put('/:applicationId/status', auth, async (req, res) => {
  try {
    const { 
      status, 
      application_status, 
      review_feedback, 
      isComplete,
      interview_date,
      interview_location
    } = req.body;
    
    const application = await Application.findOne({ application_id: req.params.applicationId });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Use application_status if provided, otherwise use status
    const newStatus = application_status || status;
    if (newStatus && !['pending', 'accepted', 'rejected', 'interview', 'under_review'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update status if provided
    if (newStatus) {
      application.status = newStatus;
    }
    
    // Update review feedback if provided
    if (review_feedback !== undefined) {
      application.review_feedback = review_feedback;
    }
    
    // Update isComplete if provided
    if (isComplete !== undefined) {
      application.isComplete = isComplete;
    }
    
    // Update interview details if provided
    if (interview_date) {
      application.interview_date = new Date(interview_date);
    }
    
    if (interview_location) {
      application.interview_location = interview_location;
    }

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /applications/:applicationId
router.delete('/:applicationId', auth, async (req, res) => {
  try {
    const application = await Application.findOne({ application_id: req.params.applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await Application.deleteOne({ application_id: req.params.applicationId });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;


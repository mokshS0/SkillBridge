# AI Integration Setup Guide (Google Gemini)

This guide will help you connect Google Gemini AI to your SkillBridge backend for AI-powered features.

## 🤖 AI Features

Your backend supports three AI features:
1. **Job Filtering** (`/generate-filter`) - AI-powered job recommendations
2. **Bio Generation** (`/generate-bio`) - AI-generated professional bios
3. **Chat Assistant** (`/api/chat`) - Career advice chatbot

## 📋 Prerequisites

- Google account
- Google AI Studio access (free)

## 🚀 Setup Steps

### Step 1: Get Your Gemini API Key

1. **Go to Google AI Studio:**
   - Visit https://aistudio.google.com
   - Sign in with your Google account

2. **Create an API Key:**
   - Click "Get API key" in the left sidebar
   - Click "Create API key"
   - Choose to create key in a new project or existing project
   - **Copy the API key immediately**

3. **Free Tier:**
   - Gemini API has a generous free tier
   - 60 requests per minute
   - Perfect for development and small projects!

### Step 2: Install Google Generative AI Package

In your `server` directory, run:

```powershell
cd Main\server
npm install @google/generative-ai
```

### Step 3: Add API Key to .env

Open your `server/.env` file and add:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=4000
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

**Important:** 
- Replace `your-actual-gemini-api-key-here` with your actual Gemini API key
- Never commit your `.env` file to Git (it's already in `.gitignore`)

### Step 4: Restart Your Server

```powershell
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

## ✅ Testing

### Test Bio Generation

1. Go to your Account Page in the frontend
2. Click "AI Suggestion" on the Bio section
3. Click "Generate Bio"
4. You should see an AI-generated bio!

### Test Job Filtering

1. Go to the main Interior page
2. Use the AI filter feature
3. You should get AI-recommended jobs based on your profile

### Test Chat Assistant

1. Go to the Messaging page
2. Ask a question about careers or jobs
3. Get AI-powered responses!

## 💰 Cost Information

**Google Gemini Free Tier:**
- **60 requests per minute** (free!)
- **1,500 requests per day** (free!)
- **No credit card required** for free tier
- Perfect for development and small projects

**Paid Tier (if needed):**
- Very affordable pricing
- Check https://ai.google.dev/pricing for current rates

**Example usage:**
- Free tier gives you plenty for development
- Most small projects won't need to pay

## 🔧 Troubleshooting

### "@google/generative-ai package not installed"
**Solution:** Run `npm install @google/generative-ai` in the server directory

### "Gemini not configured"
**Solution:** Make sure `GEMINI_API_KEY` is in your `.env` file

### "Invalid API key"
**Solution:** 
- Check that your API key is correct
- Make sure there are no extra spaces
- Verify the key is active in Google AI Studio

### "Quota exceeded"
**Solution:**
- Free tier: 60 requests/minute, 1,500/day
- Wait a minute and try again
- Or upgrade to paid tier if needed

### AI returns mock data
**Solution:**
- Check server logs for errors
- Verify API key is correct
- Make sure you restarted the server after adding the key

## 🎯 Features Explained

### 1. Job Filtering (`/generate-filter`)
- **Input:** User profile (skills, projects, history) + job postings
- **Output:** Top 5 recommended jobs
- **Uses:** Gemini Pro
- **Free tier:** 60 requests/minute

### 2. Bio Generation (`/generate-bio`)
- **Input:** User profile information
- **Output:** Professional bio (2-3 sentences)
- **Uses:** Gemini Pro
- **Free tier:** 60 requests/minute

### 3. Chat Assistant (`/api/chat`)
- **Input:** User message + context
- **Output:** Helpful career advice
- **Uses:** Gemini Pro
- **Free tier:** 60 requests/minute

## 🔒 Security Notes

- **Never commit your API key to Git**
- Keep your `.env` file secure
- Consider using environment variables in production
- Monitor your API usage in Google AI Studio
- Set up API key restrictions in Google Cloud Console if needed

## 📊 Monitoring Usage

Check your Gemini API usage:
- Dashboard: https://aistudio.google.com
- View API key usage and quotas
- Monitor requests in real-time

## 🚀 Production Tips

1. **Use environment variables** instead of `.env` file
2. **Set rate limiting** to prevent abuse
3. **Cache responses** for common queries
4. **Monitor usage** regularly
5. **Set up API key restrictions** in Google Cloud Console

## 🆘 Need Help?

- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api
- Support: Check Google AI Studio help section

## 🔄 Switching from OpenAI?

If you were using OpenAI before:
- The endpoints remain the same
- Just change the API key in `.env`
- Install `@google/generative-ai` instead of `openai`
- That's it! The frontend doesn't need any changes

---

**Note:** The AI features will work with mock data if Gemini is not configured, so your app won't break. But for real AI functionality, follow the steps above!

**Advantage of Gemini:** Free tier is very generous - perfect for getting started! 🎉

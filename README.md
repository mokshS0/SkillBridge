# SkillBridge

> A full-stack web application connecting students with job opportunities posted by teachers. Features role-based access control, AI-powered recommendations, and a comprehensive application management system.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Atlas account or local MongoDB)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mokshS0/SkillBridge.git
   cd SkillBridge
   ```

2. **Backend Setup:**
   ```bash
   cd Main/server
   npm install
   ```
   
   Create a `.env` file in `Main/server/`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
   JWT_SECRET=your-secret-key-here
   PORT=4000
   GEMINI_API_KEY=your-gemini-api-key (optional)
   ```
   
   Start the backend:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   Backend runs on `http://localhost:4000`

3. **Frontend Setup:**
   ```bash
   cd Main
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [User Roles](#-user-roles)
- [Project Structure](#️-project-structure)
- [API Documentation](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment-considerations)
- [Documentation](#-documentation)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration (Student/Teacher)
- JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Protected routes and API endpoints

### 👤 User Profile Management
- Personal information and school details
- Skills management with proficiency levels
- Projects portfolio
- Work/Education history
- Achievements tracking
- AI-powered bio generation

### 💼 Job Posting System
- Teachers create detailed job postings
- Admin approval workflow
- Job filtering by type and industry
- Status tracking (Pending → Approved/Declined)

### 📝 Application System
- Students submit applications with custom fields
- Application status workflow:
  - `pending` → `under_review` → `accepted`/`rejected`/`interview`
- Teacher review and feedback
- Interview scheduling (date and location)
- Auto-filtering of applied jobs

### 🤖 AI-Powered Features
- **AI Job Recommendations** - Personalized job suggestions
- **AI Bio Generator** - Professional bio generation
- **Mock Interview** - Interactive interview practice with TTS/STT

### 👨‍💼 Admin Dashboard
- Job posting approval system
- User management
- System-wide statistics
- Content moderation

### 👩‍🏫 Teacher Dashboard
- Job post management
- Application review interface
- Interview scheduling
- Application statistics

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **React Router DOM** 7.0.2 - Routing
- **PrimeReact** 10.9.1 - UI component library
- **SCSS/SASS** - Styling
- **Axios** 1.7.9 - HTTP client
- **JWT** - Authentication tokens

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **MongoDB** - Database (via Mongoose 7.5.0)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Generative AI** - AI integration (optional)

---

## 👥 User Roles

### 🎓 Student (Default)
- Browse and search job postings
- Apply to jobs with custom application fields
- View application status and feedback
- Manage profile (skills, projects, history, achievements)
- Access AI job recommendations
- Use mock interview feature

### 👨‍🏫 Teacher
- Create and manage job postings
- Review student applications
- Accept/reject/interview applications
- Provide feedback and reviews
- Schedule interviews
- View application statistics

### 👑 Admin
- Approve/decline job postings
- Manage all users
- View system-wide statistics
- Access admin dashboard
- Content moderation

---

## 🏗️ Project Structure

```
SkillBridge/
├── Main/
│   ├── server/              # Backend API
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # JWT authentication
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   └── index.js         # Server entry point
│   │
│   └── src/                 # Frontend React App
│       ├── components/      # React components (feature-based)
│       ├── assets/          # Images, fonts
│       ├── config/          # Configuration files
│       ├── context/         # React Context providers
│       └── utils/           # Utility functions
│
└── README.md                # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /sign-in` - User login
- `GET /get-user?username=...` - Get user by username
- `GET /get-user/:userId` - Get user by ID

### Users
- `POST /users` - Register new user
- `GET /users` - List all users (requires auth)
- `GET /users/:userId` - Get user details

### Job Postings
- `GET /job_postings` - List all job postings
- `GET /job_postings/pending` - List pending postings (admin)
- `POST /job_postings` - Create new posting (teacher, requires auth)
- `PUT /job_postings/:jobId` - Update posting (teacher, requires auth)
- `PUT /job_postings/:jobId/toggle-approval` - Approve/decline (admin)
- `DELETE /job_postings/:jobId` - Delete posting (teacher, requires auth)

### Applications
- `GET /applications` - List applications
- `GET /applications/job/:jobId` - Get applications for a job
- `GET /applications/user/:userId` - Get user's applications
- `POST /applications` - Create application (student, requires auth)
- `PUT /applications/:applicationId/status` - Update status (teacher, requires auth)
- `DELETE /applications/:applicationId` - Delete application (requires auth)

### AI Features
- `POST /generate-filter` - Generate job recommendations
- `POST /generate-bio` - Generate user bio
- `POST /api/interview/generate-questions` - Generate interview questions
- `POST /api/interview/text-to-speech` - Text-to-speech
- `POST /api/interview/speech-to-text` - Speech-to-text
- `POST /api/interview/generate-feedback` - Generate interview feedback

> **Note:** See `Main/server/README.md` for complete API documentation.

---

## 📊 Database Schema

### Collections
- **User** - User accounts with role-based permissions
- **JobPosting** - Job postings with approval status
- **Application** - Student applications with status tracking
- **UserSkill** - User skills with proficiency levels
- **UserProject** - User project portfolio
- **UserHistory** - Work/education history
- **UserAchievement** - User achievements

> **Note:** See `PROJECT_SUMMARY.md` for detailed schema definitions.

---

## 🚀 Deployment Considerations

### Frontend (React)
- **Build Command:** `npm run build`
- **Output Directory:** `build/`
- **Deployment Options:**
  - Vercel (recommended)
  - Netlify
  - GitHub Pages
  - AWS S3 + CloudFront

### Backend (Node.js/Express)
- **Deployment Options:**
  - Vercel (serverless functions)
  - Railway
  - Render
  - Heroku
  - AWS EC2/Lambda

### Database
- **MongoDB Atlas** (recommended for cloud deployment)
- Connection string in environment variables

### Environment Variables Required
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 4000)
- `GEMINI_API_KEY` - Optional, for AI features

---

## 📚 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project summary
- **[Main/README.md](./Main/README.md)** - Main project documentation
- **[Main/server/README.md](./Main/server/README.md)** - Backend API documentation
- **[Main/PROJECT_STRUCTURE.md](./Main/PROJECT_STRUCTURE.md)** - Project structure guide
- **[Main/MONGODB_MANAGEMENT.md](./Main/MONGODB_MANAGEMENT.md)** - MongoDB setup guide
- **[Main/server/AI_SETUP.md](./Main/server/AI_SETUP.md)** - AI integration setup

---

## 🔐 Security Features

- **Password Security:** bcryptjs hashing (salt rounds: 10)
- **Authentication:** JWT token-based (7-day expiration)
- **Route Protection:** Middleware-based with role-based access control
- **API Security:** CORS enabled, request validation, secure error handling

---

## 📝 Current Status

### ✅ Fully Implemented
- User authentication and registration
- Role-based access control (Student, Teacher, Admin)
- Job posting creation and management
- Application submission and review
- User profile management
- Admin approval system
- Mock interview feature

### 🔄 Demo Mode Features
- AI job recommendations (mock data)
- AI bio generation (mock data with fallback)
- Mock interview (browser SpeechSynthesis, mock STT)

### 🔧 Production-Ready Enhancements
- Real AI integration (uncomment AI code in `routes/ai.js`)
- Production TTS/STT services
- Email notifications
- File upload for resumes/projects
- Real-time notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Private project - All rights reserved

---

## 👤 Author

**mokshS0**

- GitHub: [@mokshS0](https://github.com/mokshS0)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Feature Complete, Ready for Deployment


# SkillBridge Backend API

Complete Express + MongoDB backend for the SkillBridge platform.

## 📁 Project Structure

```
server/
├── config/          # Database configuration
├── middleware/      # Authentication middleware
├── models/         # MongoDB schemas (User, JobPosting, Application, etc.)
├── routes/         # API route handlers
│   ├── auth.js           # Authentication endpoints
│   ├── users.js          # User management
│   ├── jobPostings.js    # Job posting CRUD
│   ├── applications.js   # Application management
│   ├── userProfile.js    # User profile data (skills, projects, etc.)
│   └── ai.js             # AI features (placeholder)
└── index.js        # Main server file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB

### Setup

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Create `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-this
   PORT=4000
   ```

3. **Start the server:**
   ```powershell
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication
- `POST /sign-in` - Login with username/password
- `GET /get-user?username=...` - Get user by username
- `GET /get-user/:userId` - Get user by ID

### Users
- `POST /users` - Register new user
- `GET /users` - List all users
- `GET /users/:userId` - Get user details
- `GET /users/:userId/job-posts/count` - Get user's job post count
- `GET /users/:userId/projects/count` - Get user's project count

### Job Postings
- `GET /job_postings` - List all job postings
- `GET /job_postings/pending` - List pending postings
- `GET /job_postings/:jobId` - Get specific posting
- `POST /job_postings` - Create new posting
- `PUT /job_postings/:jobId` - Update posting
- `PUT /job_postings/:jobId/toggle-approval` - Toggle approval
- `DELETE /job_postings/:jobId` - Delete posting

### Applications
- `GET /applications` - List applications (supports ?job_id= & ?user_id=)
- `GET /applications/job/:jobId` - Get applications for a job
- `GET /applications/user/:userId` - Get user's applications
- `POST /applications` - Create application
- `PUT /applications/:applicationId/status` - Update status
- `DELETE /applications/:applicationId` - Delete application

### User Profile Data
- `GET /user_skills?user_id=...` - Get user skills
- `POST /user_skills` - Add skill
- `PUT /user_skills/:id` - Update skill
- `DELETE /user_skills/:id` - Delete skill

- `GET /user_projects?user_id=...` - Get user projects
- `POST /user_projects` - Add project
- `PUT /user_projects/:id` - Update project
- `DELETE /user_projects/:id` - Delete project

- `GET /user_history?user_id=...` - Get user history
- `POST /user_history` - Add history entry
- `PUT /user_history/:id` - Update history
- `DELETE /user_history/:id` - Delete history

- `GET /user_achievements?user_id=...` - Get achievements
- `POST /user_achievements` - Add achievement
- `PUT /user_achievements/:id` - Update achievement
- `DELETE /user_achievements/:id` - Delete achievement

### AI Features (Placeholder)
- `POST /generate-filter` - Generate job filters
- `POST /generate-bio` - Generate user bio

## 🔐 Authentication

Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <your-token>
```

## 🗄️ Database Models

- **User** - User accounts with profile information
- **JobPosting** - Job postings created by teachers
- **Application** - Job applications from students
- **UserSkill** - User skills
- **UserProject** - User projects
- **UserHistory** - Work/education history
- **UserAchievement** - User achievements

## 🔧 MongoDB Setup

### Using MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create a cluster (free tier available)
3. Create database user in "Database Access"
4. Whitelist IP in "Network Access" (or allow from anywhere for dev)
5. Get connection string from "Connect" → "Connect your application"
6. Update `.env` with your connection string

### Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://127.0.0.1:27017/skillbridge`

## ⚠️ Troubleshooting

**"bad auth : authentication failed"**
- Check username/password in connection string
- Verify database user exists in MongoDB Atlas
- URL-encode special characters in password (@ → %40, # → %23, etc.)

**"Cannot find module"**
- Run `npm install` in server directory

**Port already in use**
- Change `PORT` in `.env` file

## 📝 Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- AI endpoints return mock data (integrate OpenAI for production)
- For production, use a strong `JWT_SECRET` and restrict MongoDB network access

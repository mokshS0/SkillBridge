# SkillBridge Backend

Express + MongoDB API for SkillBridge.

## Structure

```
server/
├── config/
├── middleware/
├── models/
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── jobPostings.js
│   ├── applications.js
│   ├── userProfile.js
│   └── ai.js
└── index.js
```

## Setup

Needs Node.js (v14+) and MongoDB.

```
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this
PORT=4000
```

```
npm run dev   # with auto-reload
npm start     # production
```

## API

Auth
- `POST /sign-in`
- `GET /get-user?username=...`
- `GET /get-user/:userId`

Users
- `POST /users`
- `GET /users`
- `GET /users/:userId`
- `GET /users/:userId/job-posts/count`
- `GET /users/:userId/projects/count`

Job postings
- `GET /job_postings`
- `GET /job_postings/pending`
- `GET /job_postings/:jobId`
- `POST /job_postings`
- `PUT /job_postings/:jobId`
- `PUT /job_postings/:jobId/toggle-approval`
- `DELETE /job_postings/:jobId`

Applications
- `GET /applications` (supports `?job_id=` and `?user_id=`)
- `GET /applications/job/:jobId`
- `GET /applications/user/:userId`
- `POST /applications`
- `PUT /applications/:applicationId/status`
- `DELETE /applications/:applicationId`

Profile data
- skills / projects / history / achievements under `/user_skills`, `/user_projects`, `/user_history`, `/user_achievements` (GET/POST/PUT/DELETE)

AI
- `POST /generate-filter`
- `POST /generate-bio`

Most endpoints need a JWT:

```
Authorization: Bearer <token>
```

## Models

User, JobPosting, Application, UserSkill, UserProject, UserHistory, UserAchievement

## MongoDB

Atlas: create a cluster, DB user, whitelist your IP, copy the connection string into `.env`.

Local: `mongodb://127.0.0.1:27017/skillbridge`

## Troubleshooting

Auth failed — check username/password in the URI; URL-encode special characters in the password.

Missing module — run `npm install` in this folder.

Port in use — change `PORT` in `.env`.

Passwords are hashed with bcrypt. JWTs expire after 7 days. Use a strong `JWT_SECRET` in production.

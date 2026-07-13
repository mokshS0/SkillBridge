# SkillBridge

Web app that connects students with job opportunities posted by teachers. Includes role-based access, applications, and some AI-assisted features.

## Setup

You need Node.js, MongoDB (Atlas or local), and npm.

```bash
git clone https://github.com/mokshS0/SkillBridge.git
cd SkillBridge
```

Backend:

```bash
cd Main/server
npm install
```

Create a `.env` file in `Main/server/`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
JWT_SECRET=your-secret-key-here
PORT=4000
GEMINI_API_KEY=your-gemini-api-key
```

`GEMINI_API_KEY` is optional. Then run `npm start` (or `npm run dev`). Backend is at `http://localhost:4000`.

Frontend:

```bash
cd Main
npm install
npm start
```

Frontend is at `http://localhost:3000`.

## Features

- Auth with JWT and roles (student, teacher, admin)
- Profiles with skills, projects, history, achievements
- Teachers post jobs; admins approve them
- Students apply; teachers review, give feedback, schedule interviews
- AI bio generator, job recommendations, and mock interview (TTS/STT)

## Tech

Frontend: React, React Router, PrimeReact, SCSS, Axios

Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, Google Generative AI (optional)

## Roles

Student — browse jobs, apply, manage profile, use AI features

Teacher — create/manage posts, review applications, schedule interviews

Admin — approve posts, manage users, view stats

## Project structure

```
SkillBridge/
├── Main/
│   ├── server/       # backend API
│   └── src/          # React frontend
└── README.md
```

## API overview

Auth: `POST /sign-in`, `GET /get-user`

Users: `POST /users`, `GET /users`, `GET /users/:userId`

Jobs: `GET/POST /job_postings`, `PUT /job_postings/:jobId`, approve via `PUT /job_postings/:jobId/toggle-approval`

Applications: `GET/POST /applications`, status update and delete endpoints

AI: `/generate-filter`, `/generate-bio`, `/api/interview/*`

Full details are in `Main/server/README.md`.

## Database

Collections: User, JobPosting, Application, UserSkill, UserProject, UserHistory, UserAchievement

## Env vars

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (default 4000)
- `GEMINI_API_KEY` (optional)

## Docs

- `Main/README.md` — main project notes
- `Main/server/README.md` — backend API
- `Main/server/AI_SETUP.md` — AI setup
- `Main/MONGODB_MANAGEMENT.md` — MongoDB notes

## Author

[mokshS0](https://github.com/mokshS0)

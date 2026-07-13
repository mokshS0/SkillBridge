# SkillBridge

Full-stack app connecting students with job opportunities and teachers with applicants.

## Structure

```
SkillBridge/
├── server/          # Node + Express + MongoDB API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
│
└── src/             # React frontend
    ├── components/
    ├── assets/
    ├── config/
    ├── context/
    └── utils/
```

## Setup

Needs Node.js (v14+), MongoDB, and npm.

Backend:

```
cd server
npm install
```

Create `server/.env`:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this
PORT=4000
```

Then `npm start` or `npm run dev`. Runs on `http://localhost:4000`.

Frontend (from `Main/`):

```
npm install
npm start
```

Runs on `http://localhost:3000`. Frontend points at `http://localhost:4000` by default (`src/config/config.js`).

## Tech

Backend: Node, Express, MongoDB/Mongoose, JWT, bcryptjs

Frontend: React, React Router, PrimeReact, SCSS, Axios

## Features

User auth, job posts, applications, profiles (skills/projects/history/achievements), admin dashboard, student/teacher roles.

## Production build

Frontend: `npm run build` (output in `build/`)

Backend: `cd server && npm start`

API docs: [server/README.md](./server/README.md)

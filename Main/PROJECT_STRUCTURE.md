# SkillBridge Project Structure

## 📂 Directory Overview

```
Main/
├── server/                    # 🔵 BACKEND (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── JobPosting.js
│   │   ├── Application.js
│   │   ├── UserSkill.js
│   │   ├── UserProject.js
│   │   ├── UserHistory.js
│   │   └── UserAchievement.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js            # User management
│   │   ├── jobPostings.js     # Job posting CRUD
│   │   ├── applications.js    # Application management
│   │   ├── userProfile.js     # Profile data (skills, projects, etc.)
│   │   └── ai.js              # AI features (placeholder)
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend documentation
│
└── src/                       # 🟢 FRONTEND (React)
    ├── components/            # React components (organized by feature)
    │   ├── AccountPage/       # User account management
    │   ├── AdminDashBoard/    # Admin dashboard
    │   ├── AdminPanel/        # Admin panel
    │   ├── ContactDashBoard/  # Contact/FAQ dashboard
    │   ├── Footer/            # Footer component
    │   ├── Home/              # Home/landing page
    │   ├── Interior/          # Main interior pages
    │   ├── Layout/            # Layout components
    │   ├── MenubarLanding/    # Landing page menu
    │   ├── MenuInterior/      # Interior menu
    │   ├── MessagingPage/     # Messaging interface
    │   ├── PreviewModule/     # Preview components
    │   ├── SignIn/            # Sign in page
    │   ├── SignUp/            # Sign up page
    │   └── UserPosts/         # User posts management
    ├── assets/                # Static assets
    │   ├── fonts/             # Custom fonts
    │   └── img/               # Images
    ├── config/
    │   └── config.js          # API base URL configuration
    ├── context/
    │   └── AuthContext.js     # Authentication context provider
    ├── utils/
    │   └── auth.js            # Authentication utilities
    ├── App.js                 # Main App component
    ├── index.js               # React entry point
    └── package.json           # Frontend dependencies
```

## 🔵 Backend Structure (`server/`)

### Purpose
Handles all API requests, database operations, and business logic.

### Key Files
- **`index.js`** - Main server file, sets up Express, middleware, and routes
- **`config/db.js`** - MongoDB connection configuration
- **`middleware/auth.js`** - JWT token verification
- **`models/`** - Database schemas (Mongoose models)
- **`routes/`** - API endpoint handlers

### API Endpoints
All endpoints are documented in `server/README.md`

## 🟢 Frontend Structure (`src/`)

### Purpose
User interface built with React.

### Key Directories
- **`components/`** - React components organized by feature/page
- **`assets/`** - Static files (images, fonts)
- **`config/`** - Configuration files
- **`context/`** - React Context providers
- **`utils/`** - Utility functions

### Component Organization
Components are organized by feature/page:
- **AccountPage** - User profile management
- **Interior** - Main application pages
- **AdminDashBoard/AdminPanel** - Admin functionality
- **SignIn/SignUp** - Authentication pages
- **UserPosts** - Post management

## 🔐 Environment Files

### Backend
- **Location**: `server/.env`
- **Required variables**:
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret key for JWT tokens
  - `PORT` - Server port (default: 4000)

### Frontend
- **Location**: `src/config/config.js`
- **Configuration**: API base URL (`http://localhost:4000`)

## 📦 Dependencies

### Backend (`server/package.json`)
- Express - Web framework
- Mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin requests
- dotenv - Environment variables
- morgan - HTTP request logger

### Frontend (`package.json`)
- React - UI framework
- React Router - Routing
- PrimeReact - UI component library
- Axios - HTTP client
- SCSS - Styling

## 🚀 Running the Project

### Backend
```powershell
cd server
npm install
npm start
```

### Frontend
```powershell
npm install
npm start
```

## 📝 Notes

- Backend and frontend are completely separated
- Backend runs on port 4000
- Frontend runs on port 3000
- Frontend proxies API requests to backend during development
- All sensitive data (MongoDB URI, JWT secret) should be in `.env` files (not committed to Git)


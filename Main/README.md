# SkillBridge Platform

A full-stack platform connecting students with job opportunities and teachers with talent.

## 📁 Project Structure

```
SkillBridge/
├── server/              # Backend API (Node.js + Express + MongoDB)
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
│
└── src/                # Frontend (React)
    ├── components/     # React components
    │   ├── AccountPage/      # User account management
    │   ├── AdminDashBoard/   # Admin dashboard
    │   ├── AdminPanel/       # Admin panel
    │   ├── ContactDashBoard/ # Contact/FAQ dashboard
    │   ├── Footer/           # Footer component
    │   ├── Home/             # Home page
    │   ├── Interior/         # Main interior pages
    │   ├── Layout/           # Layout components
    │   ├── MenubarLanding/   # Landing page menu
    │   ├── MenuInterior/     # Interior menu
    │   ├── MessagingPage/    # Messaging interface
    │   ├── PreviewModule/    # Preview components
    │   ├── SignIn/           # Sign in page
    │   ├── SignUp/           # Sign up page
    │   └── UserPosts/        # User posts management
    ├── assets/         # Static assets (images, fonts)
    ├── config/         # Frontend configuration
    ├── context/        # React context providers
    └── utils/          # Utility functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**
   ```powershell
   cd server
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-this
   PORT=4000
   ```

4. **Start the backend:**
   ```powershell
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to project root:**
   ```powershell
   cd ..
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the frontend:**
   ```powershell
   npm start
   ```

The frontend will run on `http://localhost:3000`

## 📚 Documentation

- **Backend API**: See [server/README.md](./server/README.md) for complete API documentation
- **Frontend**: React components organized by feature/page

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **PrimeReact** - UI component library
- **SCSS** - Styling
- **Axios** - HTTP client

## 🔐 Environment Variables

### Backend (.env in `server/` folder)
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=4000
```

### Frontend
The frontend is configured to connect to `http://localhost:4000` by default (see `src/config/config.js`)

## 📝 Development Workflow

1. Start MongoDB (local or ensure Atlas is accessible)
2. Start backend server: `cd server && npm start`
3. Start frontend: `npm start` (from root)
4. Open browser to `http://localhost:3000`

## 🗂️ Key Features

- User authentication and authorization
- Job posting management
- Application system
- User profiles (skills, projects, history, achievements)
- Admin dashboard
- Teacher/Student role separation

## 📦 Build for Production

### Backend
```powershell
cd server
npm start
```

### Frontend
```powershell
npm run build
```
This creates an optimized production build in the `build/` folder.

## 🤝 Contributing

1. Ensure backend and frontend are properly separated
2. Follow the existing folder structure
3. Update documentation as needed

## 📄 License

Private project

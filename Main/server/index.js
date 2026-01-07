const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');

// Import all routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const jobPostingsRoutes = require('./routes/jobPostings');
const applicationsRoutes = require('./routes/applications');
const userProfileRoutes = require('./routes/userProfile');
const aiRoutes = require('./routes/ai');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/sign-in', authRoutes); // Also support /sign-in directly
app.use('/get-user', authRoutes); // Also support /get-user directly
app.use('/users', usersRoutes);
app.use('/job_postings', jobPostingsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/', userProfileRoutes); // User profile routes are at root level
app.use('/', aiRoutes); // AI routes are at root level
app.use('/api', aiRoutes); // Also support /api/chat

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send({ ok: true, message: 'SkillBridge backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

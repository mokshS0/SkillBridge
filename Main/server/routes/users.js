const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const JobPosting = require('../models/JobPosting');
const UserProject = require('../models/UserProject');
const auth = require('../middleware/auth');

// POST /users (register)
router.post('/', async (req, res) => {
  try {
    const {
      real_name,
      personal_email,
      phone_number,
      birth_date,
      school_name,
      school_district,
      school_email,
      account_username,
      password,
      is_teacher,
      city,
      state,
      profile_img_url
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { account_username: account_username },
        { personal_email: personal_email }
      ]
    });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      real_name,
      personal_email,
      phone_number,
      birth_date: birth_date ? new Date(birth_date) : undefined,
      school_name,
      school_district,
      school_email,
      account_username,
      password: hashedPassword,
      is_teacher: is_teacher || false,
      city,
      state,
      profile_img_url: profile_img_url || 'https://i.pinimg.com/736x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg'
    });

    await user.save();

    res.status(201).json({ 
      message: 'User created successfully',
      user_id: user.user_id 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users (list all users)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users/:userId
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users/:userId/job-posts/count
router.get('/:userId/job-posts/count', auth, async (req, res) => {
  try {
    const count = await JobPosting.countDocuments({ user_id: req.params.userId });
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users/:userId/projects/count
router.get('/:userId/projects/count', auth, async (req, res) => {
  try {
    const count = await UserProject.countDocuments({ user_id: req.params.userId });
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /users/:userId/admin-status
router.get('/:userId/admin-status', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ isAdmin: user.isAdmin || false });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /users/:userId (update user)
router.put('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only fields that are provided in the request
    const allowedFields = [
      'real_name',
      'personal_email',
      'phone_number',
      'birth_date',
      'school_name',
      'school_district',
      'school_email',
      'account_username',
      'city',
      'state',
      'bio',
      'profile_img_url',
      'avatar_name'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'birth_date' && req.body[field]) {
          user[field] = new Date(req.body[field]);
        } else {
          user[field] = req.body[field];
        }
      }
    });

    await user.save();

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;


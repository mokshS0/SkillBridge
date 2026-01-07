const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /sign-in (username-based login)
// This route works when mounted at /sign-in (route is '/')
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ account_username: username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials', error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials', error: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id.toString(), user_id: user.user_id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: {
        user_id: user.user_id,
        account_username: user.account_username,
        real_name: user.real_name,
        personal_email: user.personal_email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /get-user?username=... or /get-user?userId=...
// This route works when mounted at /get-user (route is '/')
router.get('/', auth, async (req, res) => {
  try {
    const { username, userId } = req.query;
    let user;

    if (username) {
      user = await User.findOne({ account_username: username });
    } else if (userId) {
      user = await User.findOne({ user_id: userId });
    } else {
      return res.status(400).json({ message: 'Username or userId required' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return as array format expected by frontend
    res.json([{
      user_id: user.user_id,
      real_name: user.real_name,
      personal_email: user.personal_email,
      phone_number: user.phone_number,
      birth_date: user.birth_date,
      school_name: user.school_name,
      school_district: user.school_district,
      school_email: user.school_email,
      account_username: user.account_username,
      is_teacher: user.is_teacher,
      city: user.city,
      state: user.state,
      bio: user.bio,
      profile_img_url: user.profile_img_url,
      avatar_name: user.avatar_name,
      created_at: user.created_at,
      isAdmin: user.isAdmin
    }]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /get-user/:userId
// This route works when mounted at /get-user (route is '/:userId')
router.get('/:userId', auth, async (req, res) => {
  // Only handle if it looks like a MongoDB ObjectId (24 hex characters)
  // This prevents conflicts with the query param route above
  if (req.params.userId && req.params.userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(req.params.userId)) {
    try {
      const user = await User.findOne({ user_id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user_id: user.user_id,
        real_name: user.real_name,
        personal_email: user.personal_email,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        school_name: user.school_name,
        school_district: user.school_district,
        school_email: user.school_email,
        account_username: user.account_username,
        is_teacher: user.is_teacher,
        city: user.city,
        state: user.state,
        bio: user.bio,
        profile_img_url: user.profile_img_url,
        avatar_name: user.avatar_name,
        created_at: user.created_at,
        isAdmin: user.isAdmin
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else {
    // If not a valid ObjectId format, let it fall through (might be handled by query param route)
    res.status(400).json({ message: 'Invalid userId format' });
  }
});

module.exports = router;

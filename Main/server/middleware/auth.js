const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

  const parts = authHeader.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = decoded.user;
    
    // Ensure user_id is available
    if (!req.user.user_id && req.user.id) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          req.user.user_id = user.user_id;
        }
      } catch (err) {
        // If user lookup fails, continue anyway
        console.error('Error fetching user in auth middleware:', err);
      }
    }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

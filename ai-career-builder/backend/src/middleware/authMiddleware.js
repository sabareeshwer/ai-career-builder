const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_jwt_key_career_builder_2026_fsd'
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found for this token' });
      }

      req.user = {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
      };

      next();
    } catch (error) {
      console.error('JWT auth verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }
};

module.exports = { protect };

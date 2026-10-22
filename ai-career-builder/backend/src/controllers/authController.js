const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecret_jwt_key_career_builder_2026_fsd',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      targetRole: targetRole || 'Software Engineer',
      bio: 'Enthusiastic developer focused on building scalable, user-centric software.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    });

    const token = generateToken(user._id || user.id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        bio: user.bio,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server registration error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id || user.id);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        bio: user.bio,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server login error' });
  }
};

// @desc    Instant Demo Login (Evaluator / College Demo)
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'student.demo@college.edu';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('DemoPass2026!', salt);

      user = await User.create({
        name: 'Alex Rivera (FSD Candidate)',
        email: demoEmail,
        password: hashedPassword,
        targetRole: 'Full Stack Engineer & AI Specialist',
        bio: 'Senior Computer Science student passionate about full stack architectures, cloud computing, and AI engineering.',
        skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS', 'TypeScript', 'Docker', 'Python'],
      });
    }

    const token = generateToken(user._id || user.id);

    return res.json({
      success: true,
      isDemo: true,
      token,
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        bio: user.bio,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Demo login error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        bio: user.bio,
        skills: user.skills,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, targetRole, bio, skills, password } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (targetRole) updateFields.targetRole = targetRole;
    if (bio !== undefined) updateFields.bio = bio;
    if (skills) updateFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        targetRole: updatedUser.targetRole,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  demoLogin,
  getProfile,
  updateProfile,
};

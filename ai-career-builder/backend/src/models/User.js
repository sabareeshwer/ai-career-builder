const mongoose = require('mongoose');
const { createModelAdapter } = require('../config/storageEngine');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  targetRole: {
    type: String,
    default: 'Software Engineer',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const User = createModelAdapter(UserModel, 'users');

module.exports = { User, UserModel };

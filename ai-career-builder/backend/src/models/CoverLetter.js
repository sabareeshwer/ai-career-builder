const mongoose = require('mongoose');
const { createModelAdapter } = require('../config/storageEngine');

const coverLetterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  title: {
    type: String,
    default: 'Cover Letter',
  },
  applicantName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  recipientRole: {
    type: String,
    default: 'Hiring Team',
  },
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    enum: ['professional', 'enthusiastic', 'concise', 'creative'],
    default: 'professional',
  },
  keySkills: [{
    type: String,
  }],
  experienceHighlight: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const CoverLetterModel = mongoose.models.CoverLetter || mongoose.model('CoverLetter', coverLetterSchema);
const CoverLetter = createModelAdapter(CoverLetterModel, 'cover_letters');

module.exports = { CoverLetter, CoverLetterModel };

const mongoose = require('mongoose');
const { createModelAdapter } = require('../config/storageEngine');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  title: {
    type: String,
    default: 'My ATS Resume',
  },
  template: {
    type: String,
    enum: ['modern', 'executive', 'tech'],
    default: 'modern',
  },
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    professionalTitle: { type: String, default: '' },
  },
  summary: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String,
    gpa: String,
    details: String,
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    bullets: [String],
  }],
  internships: [{
    company: String,
    role: String,
    duration: String,
    highlights: String,
  }],
  projects: [{
    title: String,
    description: String,
    technologies: String,
    liveUrl: String,
    githubUrl: String,
  }],
  certifications: [{
    title: String,
    issuer: String,
    date: String,
    credentialUrl: String,
  }],
  achievements: [{
    title: String,
    description: String,
  }],
  atsScore: {
    type: Number,
    default: 85,
  },
  atsAnalysis: {
    keywords: [String],
    suggestions: [String],
    strengths: [String],
    formattingTips: [String],
  },
}, {
  timestamps: true,
});

const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
const Resume = createModelAdapter(ResumeModel, 'resumes');

module.exports = { Resume, ResumeModel };

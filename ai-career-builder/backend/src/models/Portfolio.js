const mongoose = require('mongoose');
const { createModelAdapter } = require('../config/storageEngine');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  title: {
    type: String,
    default: 'My Developer Portfolio',
  },
  theme: {
    type: String,
    enum: ['cyber-dark', 'elegant-indigo', 'minimal-light'],
    default: 'elegant-indigo',
  },
  hero: {
    name: { type: String, default: '' },
    tagline: { type: String, default: 'Full Stack Developer & AI Engineer' },
    headline: { type: String, default: 'Crafting responsive, high-performance web applications and AI solutions.' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      email: { type: String, default: '' },
    },
  },
  about: {
    story: { type: String, default: '' },
    experienceYears: { type: String, default: '2+' },
    projectsCount: { type: String, default: '10+' },
    satisfiedClients: { type: String, default: '100%' },
    interests: [String],
  },
  skills: [{
    name: String,
    category: String,
    level: Number, // 1 - 100
  }],
  projects: [{
    title: String,
    description: String,
    tags: [String],
    demoUrl: String,
    githubUrl: String,
    featured: Boolean,
  }],
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    grade: String,
  }],
  contact: {
    email: String,
    phone: String,
    location: String,
    customMessage: String,
  },
}, {
  timestamps: true,
});

const PortfolioModel = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
const Portfolio = createModelAdapter(PortfolioModel, 'portfolios');

module.exports = { Portfolio, PortfolioModel };

const mongoose = require('mongoose');
const { createModelAdapter } = require('../config/storageEngine');

const careerRecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  inputs: {
    degree: String,
    major: String,
    experienceLevel: String,
    skills: [String],
    interests: [String],
    careerGoal: String,
  },
  recommendedRoles: [{
    title: String,
    matchPercentage: Number,
    description: String,
    salaryRange: String,
    demandLevel: String,
    matchingSkills: [String],
    missingSkills: [String],
    keyResponsibilities: [String],
  }],
  learningRoadmap: [{
    phase: String,
    title: String,
    timeframe: String,
    objective: String,
    modules: [{
      title: String,
      resources: String,
      skillsCovered: [String],
    }],
  }],
  generalAdvice: [String],
  score: {
    type: Number,
    default: 78,
  },
}, {
  timestamps: true,
});

const CareerRecommendationModel = mongoose.models.CareerRecommendation || mongoose.model('CareerRecommendation', careerRecommendationSchema);
const CareerRecommendation = createModelAdapter(CareerRecommendationModel, 'career_recommendations');

module.exports = { CareerRecommendation, CareerRecommendationModel };

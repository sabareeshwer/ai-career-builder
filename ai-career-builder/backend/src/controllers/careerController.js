const { CareerRecommendation } = require('../models/CareerRecommendation');
const aiService = require('../services/aiService');

// @desc    Get latest career recommendation for user
// @route   GET /api/career/latest
// @access  Private
const getLatestCareer = async (req, res) => {
  try {
    const list = await CareerRecommendation.find({ user: req.user._id });
    if (!list || list.length === 0) {
      return res.json({ success: true, recommendation: null });
    }
    return res.json({ success: true, recommendation: list[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all recommendation history
// @route   GET /api/career/history
// @access  Private
const getCareerHistory = async (req, res) => {
  try {
    const history = await CareerRecommendation.find({ user: req.user._id });
    return res.json({ success: true, count: history.length, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI Career Recommendation & Save
// @route   POST /api/career/analyze
// @access  Private
const analyzeCareerProfile = async (req, res) => {
  try {
    const { degree, major, skills, interests, experienceLevel } = req.body;

    const skillsArray = Array.isArray(skills)
      ? skills
      : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const interestsArray = Array.isArray(interests)
      ? interests
      : (typeof interests === 'string' ? interests.split(',').map(i => i.trim()).filter(Boolean) : []);

    const aiResult = await aiService.generateCareerRecommendations({
      degree,
      major,
      skills: skillsArray,
      interests: interestsArray,
      experienceLevel,
    });

    // Save to Database
    const saved = await CareerRecommendation.create({
      user: req.user._id,
      inputs: {
        degree,
        major,
        experienceLevel: experienceLevel || 'Student / Fresher',
        skills: skillsArray,
        interests: interestsArray,
      },
      recommendedRoles: aiResult.recommendedRoles,
      learningRoadmap: aiResult.learningRoadmap,
      generalAdvice: aiResult.generalAdvice,
      score: aiResult.score,
    });

    return res.status(201).json({
      success: true,
      recommendation: saved,
      isDemoMode: aiResult.isDemoMode,
      aiEngine: aiResult.aiEngine,
      message: 'AI Career analysis and learning roadmap generated successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLatestCareer,
  getCareerHistory,
  analyzeCareerProfile,
};

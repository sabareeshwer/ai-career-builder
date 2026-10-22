const { Resume } = require('../models/Resume');
const aiService = require('../services/aiService');

// @desc    Get all resumes for the authenticated user
// @route   GET /api/resumes
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    return res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    return res.json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id,
    };

    // Calculate ATS score on save if not provided
    const atsReview = await aiService.analyzeResumeATS({
      resumeData,
      targetRole: resumeData.personalInfo?.professionalTitle || 'Software Engineer',
    });

    resumeData.atsScore = atsReview.score;
    resumeData.atsAnalysis = atsReview.analysis;

    const resume = await Resume.create(resumeData);
    return res.status(201).json({ success: true, resume, message: 'Resume created and ATS analyzed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const existing = await Resume.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const updatedData = { ...req.body };

    // Update ATS Score
    const atsReview = await aiService.analyzeResumeATS({
      resumeData: updatedData,
      targetRole: updatedData.personalInfo?.professionalTitle || 'Software Engineer',
    });

    updatedData.atsScore = atsReview.score;
    updatedData.atsAnalysis = atsReview.analysis;

    const updated = await Resume.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    return res.json({ success: true, resume: updated, message: 'Resume saved and ATS score updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    await Resume.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Resume removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Generate Resume Summary
// @route   POST /api/resumes/ai/summary
// @access  Private
const generateAISummary = async (req, res) => {
  try {
    const { name, role, skills, experienceYears, highlights } = req.body;
    const result = await aiService.generateResumeSummary({
      name: name || req.user.name,
      role,
      skills,
      experienceYears,
      highlights,
    });
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI ATS Review & Keyword Analyzer
// @route   POST /api/resumes/ai/review
// @access  Private
const reviewResumeATS = async (req, res) => {
  try {
    const { resumeData, targetRole } = req.body;
    const result = await aiService.analyzeResumeATS({
      resumeData,
      targetRole: targetRole || 'Software Engineer',
    });
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateAISummary,
  reviewResumeATS,
};

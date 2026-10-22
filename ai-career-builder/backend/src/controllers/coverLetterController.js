const { CoverLetter } = require('../models/CoverLetter');
const aiService = require('../services/aiService');

// @desc    Get user cover letters
// @route   GET /api/cover-letters
// @access  Private
const getUserCoverLetters = async (req, res) => {
  try {
    const letters = await CoverLetter.find({ user: req.user._id });
    return res.json({ success: true, count: letters.length, letters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cover letter by ID
// @route   GET /api/cover-letters/:id
// @access  Private
const getCoverLetterById = async (req, res) => {
  try {
    const letter = await CoverLetter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Cover letter not found' });
    }
    return res.json({ success: true, letter });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create cover letter
// @route   POST /api/cover-letters
// @access  Private
const createCoverLetter = async (req, res) => {
  try {
    const letterData = {
      ...req.body,
      user: req.user._id,
    };
    const letter = await CoverLetter.create(letterData);
    return res.status(201).json({ success: true, letter, message: 'Cover letter saved to database' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cover letter
// @route   PUT /api/cover-letters/:id
// @access  Private
const updateCoverLetter = async (req, res) => {
  try {
    const existing = await CoverLetter.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Cover letter not found' });
    }
    const updated = await CoverLetter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, letter: updated, message: 'Cover letter updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete cover letter
// @route   DELETE /api/cover-letters/:id
// @access  Private
const deleteCoverLetter = async (req, res) => {
  try {
    const existing = await CoverLetter.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Cover letter not found' });
    }
    await CoverLetter.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Cover letter deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Generate Cover Letter
// @route   POST /api/cover-letters/ai/generate
// @access  Private
const generateAICoverLetter = async (req, res) => {
  try {
    const { applicantName, recipientRole, companyName, jobTitle, jobDescription, relevantSkills, tone } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Please provide company name and job title' });
    }

    const result = await aiService.generateCoverLetter({
      applicantName: applicantName || req.user.name,
      recipientRole,
      companyName,
      jobTitle,
      jobDescription,
      relevantSkills,
      tone,
    });

    return res.json({
      success: true,
      ...result,
      metadata: {
        companyName,
        jobTitle,
        applicantName: applicantName || req.user.name,
        tone: tone || 'professional',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserCoverLetters,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
  generateAICoverLetter,
};

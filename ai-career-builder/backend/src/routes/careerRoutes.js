const express = require('express');
const router = express.Router();
const {
  getLatestCareer,
  getCareerHistory,
  analyzeCareerProfile,
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/latest', getLatestCareer);
router.get('/history', getCareerHistory);
router.post('/analyze', analyzeCareerProfile);

module.exports = router;

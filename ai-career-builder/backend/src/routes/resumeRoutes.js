const express = require('express');
const router = express.Router();
const {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateAISummary,
  reviewResumeATS,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getUserResumes)
  .post(createResume);

router.post('/ai/summary', generateAISummary);
router.post('/ai/review', reviewResumeATS);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getUserCoverLetters,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
  generateAICoverLetter,
} = require('../controllers/coverLetterController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getUserCoverLetters)
  .post(createCoverLetter);

router.post('/ai/generate', generateAICoverLetter);

router.route('/:id')
  .get(getCoverLetterById)
  .put(updateCoverLetter)
  .delete(deleteCoverLetter);

module.exports = router;

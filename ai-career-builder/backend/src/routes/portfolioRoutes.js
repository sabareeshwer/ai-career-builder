const express = require('express');
const router = express.Router();
const {
  getUserPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  exportStaticHTML,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// Public export route
router.get('/:id/export-html', exportStaticHTML);

// Protected routes
router.use(protect);

router.route('/')
  .get(getUserPortfolios)
  .post(createPortfolio);

router.route('/:id')
  .get(getPortfolioById)
  .put(updatePortfolio)
  .delete(deletePortfolio);

module.exports = router;

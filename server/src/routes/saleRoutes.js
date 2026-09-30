const express = require('express');
const router = express.Router();
const {
  getSales,
  getSale,
  createSale,
  updateSaleStatus,
  deleteSale,
} = require('../controllers/saleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All sales routes require authentication
router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .get(getSale)
  .delete(authorize('Admin'), deleteSale); // Admin-only delete

router.patch('/:id/status', updateSaleStatus);

module.exports = router;

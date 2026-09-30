const dashboardService = require('../services/dashboardService');
const { sendSuccess } = require('../utils/response');

/**
 * @desc    Get dashboard analytics & KPI stats
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return sendSuccess(res, 200, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};

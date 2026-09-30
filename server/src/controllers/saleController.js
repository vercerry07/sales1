const saleService = require('../services/saleService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all sales orders
 * @route   GET /api/sales
 * @access  Private
 */
const getSales = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const sales = await saleService.getAllSales({ search, status });
    return sendSuccess(res, 200, 'Sales orders retrieved successfully', sales);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single sale order by ID
 * @route   GET /api/sales/:id
 * @access  Private
 */
const getSale = async (req, res, next) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    return sendSuccess(res, 200, 'Sale order details retrieved successfully', sale);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new sale order
 * @route   POST /api/sales
 * @access  Private
 */
const createSale = async (req, res, next) => {
  try {
    const { customerId, items, status } = req.body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Please select a customer and at least one product');
    }

    const sale = await saleService.createSale(
      { customerId, items, status },
      req.user._id
    );

    return sendSuccess(res, 201, 'Sale order created successfully', sale);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update sale order status
 * @route   PATCH /api/sales/:id/status
 * @access  Private
 */
const updateSaleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 400, 'Please provide status value');
    }

    const sale = await saleService.updateStatus(req.params.id, status);
    return sendSuccess(res, 200, 'Sale order status updated successfully', sale);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete sale order
 * @route   DELETE /api/sales/:id
 * @access  Private (Admin only)
 */
const deleteSale = async (req, res, next) => {
  try {
    await saleService.deleteSale(req.params.id);
    return sendSuccess(res, 200, 'Sale order deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSales,
  getSale,
  createSale,
  updateSaleStatus,
  deleteSale,
};

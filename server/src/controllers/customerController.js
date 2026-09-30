const customerService = require('../services/customerService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private
 */
const getCustomers = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const customers = await customerService.getAllCustomers({ search, status });
    return sendSuccess(res, 200, 'Customers retrieved successfully', customers);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single customer
 * @route   GET /api/customers/:id
 * @access  Private
 */
const getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    return sendSuccess(res, 200, 'Customer details retrieved successfully', customer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new customer
 * @route   POST /api/customers
 * @access  Private
 */
const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, status } = req.body;

    if (!name || !email || !phone) {
      return sendError(res, 400, 'Please provide customer name, email, and phone number');
    }

    const customer = await customerService.createCustomer(
      { name, email, phone, status },
      req.user._id
    );

    return sendSuccess(res, 201, 'Customer created successfully', customer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    return sendSuccess(res, 200, 'Customer updated successfully', customer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private (Admin only)
 */
const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    return sendSuccess(res, 200, 'Customer deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

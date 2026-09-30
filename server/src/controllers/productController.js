const productService = require('../services/productService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const products = await productService.getAllProducts({ search, category, status });
    return sendSuccess(res, 200, 'Products retrieved successfully', products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return sendSuccess(res, 200, 'Product details retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, status } = req.body;

    if (!name || !category || price === undefined) {
      return sendError(res, 400, 'Please provide product name, category, and price');
    }

    const product = await productService.createProduct(
      { name, category, price: Number(price), status },
      req.user._id
    );

    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

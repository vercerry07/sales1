const Product = require('../models/Product');

class ProductService {
  /**
   * Get all products with search & filter
   */
  async getAllProducts({ search, category, status }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    return await Product.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
  }

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    const product = await Product.findById(id).populate('createdBy', 'name email');
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Create a new product
   */
  async createProduct(data, userId) {
    return await Product.create({
      ...data,
      createdBy: userId,
    });
  }

  /**
   * Update an existing product
   */
  async updateProduct(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Delete product by ID
   */
  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();

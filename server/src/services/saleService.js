const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class SaleService {
  /**
   * Helper to generate unique Order Number (e.g. ORD-1001)
   */
  async generateOrderNumber() {
    const count = await Sale.countDocuments();
    const orderNum = 1000 + count + 1;
    return `ORD-${orderNum}`;
  }

  /**
   * Get all sales with search & filter
   */
  async getAllSales({ search, status }) {
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    let sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone')
      .populate('salesperson', 'name email role')
      .populate('items.product', 'name category price');

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      sales = sales.filter((sale) => {
        const orderMatch = sale.orderNumber.match(searchRegex);
        const customerMatch = sale.customer?.name.match(searchRegex);
        const emailMatch = sale.customer?.email.match(searchRegex);
        return orderMatch || customerMatch || emailMatch;
      });
    }

    return sales;
  }

  /**
   * Get single sale by ID
   */
  async getSaleById(id) {
    const sale = await Sale.findById(id)
      .populate('customer', 'name email phone')
      .populate('salesperson', 'name email role')
      .populate('items.product', 'name category price');

    if (!sale) {
      const error = new Error('Sale order not found');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  }

  /**
   * Create a new Sale order
   */
  async createSale({ customerId, items, status }, salespersonId) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error('Sale must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    // Verify Customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      const error = new Error('Selected customer not found');
      error.statusCode = 404;
      throw error;
    }

    // Calculate line items and total amount
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        const error = new Error(`Product with ID ${item.productId} not found`);
        error.statusCode = 404;
        throw error;
      }

      const qty = Number(item.quantity) || 1;
      const price = Number(product.price);
      const subtotal = price * qty;
      totalAmount += subtotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: qty,
        subtotal,
      });
    }

    const orderNumber = await this.generateOrderNumber();

    const sale = await Sale.create({
      orderNumber,
      customer: customerId,
      items: processedItems,
      totalAmount,
      salesperson: salespersonId,
      status: ['Pending', 'Completed', 'Cancelled'].includes(status) ? status : 'Pending',
    });

    return await this.getSaleById(sale._id);
  }

  /**
   * Update Sale Order Status
   */
  async updateStatus(id, newStatus) {
    if (!['Pending', 'Completed', 'Cancelled'].includes(newStatus)) {
      const error = new Error('Invalid status value');
      error.statusCode = 400;
      throw error;
    }

    const sale = await Sale.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!sale) {
      const error = new Error('Sale order not found');
      error.statusCode = 404;
      throw error;
    }

    return await this.getSaleById(id);
  }

  /**
   * Delete Sale by ID
   */
  async deleteSale(id) {
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) {
      const error = new Error('Sale order not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Sale order deleted successfully' };
  }
}

module.exports = new SaleService();

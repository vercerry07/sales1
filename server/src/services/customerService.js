const Customer = require('../models/Customer');

class CustomerService {
  /**
   * Get all customers with search & filter
   */
  async getAllCustomers({ search, status }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    return await Customer.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name email');
  }

  /**
   * Get single customer by ID
   */
  async getCustomerById(id) {
    const customer = await Customer.findById(id).populate('createdBy', 'name email');
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  }

  /**
   * Create a new customer
   */
  async createCustomer(data, userId) {
    return await Customer.create({
      ...data,
      createdBy: userId,
    });
  }

  /**
   * Update existing customer
   */
  async updateCustomer(id, data) {
    const customer = await Customer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  }

  /**
   * Delete customer by ID
   */
  async deleteCustomer(id) {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Customer deleted successfully' };
  }
}

module.exports = new CustomerService();

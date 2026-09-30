import { request } from './api';

export const customerService = {
  getCustomers: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.status) query.append('status', filters.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await request(`/customers${queryString}`, { method: 'GET' });
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await request(`/customers/${id}`, { method: 'DELETE' });
    return response;
  },
};

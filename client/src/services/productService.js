import { request } from './api';

export const productService = {
  getProducts: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.category) query.append('category', filters.category);
    if (filters.status) query.append('status', filters.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await request(`/products${queryString}`, { method: 'GET' });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await request(`/products/${id}`, { method: 'DELETE' });
    return response;
  },
};

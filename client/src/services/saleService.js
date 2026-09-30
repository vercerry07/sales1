import { request } from './api';

export const saleService = {
  getSales: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.status) query.append('status', filters.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await request(`/sales${queryString}`, { method: 'GET' });
    return response.data;
  },

  getSale: async (id) => {
    const response = await request(`/sales/${id}`, { method: 'GET' });
    return response.data;
  },

  createSale: async (saleData) => {
    const response = await request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
    return response.data;
  },

  updateSaleStatus: async (id, status) => {
    const response = await request(`/sales/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  deleteSale: async (id) => {
    const response = await request(`/sales/${id}`, { method: 'DELETE' });
    return response;
  },
};

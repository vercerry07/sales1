import { request } from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await request('/dashboard/stats', { method: 'GET' });
    return response.data;
  },
};

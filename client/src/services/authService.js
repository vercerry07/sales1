import { request } from './api';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  /**
   * Get current profile
   */
  getMe: async () => {
    const response = await request('/auth/me', {
      method: 'GET',
    });
    return response.data;
  },
};

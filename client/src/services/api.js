const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Standard API request wrapper
 */
export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sales_app_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during API call');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sales_app_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-login on reload if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sales_app_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.warn('[AuthContext] Token expired or invalid, logging out.');
          localStorage.removeItem('sales_app_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('sales_app_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, role) => {
    setError(null);
    try {
      const data = await authService.register({ name, email, password, role });
      localStorage.setItem('sales_app_token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('sales_app_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

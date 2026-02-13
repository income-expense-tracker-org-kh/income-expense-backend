import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
      localStorage.removeItem('token');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset Password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

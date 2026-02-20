import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
      localStorage.removeItem('token');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user
  getAll: async () => {
    return await api.get('/auth/me');
  },

  // Update Profile
  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },

  // Update Password — ✅ throw the full error so component gets message
  updatePassword: async (data) => {
    try {
      const response = await api.put('/auth/password', data);
      return response;
    } catch (error) {
      // ✅ throw the full error object, NOT error.response?.data
      // This preserves error.response.data.message for the component to read
      throw error;
    }
  },
};
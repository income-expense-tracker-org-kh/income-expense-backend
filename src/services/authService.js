import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response; // response is already response.data due to interceptor
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
};



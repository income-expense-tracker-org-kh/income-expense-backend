import api from './api';
import { API_ENDPOINTS } from '../constants';

export const transactionService = {
  // Get all transactions
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.TRANSACTIONS, { params: filters });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post(API_ENDPOINTS.TRANSACTIONS, transactionData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, transactionData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get income transactions
  getIncome: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.INCOME, { params: filters });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get expense transactions
  getExpense: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSE, { params: filters });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload receipt
  uploadReceipt: async (transactionId, file) => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await api.post(
        `${API_ENDPOINTS.TRANSACTIONS}/${transactionId}/receipt`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

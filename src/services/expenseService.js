import api from './api';

export const expenseService = {
  // Get all expensess
  getAll: async (params) => {
    return await api.get('/expenses', { params });
  },

  // Create expenses
  create: async (data) => {
    return await api.post('/expenses', data);
  },

  // Update expenses
  update: async (id, data) => {
    return await api.put(`/expenses/${id}`, data);
  },

  // Delete expenses
  delete: async (id) => {
    return await api.delete(`/expenses/${id}`);
  },

  getExpenseSummary: async (params) => {
    return await api.get('/expenses/summary', { params });
  },

  getExpenseTrends: async (params) => {
    return await api.get('expenses/trends', { params });
  }
};

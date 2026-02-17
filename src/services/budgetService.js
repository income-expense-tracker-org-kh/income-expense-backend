import api from './api';

export const budgetService = {
  // Get all budget
  getAll: async () => {
    return await api.get('/budgets');
  },

  // Create budget
  create: async (data) => {
    return await api.post('/budgets', data);
  },

  // Update budget
  update: async (id, data) => {
    return await api.put(`/budgets/${id}`, data);
  },

  // Delete budget
  delete: async (id) => {
    return await api.delete(`/budgets/${id}`);
  },
};

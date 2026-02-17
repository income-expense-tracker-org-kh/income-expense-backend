import api from './api';

export const dashboardService = {
  // Get all expensess
  getAll: async () => {
    return await api.get('/dashboard');
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
};

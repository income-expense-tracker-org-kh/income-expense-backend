import api from './api';

export const incomeService = {
  // Get all incomes
  getAll: async () => {
    return await api.get('/income');
  },

  // Create income
  create: async (data) => {
    return await api.post('/income', data);
  },

  // Update income
  update: async (id, data) => {
    return await api.put(`/income/${id}`, data);
  },

  // Delete income
  delete: async (id) => {
    return await api.delete(`/income/${id}`);
  },
};

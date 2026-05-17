import api from './api';

export const dashboardService = {
  // Get all expensess
  getAll: async () => {
    return await api.get('/dashboard');
  },

  // Get all insights
  getInsights: async (params) => {
    return await api.get('/dashboard/insights', { params });
  },

  // Get all summary
  getFinancialSummary: async (params) => {
    return await api.get('/dashboard/summary', { params });
  },
};

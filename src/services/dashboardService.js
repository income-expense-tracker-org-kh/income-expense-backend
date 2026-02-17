import api from './api';

export const dashboardService = {
  // Get all expensess
  getAll: async () => {
    return await api.get('/dashboard');
  },

  // Get all insights
  getInsights: async () => {
    return await api.get('/dashboard/insights');
  },

  // Get all summary
  getFinancialSummary: async () => {
    return await api.get('/dashboard/summary');
  },
};

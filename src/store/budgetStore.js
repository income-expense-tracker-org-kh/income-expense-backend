import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],

      // Add budget
      addBudget: (budget) => {
        const newBudget = {
          ...budget,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      // Update budget
      updateBudget: (id, updatedData) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updatedData, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      // Delete budget
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      // Get budget by category
      getBudgetByCategory: (category) => {
        const { budgets } = get();
        return budgets.find((b) => b.category === category);
      },

      // Get active budgets
      getActiveBudgets: () => {
        const { budgets } = get();
        const now = new Date();
        return budgets.filter((b) => {
          const endDate = new Date(b.endDate);
          return endDate >= now;
        });
      },

      // Set budgets
      setBudgets: (budgets) => {
        set({ budgets });
      },
    }),
    {
      name: 'budget-storage',
    }
  )
);

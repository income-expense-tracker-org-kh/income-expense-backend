import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light', // light or dark
      currency: 'USD',
      language: 'en',
      notifications: {
        budgetAlerts: true,
        monthlyReport: true,
        billReminders: true,
        unusualSpending: false,
      },
      dateFormat: 'MM/DD/YYYY',
      
      // Update theme
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Update currency
      setCurrency: (currency) => set({ currency }),

      // Update language
      setLanguage: (language) => set({ language }),

      // Update notifications
      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),

      // Update date format
      setDateFormat: (dateFormat) => set({ dateFormat }),

      // Reset settings
      resetSettings: () =>
        set({
          theme: 'light',
          currency: 'USD',
          language: 'en',
          notifications: {
            budgetAlerts: true,
            monthlyReport: true,
            billReminders: true,
            unusualSpending: false,
          },
          dateFormat: 'MM/DD/YYYY',
        }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

import { useState, useEffect } from 'react';

// ─── Initial State from localStorage ─────────────────────────────────────────
const getInitialState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('settings-storage') || '{}');
    return {
      theme:    saved.theme    || 'light',
      currency: saved.currency || 'USD',
      language: saved.language || 'en',
      notifications: {
        budgetAlerts:   saved.notifications?.budgetAlerts   ?? true,
        monthlyReports: saved.notifications?.monthlyReports ?? true,
        billReminders:  saved.notifications?.billReminders  ?? true,
        unusualSpending:saved.notifications?.unusualSpending ?? false,
      },
      dateFormat: saved.dateFormat || 'MM/DD/YYYY',
    };
  } catch {
    return {
      theme: 'light',
      currency: 'USD',
      language: 'en',
      notifications: {
        budgetAlerts:    true,
        monthlyReports:  true,
        billReminders:   true,
        unusualSpending: false,
      },
      dateFormat: 'MM/DD/YYYY',
    };
  }
};

// ─── Plain JS Store ───────────────────────────────────────────────────────────
let state = getInitialState();
const listeners = new Set();

const setState = (partial) => {
  state = { ...state, ...partial };
  localStorage.setItem('settings-storage', JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
};

// ─── settingsStore (actions — use directly, no hook needed) ───────────────────
export const settingsStore = {
  getState: () => state,

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  setTheme: (theme) => {
    setState({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setCurrency: (currency) => setState({ currency }),

  setLanguage: (language) => setState({ language }),

  updateNotifications: (notifications) =>
    setState({
      notifications: { ...state.notifications, ...notifications },
    }),

  setDateFormat: (dateFormat) => setState({ dateFormat }),

  resetSettings: () =>
    setState({
      theme: 'light',
      currency: 'USD',
      language: 'en',
      notifications: {
        budgetAlerts:    true,
        monthlyReports:  true,
        billReminders:   true,
        unusualSpending: false,
      },
      dateFormat: 'MM/DD/YYYY',
    }),
};

// ─── useSettingsStore hook (for components that need to re-render on state change)
export const useSettingsStore = (selector = (s) => s) => {
  const [value, setValue] = useState(() => selector(settingsStore.getState()));

  useEffect(() => {
    const unsubscribe = settingsStore.subscribe((newState) => {
      setValue(selector(newState));
    });
    return unsubscribe;
  }, [selector]);

  return value;
};
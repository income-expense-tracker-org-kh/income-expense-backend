import { useState, useEffect } from 'react';

// ─── Initial State from localStorage ─────────────────────────────────────────
const getInitialState = () => ({
  budgets: JSON.parse(localStorage.getItem('budget-storage') || '[]'),
});

// ─── Plain JS Store ───────────────────────────────────────────────────────────
let state = getInitialState();
const listeners = new Set();

const setState = (partial) => {
  state = { ...state, ...partial };
  localStorage.setItem('budget-storage', JSON.stringify(state.budgets));
  listeners.forEach((fn) => fn(state));
};

// ─── budgetStore (actions — use directly, no hook needed) ─────────────────────
export const budgetStore = {
  getState: () => state,

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  addBudget: (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setState({ budgets: [...state.budgets, newBudget] });
  },

  updateBudget: (id, updatedData) => {
    setState({
      budgets: state.budgets.map((b) =>
        b.id === id ? { ...b, ...updatedData, updatedAt: new Date().toISOString() } : b
      ),
    });
  },

  deleteBudget: (id) => {
    setState({ budgets: state.budgets.filter((b) => b.id !== id) });
  },

  getBudgetByCategory: (category) => {
    return state.budgets.find((b) => b.category === category);
  },

  getActiveBudgets: () => {
    const now = new Date();
    return state.budgets.filter((b) => new Date(b.endDate) >= now);
  },

  setBudgets: (budgets) => {
    setState({ budgets });
  },
};

// ─── useBudgetStore hook (for components that need to re-render on state change)
export const useBudgetStore = (selector = (s) => s) => {
  const [value, setValue] = useState(() => selector(budgetStore.getState()));

  useEffect(() => {
    const unsubscribe = budgetStore.subscribe((newState) => {
      setValue(selector(newState));
    });
    return unsubscribe;
  }, [selector]);

  return value;
};
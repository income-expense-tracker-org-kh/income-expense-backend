import { useState, useEffect } from 'react';

// ─── Initial State from localStorage ─────────────────────────────────────────
const getInitialState = () => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('role') || 'user',
});

// ─── Plain JS Store ───────────────────────────────────────────────────────────
let state = getInitialState();
const listeners = new Set();

const setState = (partial) => {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn(state));
};

// ─── authStore (actions — use directly, no hook needed) ───────────────────────
export const authStore = {
  getState: () => state,

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn); // returns unsubscribe fn
  },

  login: (userData, token, role = 'user') => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', role);
    setState({ user: userData, token, isAuthenticated: true, role });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setState({ user: null, token: null, isAuthenticated: false, role: 'user' });
  },

  updateUser: (userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    setState({ user: updated });
  },

  setRole: (role) => {
    localStorage.setItem('role', role);
    setState({ role });
  },

  hasPermission: (permission) => {
    const { role } = state;
    if (role === 'admin') return true;
    const rolePermissions = {
      admin: ['all'],
      manager: ['read', 'write', 'update'],
      user: ['read', 'write'],
      viewer: ['read'],
    };
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission) || permissions.includes('all');
  },
};

// ─── useAuthStore hook (for components that need to re-render on state change) ─
export const useAuthStore = (selector = (s) => s) => {
  const [value, setValue] = useState(() => selector(authStore.getState()));

  useEffect(() => {
    const unsubscribe = authStore.subscribe((newState) => {
      setValue(selector(newState));
    });
    return unsubscribe;
  }, [selector]);

  return value;
};
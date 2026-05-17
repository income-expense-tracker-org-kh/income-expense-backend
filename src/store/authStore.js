import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsStore } from './settingsStore';

// ─── Timer for auto-logout ───────────────────────────────────────────────────
let logoutTimer = null;

const startLogoutTimer = (expiresAt) => {
  if (logoutTimer) clearTimeout(logoutTimer);
  const delay = expiresAt - Date.now();
  if (delay > 0) {
    logoutTimer = setTimeout(() => {
      if (localStorage.getItem('token')) {
        authStore.logout();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }, delay);
  } else {
    // Already expired
    if (localStorage.getItem('token')) {
      authStore.logout();
    }
  }
};

// ─── Initial State from localStorage ─────────────────────────────────────────
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

  if (token && tokenExpiresAt && Date.now() > parseInt(tokenExpiresAt, 10)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiresAt');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      role: 'user',
    };
  }

  return {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: token || null,
    isAuthenticated: !!token,
    role: localStorage.getItem('role') || 'user',
  };
};

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
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour expiration
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', role);
    localStorage.setItem('tokenExpiresAt', expiresAt.toString());
    setState({ user: userData, token, isAuthenticated: true, role });

    if (userData.theme) settingsStore.setTheme(userData.theme);
    if (userData.currency) settingsStore.setCurrency(userData.currency);
    if (userData.language) settingsStore.setLanguage(userData.language);
    if (userData.sessionTimeout) settingsStore.setSessionTimeout(userData.sessionTimeout);

    startLogoutTimer(expiresAt);
  },

  logout: () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiresAt');
    setState({ user: null, token: null, isAuthenticated: false, role: 'user' });
  },

  updateUser: (userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    setState({ user: updated });

    if (userData.theme) settingsStore.setTheme(userData.theme);
    if (userData.currency) settingsStore.setCurrency(userData.currency);
    if (userData.language) settingsStore.setLanguage(userData.language);
    if (userData.sessionTimeout) settingsStore.setSessionTimeout(userData.sessionTimeout);
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

// Start timer on initial load if we have a valid non-expired token
const initialExpiresAt = localStorage.getItem('tokenExpiresAt');
if (initialExpiresAt) {
  const expiresAt = parseInt(initialExpiresAt, 10);
  if (expiresAt > Date.now()) {
    startLogoutTimer(expiresAt);
  }
}
export const useAuthStore = (selector = (s) => s) => {
  const getMergedState = () => ({
    ...authStore.getState(),
    login: authStore.login,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
    setRole: authStore.setRole,
    hasPermission: authStore.hasPermission,
  });

  const [value, setValue] = useState(() => selector(getMergedState()));

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setValue(selector(getMergedState()));
    });
    return unsubscribe;
  }, [selector]);

  return value;
};
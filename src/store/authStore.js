import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: 'user',

      login: (userData, token, role = 'user') => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          role,
        });
        localStorage.setItem('token', token); // optional, for axios interceptor
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: 'user',
        });
        localStorage.removeItem('token');
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      setRole: (role) => set({ role }),

      hasPermission: (permission) => {
        const state = useAuthStore.getState();
        const role = state.role;
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
    }),
    { name: 'auth-storage' }
  )
);

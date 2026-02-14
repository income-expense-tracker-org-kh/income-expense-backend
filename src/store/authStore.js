import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      role: 'user', // Default role

      login: (userData, token, role = 'user') => {
        set({
          user: userData,
          isAuthenticated: true,
          token: token,
          role: role,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          role: 'user',
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      setRole: (role) => {
        set({ role });
      },

      hasPermission: (permission) => {
        const state = useAuthStore.getState();
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
    }),
    {
      name: 'auth-storage',
    }
  )
);

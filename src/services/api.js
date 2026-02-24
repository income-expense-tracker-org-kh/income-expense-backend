import axios from 'axios';
import { API_BASE_URL } from '../constants';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 + 429
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url || '';

    if (status === 401) {
      // ✅ /auth/password returns 401 for wrong password — do NOT redirect
      // All other 401s mean session expired — redirect to login
      const isPasswordChange = url.includes('/auth/password');

      if (!isPasswordChange) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // isPasswordChange → fall through to Promise.reject
      // so the catch block in handleChangePassword receives the error
    }

    if (status === 429) {
      const retryAfter = error.response?.data?.retryAfter;
      const minutes    = retryAfter ? Math.ceil(retryAfter / 60) : 15;
      toast.error(
        `Too many requests. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} and try again.`,
        { id: 'rate-limit', duration: 6000 }
      );
    }

    return Promise.reject(error);
  }
);

export default api;
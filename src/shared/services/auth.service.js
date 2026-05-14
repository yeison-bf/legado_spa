import { jwtDecode } from 'jwt-decode';
import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    const { token } = response.data;
    
    if (token) {
      authService.setToken(token);
      await api.get('/users/profile');
    }
    
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getInstitutions: async () => {
    const response = await api.get('/institutions');
    return response.data;
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getUser: () => {
    const token = authService.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        authService.logout();
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
};

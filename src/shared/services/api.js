import axios from 'axios';

const LEGADO_API_URL = import.meta.env.VITE_API_LEGADO_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: LEGADO_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Manejar logout automatico si el token expira o es invalido
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

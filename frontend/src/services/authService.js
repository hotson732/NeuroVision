// services/authService.js
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = () => {
  return !!getToken();
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/'; 
  Navigate('/login');
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Registro
  
  register: async (userData) => {
    try {
      const response = await api.post('/v1/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/v1/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar disponibilidad
  checkAvailability: async (type, value) => {
    try {
      const response = await api.get('/v1/check', {
        params: { type, value }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Funciones de autenticación
  setAuthData,
  getToken,
  getUser,
  isAuthenticated,
  logout
};

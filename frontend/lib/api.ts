import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    // Si el token no tiene el prefijo Bearer, lo añadimos
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar el "Token Expirado" (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ignorar 401 en el login, eso es credenciales inválidas, no sesión expirada
      if (error.config.url !== '/login' && !error.config.url?.endsWith('/login')) {
         console.error('Sesión expirada detectada por el escudo de Laniakea.');
         useAuthStore.getState().logout();
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = async (credentials: any) => {
    try {
      const response = await api.post('/login', { user: credentials });
      // Rails devuelve el token en el header Authorization
      const token = response.headers.authorization;
      const userData = response.data.data;

      login(userData, token);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.status?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      const response = await api.post('/signup', { user: userData });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.status?.message || 'Error al registrarse' 
      };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    handleLogin,
    handleSignup,
    logout,
  };
};

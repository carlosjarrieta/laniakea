"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { useLanguage } from '@/components/providers/language-provider';
import { useTranslations } from '@/hooks/use-translations';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const handleLogin = async (credentials: any, showToast = true) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { user: credentials });
      const token = response.headers.authorization;
      const userData = response.data.data;

      login(userData, token);
      if (showToast) toast.success(t('login.success_message') || 'Logged in successfully');
      
      if (!userData.has_account) {
        router.push("/onboarding/account");
      } else if (!userData.has_active_plan) {
        router.push("/plans");
      } else {
        router.push("/dashboard");
      }
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.status?.message || 'Error al iniciar sesión';
      if (showToast) toast.error(message);
      return { 
        success: false, 
        message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (userData: any) => {
    setIsLoading(true);
    try {
      const { invitation_token, ...userParams } = userData;
      const response = await api.post('/signup', { 
        user: userParams,
        invitation_token: invitation_token 
      });
      
      const message = response.data.status.message;
      toast.success(message);
      
      // If we signed up with an invitation, we should probably follow the login flow 
      // but Rails registrations usually don't return the token unless configured.
      // For now, redirect to login as before, but with the email pre-filled if possible.
      router.push(`/login?email=${encodeURIComponent(userParams.email)}`);
      
      return { 
        success: true, 
        data: response.data.data,
        message 
      };
    } catch (error: any) {
      const message = error.response?.data?.status?.message || 'Error al registrarse';
      toast.error(message);
      return { 
        success: false, 
        message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/profile');
      // The backend returns user data directly in current_user.as_json format
      updateUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleSignup,
    handleLogout,
    refreshUser,
    updateUser: (userData: any) => updateUser(userData),
  };
};

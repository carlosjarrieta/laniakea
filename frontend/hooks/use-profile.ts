"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";

export function useProfile() {
  const { user, updateUser } = useAuth();
  const { locale: currentLocale, setLocale: setGlobalLocale } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  async function updateProfile(data: any) {
    setIsLoading(true);
    try {
      const response = await api.put("/users/profile", { user: data });
      toast.success(response.data.message);
      
      if (updateUser) {
        updateUser(response.data.user);
      }
      
      if (data.locale && data.locale !== currentLocale) {
        setGlobalLocale(data.locale);
      }
      return { success: true, user: response.data.user };
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    user,
    isLoading,
    updateProfile,
  };
}

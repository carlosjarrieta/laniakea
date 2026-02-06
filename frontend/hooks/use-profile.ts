"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";

export function useProfile() {
  const { user, updateUser } = useAuth();
  const { locale: currentLocale, setLocale: setGlobalLocale } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.get("/users/profile");
      console.log("Fetched profile from server:", response.data);
      if (updateUser) {
        updateUser(response.data);
      }
      return response.data;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [updateUser]);

  async function updateProfile(data: any) {
    setIsLoading(true);
    try {
      console.log("Sending profile data:", data);
      const response = await api.put("/users/profile", { user: data });
      console.log("Server response:", response.data);
      toast.success(response.data.message);
      
      if (updateUser) {
        console.log("Updating user in store:", response.data.user);
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
    isFetching,
    fetchProfile,
    updateProfile,
  };
}

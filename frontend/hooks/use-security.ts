"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  async function updatePassword(data: any) {
    setIsLoading(true);
    try {
      const response = await api.put("/users/profile", { user: data });
      toast.success(response.data.message);
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    updatePassword,
  };
}

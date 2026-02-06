"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function sendResetLink(email: string) {
    setIsLoading(true);
    try {
      const response = await api.post("/password", { user: { email } });
      toast.success(response.data.message);
      setIsSent(true);
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
    isSent,
    setIsSent,
    sendResetLink,
  };
}

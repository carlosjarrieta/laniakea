"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function resetPassword(data: any) {
    setIsLoading(true);
    try {
      const response = await api.put("/password", { user: data });
      toast.success(response.data.message);
      router.push("/login");
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
    resetPassword,
  };
}

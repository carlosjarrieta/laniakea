"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useBilling() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [account, setAccount] = useState<any>(null);

  const fetchBillingInfo = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.get("/account");
      setAccount(response.data);
      return response.data;
    } catch (error: any) {
      toast.error("Error loading billing information");
      return null;
    } finally {
      setIsFetching(false);
    }
  }, []);

  async function updateBilling(data: any) {
    setIsLoading(true);
    try {
      const response = await api.put("/account", { account: data });
      toast.success(response.data.message);
      setAccount(response.data.account);
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
    account,
    isLoading,
    isFetching,
    fetchBillingInfo,
    updateBilling,
  };
}

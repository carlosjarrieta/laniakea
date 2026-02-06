"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export function useBilling() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [billingInfo, setBillingInfo] = useState<any>(null);

  const fetchBillingInfo = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.get("/users/billing_info");
      setBillingInfo(response.data);
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
      const response = await api.put("/users/billing_info", { billing_info: data });
      toast.success(response.data.message);
      setBillingInfo(response.data.billing_info);
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
    billingInfo,
    isLoading,
    isFetching,
    fetchBillingInfo,
    updateBilling,
  };
}

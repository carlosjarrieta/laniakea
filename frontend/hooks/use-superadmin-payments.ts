"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const useSuperadminPayments = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ payments: any[]; stats: { total_earnings: number } }>({ payments: [], stats: { total_earnings: 0 } });
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    if (user?.role !== 'superadmin') return;
    
    setIsLoading(true);
    try {
      const res = await api.get('/superadmin/payments');
      // Ensure data structure matches API response
      setData(res.data || { payments: [], stats: { total_earnings: 0 } });
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Error fetching payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments: data.payments,
    totalEarnings: data.stats?.total_earnings || 0,
    isLoading,
    refresh: fetchPayments,
  };
};

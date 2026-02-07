"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";

export const useSuperadminAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const fetchAccounts = async () => {
    if (user?.role !== 'superadmin') return;
    
    setIsLoading(true);
    try {
      const res = await api.get('/superadmin/accounts');
      setAccounts(res.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Error fetching accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (id: number, data: any) => {
    try {
      await api.patch(`/superadmin/accounts/${id}`, { account: data });
      toast.success(t('settings.profile.save_changes'));
      fetchAccounts();
    } catch (error) {
      toast.error("Error updating account");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  return {
    accounts,
    isLoading,
    refresh: fetchAccounts,
    updateAccount
  };
};

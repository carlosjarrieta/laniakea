"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";

export const useSuperadminPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const fetchPlans = async () => {
    if (user?.role !== 'superadmin') return;
    
    setIsLoading(true);
    try {
      const res = await api.get('/superadmin/plans');
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Error fetching plans");
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (data: any) => {
    try {
      await api.post('/superadmin/plans', { plan: data });
      toast.success(t('settings.profile.save_changes'));
      fetchPlans();
    } catch (error) {
      toast.error("Error creating plan");
    }
  };

  const updatePlan = async (id: number, data: any) => {
    try {
      await api.patch(`/superadmin/plans/${id}`, { plan: data });
      toast.success(t('settings.profile.save_changes'));
      fetchPlans();
    } catch (error) {
      toast.error("Error updating plan");
    }
  };

  const toggleStatus = async (plan: any) => {
    return updatePlan(plan.id, { active: !plan.active });
  };

  const deletePlan = async (id: number) => {
    try {
      await api.delete(`/superadmin/plans/${id}`);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (error) {
      toast.error("Error deleting plan");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  return {
    plans,
    isLoading,
    refresh: fetchPlans,
    createPlan,
    updatePlan,
    toggleStatus,
    deletePlan
  };
};

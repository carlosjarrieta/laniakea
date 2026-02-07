"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, CreditCard, Lock, ShieldCheck, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useBilling } from "@/hooks/use-billing";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { toast } from "sonner";

const billingFormSchema = z.object({
  tax_id: z.string().min(1, "Tax ID is required"),
  name: z.string().min(1, "Account name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country_code: z.string().min(1, "Country is required"),
  billing_email: z.string().email("Invalid email").optional(),
  phone_number: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

export default function BillingSettingsPage() {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { isLoading, isFetching, fetchBillingInfo, updateBilling } = useBilling();
  const { refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      tax_id: "",
      name: "",
      address: "",
      city: "",
      postal_code: "",
      country_code: "",
      billing_email: "",
      phone_number: "",
    },
  });

  // Handle successful payment refresh
  useEffect(() => {
    if (success === 'true') {
      toast.success("¡Pago completado con éxito! Actualizando tu cuenta...");
      refreshUser();
      // Remove the query param to avoid multiple toasts
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [success, refreshUser]);

  useEffect(() => {
    fetchBillingInfo().then((data) => {
      if (data) {
        billingForm.reset({
          tax_id: data.tax_id || "",
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          postal_code: data.postal_code || "",
          country_code: data.country_code || "",
          billing_email: data.billing_email || "",
          phone_number: data.phone_number || "",
        });
      }
    });
  }, [fetchBillingInfo, billingForm]);

  async function onBillingSubmit(data: BillingFormValues) {
    await updateBilling(data);
  }

  async function handleOpenPortal() {
    try {
      const response = await api.post('/subscriptions/portal');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast.error("No se pudo abrir el portal de Stripe.");
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {t('settings.menu.billing')}
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          {t('settings.billing.billing_info_desc')}
        </p>
      </div>

      {/* Payment & Subscription Management - PRO VERSION */}
      <Card className="border shadow-sm bg-card rounded-xl overflow-hidden bg-gradient-to-br from-zinc-50/50 to-white dark:from-zinc-900/30 dark:to-zinc-950">
        <CardHeader className="p-5 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold">Gestión de Pagos</CardTitle>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-500/50" />
          </div>
          <CardDescription className="text-[11px]">
            Administra tu suscripción y métodos de pago de forma segura.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                 <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Seguridad de Stripe</p>
                <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                  Toda tu información bancaria está protegida directamente por la infraestructura global de Stripe.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleOpenPortal}
              className="w-full md:w-auto px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 text-xs rounded-lg transition-all active:scale-95 shadow-sm"
            >
              Configurar Métodos de Pago
            </Button>
          </div>
          
          <div className="flex items-center gap-2 px-1">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">
               Cumplimiento PCI Nivel 1 Certificado
             </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information Section */}
      <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
        <CardHeader className="p-5 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Mail size={16} className="text-primary" />
              {t('settings.billing.billing_info')}
            </CardTitle>
            <Badge variant="secondary" className="text-[9px] font-bold h-4 px-2 tracking-wider">
              {t('settings.billing.managed_by_laniakea')}
            </Badge>
          </div>
          <CardDescription className="text-[11px]">
            {t('settings.billing.billing_info_desc')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-5">
          <Form {...billingForm}>
            <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={billingForm.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.tax_id')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="RUT / RFC / Tax ID" 
                          {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.company_name')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Company Name S.A." 
                          {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={billingForm.control}
                  name="billing_email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('login.email_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="billing@example.com" 
                          {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.profile.phone_number') || 'Teléfono'}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 234 567 890" 
                          {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={billingForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.address')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Street Name" 
                        {...field} 
                        className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={billingForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.city')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-xs bg-muted/20 border-border rounded-lg" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.zip_code')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-xs bg-muted/20 border-border rounded-lg" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.billing.country')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-9 text-xs bg-muted/20 border-border rounded-lg" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-6 text-xs font-bold rounded-lg shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                  {t('settings.profile.save_changes')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

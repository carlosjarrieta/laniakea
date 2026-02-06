"use client";

import { useEffect } from "react";
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
import { Loader2, CreditCard } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useBilling } from "@/hooks/use-billing";

const billingFormSchema = z.object({
  tax_id: z.string().min(1, "Tax ID is required"),
  company_name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip_code: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

export default function BillingSettingsPage() {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { isLoading, isFetching, fetchBillingInfo, updateBilling } = useBilling();

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      tax_id: "",
      company_name: "",
      address: "",
      city: "",
      zip_code: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchBillingInfo().then((data) => {
      if (data) {
        form.reset({
          tax_id: data.tax_id || "",
          company_name: data.company_name || "",
          address: data.address || "",
          city: data.city || "",
          zip_code: data.zip_code || "",
          country: data.country || ""
        });
      }
    });
  }, [fetchBillingInfo, form]);

  async function onSubmit(data: BillingFormValues) {
    await updateBilling(data);
  }

  if (isFetching) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-violet-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t('settings.billing.billing_info')}</h3>
          <p className="text-sm text-muted-foreground">
            Manage your billing information and tax data.
          </p>
        </div>
        <div className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <CreditCard size={14} />
          {t('settings.billing.managed_by_laniakea')}
        </div>
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.billing.tax_id')}</FormLabel>
                  <FormControl>
                    <Input placeholder="RUT / RFC / Tax ID" {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.billing.company_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name S.A." {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.billing.address')}</FormLabel>
                <FormControl>
                  <Input placeholder="123 Street Name" {...field} className="rounded-xl h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.billing.city')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.billing.zip_code')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.billing.country')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="bg-violet-600 hover:bg-violet-700 h-11 px-8 rounded-xl shadow-[0_8px_16px_-4px_rgba(124,58,237,0.4)]"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('settings.profile.save_changes')}
          </Button>
        </form>
      </Form>
    </div>
  );
}

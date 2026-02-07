"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "../../../../components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useBilling } from "@/hooks/use-billing";

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

const paymentFormSchema = z.object({
  name_on_card: z.string().min(2, "Name is required"),
  card_number: z.string().min(16, "Enter a valid card number"),
  expiry_month: z.string().min(1, "Required"),
  expiry_year: z.string().min(1, "Required"),
  cvv: z.string().min(3, "CVV is required"),
  same_as_billing: z.boolean(),
  comments: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function BillingSettingsPage() {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { isLoading, isFetching, fetchBillingInfo, updateBilling } = useBilling();

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

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name_on_card: "",
      card_number: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      same_as_billing: true,
      comments: "",
    },
  });

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

  async function onPaymentSubmit(data: PaymentFormValues) {
    // TODO: Integrate with Stripe
    console.log("Payment data:", data);
  }

  if (isFetching) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Payment Method Card - Estilo shadcn/ui sutil */}
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">{t('settings.billing.payment_method')}</CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t('settings.billing.payment_secure')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
              {/* Name on Card */}
              <FormField
                control={paymentForm.control}
                name="name_on_card"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.name_on_card')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Card Number + CVV */}
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={paymentForm.control}
                  name="card_number"
                  render={({ field }) => (
                    <FormItem className="col-span-2 space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.card_number')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground/70">
                        {t('settings.billing.card_hint')}
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">CVV</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          type="password"
                          maxLength={4}
                          {...field} 
                          className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Month / Year */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={paymentForm.control}
                  name="expiry_month"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.month')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm border-border/60">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="expiry_year"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.year')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm border-border/60">
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                              {new Date().getFullYear() + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              {/* Billing Address Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('settings.billing.billing_address')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.billing.billing_address_desc')}
                    </p>
                  </div>
                </div>
                
                <FormField
                  control={paymentForm.control}
                  name="same_as_billing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        {t('settings.billing.same_as_shipping')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Comments */}
              <FormField
                control={paymentForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.comments')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('settings.billing.comments_placeholder')}
                        {...field} 
                        className="min-h-[80px] text-sm border-border/60 resize-none focus-visible:ring-primary/20" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-xs font-medium"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                  {t('settings.billing.submit')}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-4 text-xs font-medium text-muted-foreground"
                >
                  {t('settings.billing.cancel')}
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>{t('settings.billing.secure_encryption')}</span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Billing Information Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium">{t('settings.billing.billing_info')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('settings.billing.billing_info_desc')}
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard size={12} />
            {t('settings.billing.managed_by_laniakea')}
          </div>
        </div>
        
        <Form {...billingForm}>
          <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={billingForm.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.tax_id')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="RUT / RFC / Tax ID" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.company_name')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Company Name S.A." 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('login.email_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="billing@example.com" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.profile.phone_number') || 'Teléfono'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 234 567 890" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
                  <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.address')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Street Name" 
                      {...field} 
                      className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.city')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" />
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.zip_code')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" />
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
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.billing.country')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-xs font-medium mt-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              {t('settings.profile.save_changes')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

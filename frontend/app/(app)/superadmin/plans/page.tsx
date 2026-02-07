"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { useSuperadminPlans } from "@/hooks/use-superadmin-plans";
import { Plus, Package, Edit2, Trash2, Loader2, Info, LayoutTemplate, ShieldCheck } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const planSchema = z.object({
  name: z.string().min(2),
  price_cents: z.number().min(0),
  price_cents_yearly: z.number().min(0).optional().nullable(),
  currency: z.string().length(3),
  // interval: z.enum(["month", "year"]), // Deprecated, plans now support both
  active: z.boolean(),
  stripe_price_id: z.string().nullable().optional(),
  stripe_yearly_price_id: z.string().nullable().optional(),
  max_users: z.number().min(1),
  max_social_profiles: z.number().min(1),
  features: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

type PlanFormValues = z.infer<typeof planSchema>;


export default function PlansPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { plans, isLoading, createPlan, updatePlan, toggleStatus, deletePlan } = useSuperadminPlans();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price_cents: 0,
      price_cents_yearly: 0,
      currency: "USD",
      // interval: "month",
      active: true,
      max_users: 1,
      max_social_profiles: 5,
      features: {},
      stripe_price_id: "",
      stripe_yearly_price_id: "",
    },
  });

  const onSubmit = async (data: PlanFormValues) => {
    // Filter out features with empty values (but keep 0 and false)
    const cleanFeatures = Object.fromEntries(
      Object.entries(data.features || {}).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const cleanData = { ...data, features: cleanFeatures };

    if (editingPlan) {
      await updatePlan(editingPlan.id, cleanData);
    } else {
      await createPlan(cleanData);
    }
    setIsOpen(false);
    setEditingPlan(null);
    form.reset();
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      price_cents: plan.price_cents,
      price_cents_yearly: plan.price_cents_yearly || 0,
      currency: plan.currency || "USD",
      // interval: plan.interval === 'monthly' ? 'month' : plan.interval === 'yearly' ? 'year' : plan.interval,
      active: plan.active,
      max_users: plan.max_users || 1,
      max_social_profiles: plan.max_social_profiles || 5,
      features: plan.features || {},
      stripe_price_id: plan.stripe_price_id || "",
      stripe_yearly_price_id: plan.stripe_yearly_price_id || "",
    });
    setIsOpen(true);
  };


  if (user?.role !== 'superadmin') return null;

  return (
    <TooltipProvider>
      <div className="space-y-6 text-foreground animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <BackButton fallbackUrl="/dashboard" />
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                <LayoutTemplate size={18} />
              </div>
              {t('superadmin.plans.title')}
            </h2>
            <p className="text-xs text-muted-foreground font-medium pl-9">{t('superadmin.plans.subtitle')}</p>
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/40">
             <Button 
               variant={billingInterval === 'monthly' ? 'default' : 'ghost'} 
               size="sm" 
               onClick={() => setBillingInterval('monthly')}
               className="h-7 text-[10px] font-bold px-3 rounded-md"
             >
               Monthly
             </Button>
             <Button 
               variant={billingInterval === 'yearly' ? 'default' : 'ghost'} 
               size="sm" 
               onClick={() => setBillingInterval('yearly')}
               className="h-7 text-[10px] font-bold px-3 rounded-md"
             >
               Yearly
             </Button>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) { setEditingPlan(null); form.reset(); } }}>
            <DialogTrigger asChild>
              <Button className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                <Plus size={14} className="mr-2" />
                {t('superadmin.plans.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[95vh] overflow-y-auto bg-card border-border/40 shadow-3xl p-0 overflow-hidden">
              <div className="bg-muted/30 px-6 py-8 border-b border-border/40 relative">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {editingPlan ? t('superadmin.actions.edit') : t('superadmin.plans.new')}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground font-medium">
                    {editingPlan ? 'Configure the plan overrides and limits.' : 'Create a new plan for the ecosystem.'}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-5 pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Pro Plan" className="h-8 text-xs rounded-md shadow-none" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.currency')}</FormLabel>
                          <FormControl>
                            <Input placeholder="USD" className="h-8 text-xs rounded-md shadow-none" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="price_cents"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.price')} (Monthly)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                              <Input 
                                type="number" 
                                step="0.01" 
                                className="h-8 text-xs rounded-md shadow-none pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                value={field.value ? field.value / 100 : ""} 
                                onChange={(e) => {
                                  // Convert dollars to cents for storage
                                  const dollars = parseFloat(e.target.value);
                                  const cents = isNaN(dollars) ? 0 : Math.round(dollars * 100);
                                  field.onChange(cents);
                                }} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price_cents_yearly"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.price')} (Yearly)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                              <Input 
                                type="number" 
                                step="0.01" 
                                className="h-8 text-xs rounded-md shadow-none pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                value={field.value ? field.value / 100 : ""} 
                                onChange={(e) => {
                                  // Convert dollars to cents for storage
                                  const dollars = parseFloat(e.target.value);
                                  const cents = isNaN(dollars) ? 0 : Math.round(dollars * 100);
                                  field.onChange(cents);
                                }} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="max_users"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.max_users')}</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-8 text-xs rounded-md shadow-none" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_social_profiles"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.max_social_profiles')}</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-8 text-xs rounded-md shadow-none" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.features')}</h4>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        className="h-6 px-2 text-[10px] font-bold"
                        onClick={() => {
                          const features = form.getValues('features');
                          form.setValue('features', { ...features, ["new_feature_" + Object.keys(features).length]: "" });
                        }}
                      >
                        <Plus size={10} className="mr-1" />
                        {t('superadmin.actions.add')}
                      </Button>
                    </div>
                    
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto px-0.5 custom-scrollbar">
                      {Object.entries(form.watch('features') || {}).map(([key, value], idx) => (
                        <div key={idx} className="flex items-center gap-1.5 group/feat">
                          <Input 
                            placeholder="Key" 
                            className="h-7 text-[10px] font-mono flex-1 rounded-sm shadow-none bg-muted text-muted-foreground border-transparent pointer-events-none"
                            value={key}
                            readOnly
                          />
                          {(() => {
                            // Smart input detection based on key
                            const booleanKeys = ['ai_generation', 'active'];
                            const numberKeys = ['storage_gb', 'post_multiplier'];
                            const enumKeys: Record<string, string[]> = {
                              'analytics': ['basic', 'advanced', 'real-time'],
                              'support': ['email', 'priority', 'dedicated'],
                            };

                            if (booleanKeys.includes(key) || typeof value === 'boolean') {
                              return (
                                <Select 
                                  value={String(value)} 
                                  onValueChange={(val) => {
                                    const features = { ...form.getValues('features') };
                                    features[key] = val === 'true';
                                    form.setValue('features', features);
                                  }}
                                >
                                  <SelectTrigger className="h-7 text-[10px] font-mono flex-1 rounded-sm shadow-none">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true" className="text-xs">True</SelectItem>
                                    <SelectItem value="false" className="text-xs">False</SelectItem>
                                  </SelectContent>
                                </Select>
                              );
                            }

                            if (enumKeys[key]) {
                              return (
                                <Select 
                                  value={String(value)} 
                                  onValueChange={(val) => {
                                    const features = { ...form.getValues('features') };
                                    features[key] = val;
                                    form.setValue('features', features);
                                  }}
                                >
                                  <SelectTrigger className="h-7 text-[10px] font-mono flex-1 rounded-sm shadow-none">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {enumKeys[key].map(opt => (
                                      <SelectItem key={opt} value={opt} className="text-xs uppercase">{opt}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }

                            if (numberKeys.includes(key) || typeof value === 'number') {
                              return (
                                <Input 
                                  type="number"
                                  placeholder="Value" 
                                  className="h-7 text-[10px] font-mono flex-1 rounded-sm shadow-none"
                                  value={String(value)}
                                  onChange={(e) => {
                                    const features = { ...form.getValues('features') };
                                    const val = parseFloat(e.target.value);
                                    features[key] = isNaN(val) ? 0 : val;
                                    form.setValue('features', features);
                                  }}
                                />
                              )
                            }
                            
                            return (
                              <Input 
                                placeholder="Value" 
                                className="h-7 text-[10px] font-mono flex-1 rounded-sm shadow-none"
                                value={String(value)}
                                onChange={(e) => {
                                  const features = { ...form.getValues('features') };
                                  features[key] = e.target.value;
                                  form.setValue('features', features);
                                }}
                              />
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="stripe_price_id"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.stripe_id')} (Monthly)</FormLabel>
                          <FormControl>
                            <Input placeholder="price_..." className="h-8 text-xs rounded-md shadow-none" {...field} value={field.value || ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stripe_yearly_price_id"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-0.5">{t('superadmin.plans.form.stripe_id')} (Yearly)</FormLabel>
                          <FormControl>
                            <Input placeholder="price_..." className="h-8 text-xs rounded-md shadow-none" {...field} value={field.value || ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border border-border/40 p-2 bg-muted/20">
                        <FormLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer">{t('superadmin.plans.form.active')}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="scale-75"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-2 gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-8 px-4 text-[11px] font-bold">
                      {t('superadmin.actions.cancel')}
                    </Button>
                    <Button type="submit" className="h-8 px-6 text-[11px] font-bold">
                      {t('superadmin.actions.save')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {isLoading ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-30" />
              <span className="font-medium text-[10px] opacity-60 uppercase tracking-widest">{t('superadmin.dashboard.table.loading')}</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-full py-24 text-center text-muted-foreground font-medium uppercase tracking-widest text-[10px] opacity-40 italic">{t('superadmin.dashboard.table.no_accounts')}</div>
          ) : [...plans].sort((a, b) => a.price_cents - b.price_cents).map((plan) => (
            <Card key={plan.id} className={cn(
              "group relative overflow-hidden transition-all duration-300 border-border/60 bg-card hover:shadow-lg rounded-2xl",
              !plan.active && "opacity-60 bg-muted/20 grayscale"
            )}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border border-border/40 bg-muted/30",
                    )}>
                      <Package size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-foreground text-base tracking-tight">{plan.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", plan.active ? "bg-primary" : "bg-muted-foreground")} />
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {plan.interval === 'monthly' ? t('superadmin.plans.form.month') : t('superadmin.plans.form.year')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {plan.active && (
                     <div className="bg-primary/5 text-primary p-1.5 rounded-md border border-primary/10">
                      <ShieldCheck size={14} />
                     </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground tracking-tight">
                      {billingInterval === 'monthly' 
                        ? (plan.price_cents / 100).toLocaleString(undefined, { style: 'currency', currency: plan.currency || 'USD', minimumFractionDigits: 0 })
                        : ((plan.price_cents_yearly || Math.round(plan.price_cents * 12 * 0.9)) / 100).toLocaleString(undefined, { style: 'currency', currency: plan.currency || 'USD', minimumFractionDigits: 0 })
                      }
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {billingInterval === 'yearly' && (
                    <div className="mt-1">
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        Save {Math.round((1 - ((plan.price_cents_yearly || Math.round(plan.price_cents * 12 * 0.9)) / (plan.price_cents * 12))) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-border/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">{t('superadmin.plans.form.max_users')}</span>
                    <span className="text-[11px] font-bold text-foreground">{plan.max_users}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">{t('superadmin.plans.form.max_social_profiles')}</span>
                    <span className="text-[11px] font-bold text-foreground">{plan.max_social_profiles}</span>
                  </div>
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 opacity-60">
                      <LayoutTemplate size={12} />
                      {t('superadmin.plans.form.features')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(plan.features || {}).map(([key, value]) => (
                        <div key={key} className="text-[10px] bg-muted/50 text-foreground border border-border/40 rounded-md px-2 py-1 flex items-center gap-1.5 hover:bg-muted transition-colors">
                          <span className="opacity-60 text-[9px]">{key}</span>
                          <span className="font-bold">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(plan)}
                    className="flex-1 h-8 text-xs font-bold rounded-lg transition-all"
                  >
                    <Edit2 size={12} className="mr-2" />
                    {t('superadmin.actions.edit')}
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleStatus(plan)}
                    className={cn(
                      "flex-1 h-8 text-xs font-bold rounded-lg transition-all",
                      plan.active ? "text-muted-foreground hover:text-destructive hover:bg-destructive/5" : "text-primary hover:bg-primary/5"
                    )}
                  >
                    {plan.active ? t('superadmin.actions.deactivate') : t('superadmin.actions.activate')}
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => {
                      if (confirm("Are you sure?")) deletePlan(plan.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

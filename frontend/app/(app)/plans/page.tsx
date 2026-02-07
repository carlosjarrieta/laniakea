'use client';

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Plan {
  id: number;
  name: string;
  price_cents: number;
  price_cents_yearly: number | null;
  currency: string;
  max_users: number;
  features: Record<string, string | number | boolean>;
  active: boolean;
}

export default function PlansPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    refreshUser();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      const sortedPlans = (response.data || []).sort((a: Plan, b: Plan) => a.price_cents - b.price_cents);
      setPlans(sortedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error("Error", {
        description: "Failed to load plans. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setIsProcessing(planId);
    try {
      const response = await api.post('/subscriptions/checkout', {
        plan_id: planId,
        interval: billingInterval,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error("Error starting checkout", {
        description: error.response?.data?.error || "Something went wrong. Please try again.",
      });
      setIsProcessing(null);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 px-4 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles size={12} className="animate-pulse" />
          Pricing Plans
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Choose the right plan for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">your digital galaxy</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Scale your social media presence with our tailored solutions. 
          Unlock the full power of Laniakea today.
        </p>
        
        <div className="pt-8 flex justify-center">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner inline-flex">
            <button 
              onClick={() => setBillingInterval('monthly')}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                billingInterval === 'monthly' 
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700" 
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingInterval('yearly')}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                billingInterval === 'yearly' 
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700" 
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Yearly
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                Save 10%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 group/grid">
        {plans.filter(p => p.active).map((plan, index) => {
          const yearlyPrice = plan.price_cents_yearly || Math.round(plan.price_cents * 12 * 0.9);
          const price = billingInterval === 'monthly' ? plan.price_cents : yearlyPrice;
          const isProfessional = plan.name.toLowerCase().includes('professional');
          
          return (
            <div 
              key={plan.id} 
              className={cn(
                "relative transition-all duration-500 ease-out",
                "hover:!scale-105 hover:!z-20 group-hover/grid:opacity-50 hover:!opacity-100",
                isProfessional ? "lg:-mt-4 lg:mb-4 z-10 scale-[1.02]" : "z-0"
              )}
            >
              {isProfessional && (
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none"></div>
              )}
              
              <Card 
                className={cn(
                  "h-full flex flex-col border-zinc-200 dark:border-zinc-800 rounded-[2rem] transition-all duration-500 overflow-hidden",
                  isProfessional 
                    ? "shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.3)] ring-2 ring-primary/20" 
                    : "hover:border-primary/30 hover:shadow-2xl dark:hover:shadow-zinc-900/50"
                )}
              >
                {isProfessional && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white dark:border-zinc-950 shadow-xl shadow-primary/30 whitespace-nowrap">
                      ★ Recommended Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2.5 rounded-xl bg-primary/10 text-primary",
                      index === 0 ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500" : "",
                      index === 2 ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg" : ""
                    )}>
                      {index === 0 && <Zap size={20} strokeWidth={2.5} />}
                      {index === 1 && <Rocket size={20} strokeWidth={2.5} />}
                      {index === 2 && <Shield size={20} strokeWidth={2.5} />}
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{plan.name}</CardTitle>
                  </div>
                  
                  <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium mb-6">
                    {index === 0 && "Essential features for individuals."}
                    {index === 1 && "Advanced automation for growth."}
                    {index === 2 && "The ultimate suite for Enterprises."}
                  </CardDescription>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
                        {formatPrice(price, plan.currency)}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold text-lg">
                        /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingInterval === 'yearly' && (
                      <Badge variant="outline" className="text-[10px] font-bold bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-2 py-0">
                        BEST VALUE
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-8 md:p-10 pt-0 space-y-8">
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
                  
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 group/item">
                      <div className="rounded-full bg-emerald-500/10 p-1 group-hover/item:bg-emerald-500/20 transition-colors">
                        <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
                      </div>
                      <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                        <strong className="text-zinc-900 dark:text-white">{plan.max_users}</strong> {plan.max_users === 1 ? 'User' : 'Users'} Included
                      </span>
                    </li>
                    <li className="flex items-center gap-3 group/item">
                      <div className="rounded-full bg-emerald-500/10 p-1 group-hover/item:bg-emerald-500/20 transition-colors">
                        <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
                      </div>
                      <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                         <strong className="text-zinc-900 dark:text-white">{plan.max_users * 5}</strong> Social Profiles
                      </span>
                    </li>
                    {Object.entries(plan.features).map(([key, value]) => {
                      if (value === false) return null;
                      return (
                        <li key={key} className="flex items-center gap-3 group/item">
                          <div className="rounded-full bg-emerald-500/10 p-1 group-hover/item:bg-emerald-500/20 transition-colors">
                            <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
                          </div>
                          <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium capitalize">
                            {String(value) === 'true' 
                              ? key.replace(/_/g, ' ') 
                              : <><strong className="text-zinc-900 dark:text-white">{value}</strong> {key.replace(/_/g, ' ')}</>
                            }
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>

                <CardFooter className="p-8 md:p-10 pt-0">
                  <Button 
                    variant={isProfessional ? "default" : "outline"}
                    className={cn(
                      "w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300",
                      isProfessional 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_12px_32px_-12px_rgba(20,20,20,0.3)] dark:shadow-[0_12px_32px_-12px_rgba(255,255,255,0.1)] active:scale-95" 
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95"
                    )}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing === plan.id}
                  >
                    {isProcessing === plan.id ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>{isProfessional ? "Get Started" : "Select Plan"}</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 font-medium">
          Secure payment processing powered by <strong className="text-zinc-900 dark:text-white">Stripe</strong>. 
          Cancel anytime. Need a custom plan? <a href="mailto:support@laniakea.ai" className="text-primary hover:underline font-bold">Contact us</a>.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, User, Check, Loader2, Globe, Mail, Rocket, Stars, Hash, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

interface Country {
  name: string;
  code: string;
}

export default function AccountOnboardingPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const { locale } = useLanguage();
  const { t, isLoading: translationsLoading } = useTranslations(locale);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    account_type: "company",
    billing_email: "",
    country_code: "",
    tax_id: "",
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data } = await api.get("/onboarding/countries");
      setCountries(data);
    } catch (error) {
      console.error("Failed to fetch countries");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/accounts", { account: formData });
      toast.success(t('onboarding.success'));
      
      updateUser({ has_account: true });
      router.push("/plans");
    } catch (error: any) {
      const message = error.response?.data?.status?.message || "Error al crear la cuenta";
      
      if (message.includes("already belongs to an account")) {
        toast.info("Ya tienes una cuenta configurada. Redirigiendo...");
        await updateUser({ has_account: true });
        router.push("/plans");
        return;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.billing_email && formData.country_code && formData.tax_id && formData.address && formData.city;

  if (translationsLoading) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10" />
      
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center ring-1 ring-primary/20 shadow-2xl shadow-primary/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Rocket className="w-10 h-10 text-primary animate-in zoom-in-50 duration-700 delay-300" strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight">
              {t('onboarding.title').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{t('onboarding.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed">
              {t('onboarding.subtitle')}
            </p>
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-none bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 md:p-12 bg-zinc-50/30 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Stars size={24} className="text-primary" />
              {t('onboarding.blueprint')}
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-bold text-base">
              {t('onboarding.blueprint_desc')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 md:p-12 space-y-10">
            {/* Account Type Selector */}
            <div className="space-y-4">
              <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                {t('onboarding.workspace_type')}
              </label>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'individual', label: t('settings.team.roles.member'), icon: User },
                  { id: 'company', label: t('settings.team.roles.owner'), icon: Building }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setFormData({...formData, account_type: item.id})}
                    className={cn(
                      "group flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden",
                      formData.account_type === item.id 
                        ? "border-primary bg-primary/[0.03] dark:bg-primary/[0.05] text-primary shadow-lg shadow-primary/5" 
                        : "border-zinc-100 dark:border-zinc-800 hover:border-primary/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500"
                    )}
                  >
                    {formData.account_type === item.id && (
                      <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                        <Check size={16} strokeWidth={3} className="text-primary" />
                      </div>
                    )}
                    <item.icon size={32} strokeWidth={2.5} className={cn(
                      "transition-transform duration-500 group-hover:scale-110",
                      formData.account_type === item.id ? "text-primary" : "text-zinc-300 dark:text-zinc-700"
                    )} />
                    <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  {t('onboarding.company_name')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    placeholder={formData.account_type === 'company' ? "Acme Supernova S.A." : "Steller User"}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                   {t('onboarding.tax_id')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    placeholder="12.345.678-9"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                    className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl ring-2 ring-primary/10 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                   {t('onboarding.billing_email')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    type="email"
                    placeholder="billing@laniakea.ai"
                    value={formData.billing_email}
                    onChange={(e) => setFormData({...formData, billing_email: e.target.value})}
                    className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                   {t('onboarding.phone')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    placeholder="+1 234 567 890"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                   {t('onboarding.address')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    placeholder="Interstellar Way 42, Level 7"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                   {t('onboarding.region')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Globe className="size-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Select onValueChange={(v) => setFormData({...formData, country_code: v})}>
                    <SelectTrigger className="h-14 pl-12 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg">
                      <SelectValue placeholder="Select your HQ region" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800 shadow-2xl">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="rounded-xl font-medium focus:bg-primary/10 focus:text-primary">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    {t('onboarding.city')}
                  </label>
                  <Input 
                    placeholder="Santiago"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="h-14 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg px-6"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    {t('onboarding.postal_code')}
                  </label>
                  <Input 
                    placeholder="832000"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    className="h-14 bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg px-6"
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <Button 
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-[1.5rem] shadow-[0_12px_48px_-12px_rgba(0,0,0,0.2)] hover:shadow-primary/30 transition-all active:scale-[0.97] group"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <div className="flex items-center gap-3">
                    {t('onboarding.submit')}
                    <Check className="h-6 w-6 transition-transform group-hover:scale-110" strokeWidth={4} />
                  </div>
                )}
              </Button>
              <p className="mt-4 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">
                Safe Infrastructure Initialization · Powered by Stripe
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="text-center">
           <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">
             Facing issues? <a href="mailto:support@laniakea.ai" className="text-primary hover:underline transition-all">Relay to mission control</a>.
           </p>
        </div>
      </div>
    </div>
  );
}

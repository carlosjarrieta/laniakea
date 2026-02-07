"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Loader2, Command, Sparkles, CheckCircle2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import api from "@/lib/api";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("token");
  const [invitationInfo, setInvitationInfo] = useState<{account_name: string; email: string} | null>(null);

  const { handleSignup, isLoading } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslations(locale); 

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (invitationToken) {
      api.get(`/invitations/${invitationToken}`)
        .then(res => {
          setInvitationInfo(res.data);
          form.setValue("email", res.data.email);
        })
        .catch(() => {
          toast.error("Invalid or expired invitation token");
        });
    }
  }, [invitationToken, form]);

  const onSubmit = async (data: SignupFormValues) => {
    await handleSignup({ 
      ...data,
      invitation_token: invitationToken,
      role: "advertiser"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6 relative overflow-hidden font-sans">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
          className="bg-white/80 backdrop-blur-sm border-zinc-200 font-bold hover:bg-white transition-all shadow-sm"
        >
          {locale === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </Button>
      </div>

      {/* Subtle background nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />

      <Card className="w-full max-w-[1000px] overflow-hidden border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-10 flex flex-col md:flex-row bg-white">
        {/* Left Side: Visual Experience */}
        <div className="relative w-full md:w-1/2 min-h-[400px] bg-zinc-900 overflow-hidden">
          <Image 
            src="/images/laniakea_galaxy.png" 
            alt="Laniakea Supercluster Network" 
            fill
            className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex flex-col justify-end p-10 text-white">
            <div className="space-y-4 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-200 text-[10px] font-bold uppercase tracking-widest border border-violet-500/30 backdrop-blur-md">
                 <Sparkles size={10} />
                 The future of Ads
               </div>
               <h2 className="text-3xl font-black tracking-tighter leading-tight">
                 Multiply your <br /> content presence.
               </h2>
               <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-xs opacity-80">
                 Join the Laniakea supercluster and orchestrate your campaigns with god-like precision.
               </p>
            </div>
          </div>
          <div className="absolute top-10 left-10 flex items-center gap-2 text-white/90 font-black tracking-tighter text-xl">
            <div className="bg-violet-600 rounded-xl p-1.5 shadow-lg shadow-violet-600/20">
              <Command size={20} />
            </div>
            Laniakea
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
          
          {invitationInfo && (
            <div className="absolute top-8 left-8 right-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500 h-5 w-5 shrink-0" />
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  You've been invited to join <span className="text-zinc-900 dark:text-white underline decoration-emerald-500/50 decoration-2">{invitationInfo.account_name}</span>
                </p>
              </div>
            </div>
          )}

          <div className={invitationInfo ? "mt-16 mb-8" : "mb-8 text-center md:text-left"}>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2 leading-none">
              {t('signup.title')}
            </h1>
            <p className="text-zinc-500 font-bold text-sm">
              {t('signup.subtitle')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{t('signup.name_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="h-12 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10 rounded-2xl transition-all font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{t('login.email_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={!!invitationToken}
                        placeholder={t('login.email_placeholder')} 
                        className="h-12 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10 rounded-2xl transition-all font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{t('login.password_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-12 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10 rounded-2xl transition-all font-bold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{t('signup.confirm_password_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-12 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10 rounded-2xl transition-all font-bold"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-black text-lg rounded-2xl shadow-[0_12px_40px_-12px_rgba(124,58,237,0.4)] transition-all active:scale-[0.97] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Initializing...
                  </div>
                ) : (
                  t('signup.submit_button')
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm font-bold text-zinc-500">
            {t('signup.already_have_account')} {' '}
            <Link href="/login" className="text-violet-600 font-black hover:text-violet-700 transition-colors">
              {t('signup.login_here')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SignupForm />
    </Suspense>
  );
}

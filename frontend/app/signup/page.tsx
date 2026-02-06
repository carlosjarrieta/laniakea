"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
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
import { Loader2, Command } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";

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

export default function SignupPage() {
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

  const onSubmit = async (data: SignupFormValues) => {
    await handleSignup({ 
      ...data,
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
            <div className="space-y-2 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-forwards">
               <h2 className="text-2xl font-bold tracking-tight">{t('login.sidebar_title')}</h2>
               <p className="text-zinc-300 text-sm leading-relaxed max-w-sm">
                 {t('login.sidebar_desc')}
               </p>
            </div>
          </div>
          <div className="absolute top-10 left-10 flex items-center gap-2 text-white/90 font-bold tracking-tight">
            <div className="bg-violet-600 rounded-lg p-1">
              <Command size={18} />
            </div>
            Laniakea
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2">
              {t('signup.title')}
            </h1>
            <p className="text-zinc-500 font-medium">
              {t('signup.subtitle')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-zinc-700">{t('signup.name_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="h-11 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
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
                    <FormLabel className="text-sm font-bold text-zinc-700">{t('login.email_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('login.email_placeholder')} 
                        className="h-11 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
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
                      <FormLabel className="text-sm font-bold text-zinc-700">{t('login.password_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-11 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
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
                      <FormLabel className="text-sm font-bold text-zinc-700">{t('signup.confirm_password_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-11 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
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
                className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-xl shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all active:scale-[0.98] mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('login.submitting')}
                  </>
                ) : (
                  t('signup.submit_button')
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm font-medium text-zinc-500">
            {t('signup.already_have_account')} {' '}
            <Link href="/login" className="text-violet-600 font-bold hover:text-violet-700 hover:underline underline-offset-4">
              {t('signup.login_here')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

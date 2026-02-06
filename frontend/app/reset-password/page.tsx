"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
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
import { useResetPassword } from "@/hooks/use-reset-password";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("reset_password_token");
  
  const { isLoading, resetPassword } = useResetPassword();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    await resetPassword({
      reset_password_token: token,
      ...data
    });
  };

  if (!token) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
        <h3 className="text-xl font-bold text-red-900 mb-2">Invalid Token</h3>
        <p className="text-red-600 text-sm mb-6">
          The password reset token is missing or invalid.
        </p>
        <Button 
          onClick={() => router.push("/forgot-password")}
          className="bg-red-600 hover:bg-red-700 rounded-xl"
        >
          Go to Forgot Password
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-zinc-700">{t('signup.password_label')}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
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
                  className="h-12 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            t('password.update_password')
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6 relative overflow-hidden font-sans">
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
            <div className="space-y-2">
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
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2">
              {t('password.reset_title')}
            </h1>
            <p className="text-zinc-500 font-medium">
              {t('password.reset_subtitle')}
            </p>
          </div>

          <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-600" size={40} /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </Card>
    </div>
  );
}

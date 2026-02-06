"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { Loader2, Command, ArrowLeft } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useForgotPassword } from "@/hooks/use-forgot-password";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { isLoading, isSent, setIsSent, sendResetLink } = useForgotPassword();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await sendResetLink(data.email);
  };

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
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-violet-600 transition-colors mb-6 uppercase tracking-widest"
            >
              <ArrowLeft size={14} />
              {t('common.back_to_login')}
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2">
              {t('password.forgot_title')}
            </h1>
            <p className="text-zinc-500 font-medium">
              {t('password.forgot_subtitle')}
            </p>
          </div>

          {!isSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-zinc-700">{t('login.email_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('login.email_placeholder')} 
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
                    t('password.send_reset_link')
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center p-8 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(124,58,237,0.3)]">
                <Command className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{t('password.instructions_sent')}</h3>
              <p className="text-zinc-600 text-sm mb-6">
                {t('password.check_email_loop_instructions')}
              </p>
              <Button 
                variant="outline" 
                className="w-full h-12 border-violet-200 text-violet-600 hover:bg-violet-100 font-bold rounded-xl"
                onClick={() => setIsSent(false)}
              >
                {t('password.try_another_email')}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

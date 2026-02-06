"use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useSecurity } from "@/hooks/use-security";

const securityFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  password_confirmation: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export default function SecuritySettingsPage() {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const { isLoading, updatePassword } = useSecurity();

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(data: SecurityFormValues) {
    const result = await updatePassword(data);
    if (result.success) {
      form.reset();
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password Change Card */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-base font-medium">{t('settings.menu.security')}</CardTitle>
                  <CardDescription className="text-xs">
                    Change your password and secure your account.
                  </CardDescription>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  {t('settings.security.account_protected')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('signup.password_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
                      />
                    </FormControl>
                   <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-medium text-muted-foreground">{t('signup.confirm_password_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-xs font-medium"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              {t('password.update_password')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

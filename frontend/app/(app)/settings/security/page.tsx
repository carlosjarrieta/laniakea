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
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {t('settings.menu.security')}
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          Change your password and secure your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Change Card */}
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  {t('settings.menu.security')}
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold h-4 px-1.5 uppercase tracking-tighter">
                  {t('settings.security.account_protected')}
                </Badge>
              </div>
              <CardDescription className="text-[11px]">
                Change your password and secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('signup.password_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
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
                    <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('signup.confirm_password_label')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-6 text-xs font-bold rounded-lg shadow-sm"
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

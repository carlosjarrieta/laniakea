"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Globe, Palette } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useProfile } from "@/hooks/use-profile";
import { ThemeCustomizer } from "@/components/theme-customizer";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  timezone: z.string().min(1, "Please select a timezone."),
  locale: z.string().min(1, "Please select a language."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsPage() {
  const { user, isLoading, isFetching, fetchProfile, updateProfile } = useProfile();
  const { locale: currentLocale } = useLanguage();
  const { t } = useTranslations(currentLocale);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      timezone: "UTC",
      locale: "es",
    },
  });

  // Fetch fresh profile data from server on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      console.log("Resetting form with user:", user);
      form.reset({
        name: user.name || "",
        email: user.email || "",
        timezone: user.timezone || "UTC",
        locale: user.locale || "es",
      });
    }
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    await updateProfile(data);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {t('settings.menu.profile')}
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          {t('settings.profile.personal_info_desc')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Card */}
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-muted/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User size={16} className="text-primary" />
                {t('settings.profile.personal_info')}
              </CardTitle>
              <CardDescription className="text-[11px]">
                {t('settings.profile.personal_info_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('signup.name_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('login.email_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="h-9 text-xs bg-muted/20 border-border rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-muted/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                {t('settings.profile.preferences')}
              </CardTitle>
              <CardDescription className="text-[11px]">
                Customize your language and timezone preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locale"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.profile.language')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs bg-muted/20 border-border rounded-lg">
                            <SelectValue placeholder={t('settings.profile.select_language')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es" className="text-xs">Español (ES)</SelectItem>
                          <SelectItem value="en" className="text-xs">English (EN)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.profile.timezone')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs bg-muted/20 border-border rounded-lg">
                            <SelectValue placeholder={t('settings.profile.select_timezone')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UTC" className="text-xs">UTC (Greenwich Mean Time)</SelectItem>
                          <SelectItem value="Eastern Time (US & Canada)" className="text-xs">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Central Time (US & Canada)" className="text-xs">Central Time (CT)</SelectItem>
                          <SelectItem value="Mountain Time (US & Canada)" className="text-xs">Mountain Time (MT)</SelectItem>
                          <SelectItem value="Pacific Time (US & Canada)" className="text-xs">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Madrid" className="text-xs">Madrid (CET)</SelectItem>
                          <SelectItem value="Bogota" className="text-xs">Bogotá (COT)</SelectItem>
                          <SelectItem value="Mexico City" className="text-xs">Mexico City (CST)</SelectItem>
                          <SelectItem value="Buenos Aires" className="text-xs">Buenos Aires (ART)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-muted/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette size={16} className="text-primary" />
                {t('settings.profile.theme_color')}
              </CardTitle>
              <CardDescription className="text-[11px]">
                {t('settings.profile.theme_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">{t('settings.profile.theme_color')}</span>
                  <ThemeCustomizer className="w-full" />
                </div>
              </div>
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
              {t('settings.profile.save_changes')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

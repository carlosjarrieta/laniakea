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
import { Loader2 } from "lucide-react";
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
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Information Card */}
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">{t('settings.profile.personal_info')}</CardTitle>
              <CardDescription className="text-xs">
                {t('settings.profile.personal_info_desc') || 'Update your account settings and preferences.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('signup.name_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('login.email_label')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="h-9 text-sm border-border/60 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50" 
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
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">{t('settings.profile.preferences')}</CardTitle>
              <CardDescription className="text-xs">
                Customize your language and timezone preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locale"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.profile.language')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm border-border/60">
                            <SelectValue placeholder={t('settings.profile.select_language')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="es">Español (ES)</SelectItem>
                          <SelectItem value="en">English (EN)</SelectItem>
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
                      <FormLabel className="text-xs font-medium text-muted-foreground">{t('settings.profile.timezone')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm border-border/60">
                            <SelectValue placeholder={t('settings.profile.select_timezone')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UTC">UTC (Greenwich Mean Time)</SelectItem>
                          <SelectItem value="Eastern Time (US & Canada)">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Central Time (US & Canada)">Central Time (CT)</SelectItem>
                          <SelectItem value="Mountain Time (US & Canada)">Mountain Time (MT)</SelectItem>
                          <SelectItem value="Pacific Time (US & Canada)">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Madrid">Madrid (CET)</SelectItem>
                          <SelectItem value="Bogota">Bogotá (COT)</SelectItem>
                          <SelectItem value="Mexico City">Mexico City (CST)</SelectItem>
                          <SelectItem value="Buenos Aires">Buenos Aires (ART)</SelectItem>
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
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">{t('settings.profile.theme_color')}</CardTitle>
              <CardDescription className="text-xs">
                {t('settings.profile.theme_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeCustomizer />
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
              {t('settings.profile.save_changes')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

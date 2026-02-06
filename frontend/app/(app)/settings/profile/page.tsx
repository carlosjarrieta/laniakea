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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { useProfile } from "@/hooks/use-profile";

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
  const { user, isLoading, updateProfile } = useProfile();
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

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        timezone: user.timezone || "UTC",
        locale: user.locale || "es",
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    await updateProfile(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings.profile.personal_info')}</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings and preferences.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="rounded-xl h-11" />
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
                  <FormLabel>{t('login.email_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} className="rounded-xl h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="es">Español (ES)</SelectItem>
                      <SelectItem value="en">English (EN)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select a timezone" />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="bg-violet-600 hover:bg-violet-700 h-11 px-8 rounded-xl shadow-[0_8px_16px_-4px_rgba(124,58,237,0.4)]"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('settings.profile.save_changes')}
          </Button>
        </form>
      </Form>
    </div>
  );
}

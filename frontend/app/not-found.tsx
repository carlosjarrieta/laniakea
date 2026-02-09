'use client';

import Link from "next/link";
import { MoveLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

export default function NotFound() {
  const { locale } = useLanguage();
  const { t, isLoading } = useTranslations(locale);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full -z-10" />
      
      <div className="relative w-full max-w-lg text-center space-y-8">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        {/* Abstract Icon Container */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative p-5 rounded-2xl bg-card border border-border/60 shadow-2xl">
              <Rocket className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {t('not_found.title')}
          </h2>
          <p className="text-primary font-medium tracking-wide uppercase text-xs">
            {t('not_found.subtitle')}
          </p>
        </div>

        <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
          {t('not_found.description')}
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Button asChild size="lg" className="h-11 px-8 text-xs font-bold gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
            <Link href="/">
              <MoveLeft className="w-4 h-4" />
              {t('not_found.back_home')}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* System Footer Decoration */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="px-3 py-1.5 rounded-full border border-border/40 bg-muted/30 backdrop-blur-sm text-[10px] text-muted-foreground font-bold tracking-widest flex items-center gap-2 uppercase">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Laniakea Supercluster • Deep Space Protocol
        </div>
      </div>
    </div>
  );
}

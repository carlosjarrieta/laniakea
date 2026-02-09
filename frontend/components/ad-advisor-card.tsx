"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

interface AdAdvisorCardProps {
  postTitle: string;
  platform: "facebook" | "instagram" | "tiktok" | "linkedin";
  engagementRate: string;
  projectedRoi: string;
  estimatedReach: string;
  image?: string;
  className?: string;
}

export function AdAdvisorCard({
  postTitle,
  platform,
  engagementRate,
  projectedRoi,
  estimatedReach,
  image,
  className
}: AdAdvisorCardProps) {
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  return (
    <Card className={cn("overflow-hidden border-border/40 bg-card/50 shadow-sm hover:shadow-md transition-all group", className)}>
      <div className="relative h-32 w-full bg-muted overflow-hidden">
        {image ? (
          <img src={image} alt={postTitle} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
             <Rocket className="text-primary/20 h-10 w-10" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90 border-border/40 capitalize text-[9px] font-bold px-1.5 py-0 h-4">
          {platform}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('dashboard.ad_advisor.badges.top_performer')}</span>
        </div>
        <CardTitle className="text-sm font-bold line-clamp-1 leading-tight">{postTitle}</CardTitle>
        <CardDescription className="text-[11px] line-clamp-2 mt-1 font-medium">
          {t('dashboard.ad_advisor.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/20">
          <div className="space-y-0.5">
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tight">{t('dashboard.ad_advisor.roi')}</span>
            <p className="text-sm font-black text-foreground">{projectedRoi}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tight">{t('dashboard.ad_advisor.reach')}</span>
            <p className="text-sm font-black text-foreground">{estimatedReach}</p>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-muted-foreground uppercase tracking-wider">{t('dashboard.ad_advisor.opportunity')}</span>
            <span className="text-primary">85%</span>
          </div>
          <Progress value={85} className="h-1 bg-primary/10" />
        </div>

        <Button size="sm" className="w-full h-8 text-xs font-bold gap-2 mt-2 shadow-sm">
          <Rocket size={14} className="text-primary-foreground" />
          {t('dashboard.ad_advisor.boost')}
          <ArrowRight size={12} className="ml-auto opacity-50" />
        </Button>
      </CardContent>
    </Card>
  );
}

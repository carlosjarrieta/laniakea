"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { RefreshCcw, BarChart2, MousePointer2, Heart } from "lucide-react";

interface AdAdvisorCardProps {
  postTitle: string;
  platform: "facebook" | "instagram" | "tiktok" | "linkedin";
  engagementRate: string;
  projectedRoi: string;
  estimatedReach: string;
  image?: string;
  className?: string;
  metrics?: {
    impressions?: number;
    clicks?: number;
    reactions?: number;
  };
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdAdvisorCard({
  postTitle,
  platform,
  engagementRate,
  projectedRoi,
  estimatedReach,
  image,
  className,
  metrics,
  onRefresh,
  isRefreshing
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
 
        {onRefresh && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm border-border/40 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isRefreshing}
          >
            <RefreshCcw className={cn("h-3 w-3 text-foreground", isRefreshing && "animate-spin")} />
          </Button>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{t('dashboard.ad_advisor.badges.top_performer')}</span>
        </div>
        <CardTitle className="text-sm font-bold line-clamp-1 leading-tight">{postTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {metrics ? (
          <div className="grid grid-cols-3 gap-1 py-2 border-y border-border/20">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] text-muted-foreground uppercase font-black">{t('dashboard.ad_advisor.reach')}</span>
              <div className="flex items-center gap-1">
                <BarChart2 size={10} className="text-primary/70" />
                <span className="text-[10px] font-black">{metrics.impressions || 0}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5 border-x border-border/20">
              <span className="text-[8px] text-muted-foreground uppercase font-black">Clicks</span>
              <div className="flex items-center gap-1">
                <MousePointer2 size={10} className="text-primary/70" />
                <span className="text-[10px] font-black">{metrics.clicks || 0}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] text-muted-foreground uppercase font-black">Reacc</span>
              <div className="flex items-center gap-1">
                <Heart size={10} className="text-primary/70" />
                <span className="text-[10px] font-black">{metrics.reactions || 0}</span>
              </div>
            </div>
          </div>
        ) : (
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
        )}
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-muted-foreground uppercase tracking-wider">{t('dashboard.ad_advisor.opportunity')}</span>
            <span className="text-primary">{engagementRate}</span>
          </div>
          <Progress value={parseInt(engagementRate) || 85} className="h-1 bg-primary/10" />
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

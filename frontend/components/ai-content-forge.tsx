"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, Video, Wand2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

export function AIContentForge() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulation of generation
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative group">
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Sparkles size={120} className="text-primary" />
      </div>
      
      <CardHeader className="p-4 md:p-6 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border-none">
            {t("dashboard.content_forge.agent_active")}
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-base md:text-lg font-bold tracking-tight">
            {t("dashboard.content_forge.title")}
          </CardTitle>
          <span className="text-[10px] font-bold bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider border border-border/40">
            {t("dashboard.content_forge.beta_badge")}
          </span>
        </div>
        <CardDescription className="text-xs font-medium text-muted-foreground mt-1">
          {t("dashboard.content_forge.subtitle")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 pt-2 space-y-4">
        <div className="relative">
          <Textarea 
            placeholder={t("dashboard.content_forge.placeholder")}
            className="min-h-[100px] md:min-h-[120px] bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 text-sm resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute bottom-3 right-3">
            <Button 
              size="sm" 
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className="h-8 md:h-9 px-4 font-bold gap-2 shadow-sm"
            >
              {isGenerating ? (
                <RefreshCw size={14} className="animate-spin text-primary-foreground" />
              ) : (
                <Wand2 size={14} className="text-primary-foreground" />
              )}
              <span className="text-xs">
                {isGenerating ? t("dashboard.content_forge.generating") : t("dashboard.content_forge.generate_button")}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/40 hover:border-primary/30 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Sparkles size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider leading-none mb-1 line-clamp-1">
                {t("dashboard.content_forge.features.copy")}
              </p>
              <p className="text-xs font-bold text-foreground leading-none line-clamp-1">
                {t("dashboard.content_forge.features.copy_desc")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/40 hover:border-primary/30 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <ImageIcon size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider leading-none mb-1 line-clamp-1">
                {t("dashboard.content_forge.features.creatives")}
              </p>
              <p className="text-xs font-bold text-foreground leading-none line-clamp-1">
                {t("dashboard.content_forge.features.creatives_desc")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/40 hover:border-primary/30 transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Video size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider leading-none mb-1 line-clamp-1">
                {t("dashboard.content_forge.features.video")}
              </p>
              <p className="text-xs font-bold text-foreground leading-none line-clamp-1">
                {t("dashboard.content_forge.features.video_desc")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

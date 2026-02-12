"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Target, DollarSign, BrainCircuit, RefreshCw, Save, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdsManagerProps {
  campaignId: number;
  initialDescription?: string;
  initialBudget?: number;
  initialSegmentation?: any;
}

export function AdsManager({ 
  campaignId, 
  initialDescription = "", 
  initialBudget = 0,
  initialSegmentation = null
}: AdsManagerProps) {
  const [description, setDescription] = useState(initialDescription);
  const [budget, setBudget] = useState(initialBudget || 10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [segmentation, setSegmentation] = useState<any>(initialSegmentation);
  const [adEnabled, setAdEnabled] = useState(!!initialSegmentation); // Auto-enable if segmentation exists
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [pages, setPages] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [budgetWarning, setBudgetWarning] = useState<{ message: string, detail: string } | null>(null);
  
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  useEffect(() => {
    if (adEnabled) {
      fetchAdAccounts();
      fetchPages();
    }
  }, [adEnabled]);

  // Update internal state if props change (e.g. after save and reload)
  useEffect(() => {
    if (initialSegmentation) {
      setSegmentation(initialSegmentation);
      setAdEnabled(true);
    }
    if (initialDescription) setDescription(initialDescription);
    if (initialBudget) setBudget(initialBudget);
  }, [initialSegmentation, initialDescription, initialBudget]);

  const fetchAdAccounts = async () => {
    try {
      const response = await api.get("/api/v1/integrations/facebook_ad_accounts");
      
      if (response.data.error) {
        toast.error(`Error FB: ${response.data.error}`);
        return;
      }

      setAdAccounts(response.data.ad_accounts || []);
      if (response.data.ad_accounts?.length > 0) {
        setSelectedAdAccount(response.data.ad_accounts[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching ad accounts:", error);
      const msg = error.response?.data?.error || "Error al cargar cuentas publicitarias";
      toast.error(msg);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await api.get("/api/v1/integrations/facebook_pages");

      if (response.data.error) {
        toast.error(`Error FB: ${response.data.error}`);
        return;
      }

      const pagesData = response.data.pages || [];
      setPages(pagesData);
      if (pagesData.length > 0 && !selectedPage) {
        setSelectedPage(pagesData[0].id);
      }
    } catch (error: any) {
      console.error("Error fetching pages:", error);
      const msg = error.response?.data?.error || "Error al cargar páginas";
      toast.error(msg);
    }
  };

  const handleToggleAds = (enabled: boolean) => {
    setAdEnabled(enabled);
    if (enabled) {
      fetchAdAccounts();
      fetchPages();
    }
  };

  const generateSegmentation = async () => {
    if (!description) return toast.error(t("dashboard.ads_manager.seg_placeholder"));
    
    setIsGenerating(true);
    try {
      const response = await api.post("/ai/segment", {
        prompt: description,
        model: "gpt-4o"
      });
      
      if (response.data && !response.data.error) {
        setSegmentation(response.data);
        toast.success(t("dashboard.ads_manager.seg_success"));
      } else {
        throw new Error(response.data.error || "AI Error");
      }
    } catch (error) {
      console.error("Segmentation error:", error);
      toast.error("Error AI");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAdsConfig = async () => {
    setIsSaving(true);
    try {
      await api.post(`/api/v1/campaigns/${campaignId}/ad_campaigns`, {
        ad_campaign: {
          budget: budget,
          status: adEnabled ? 'active' : 'draft',
          metadata: {
            segmentation: segmentation,
            description: description
          }
        }
      });
      toast.success(t("dashboard.ads_manager.save_success"));
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error Save");
    } finally {
      setIsSaving(false);
    }
  };

  const launchAds = async () => {
    if (!selectedAdAccount || !selectedPage) {
      return toast.error("Selecciona una cuenta publicitaria y una página");
    }

    setIsPublishing(true);
    setBudgetWarning(null); // Clear previous warnings
    
    try {
      await api.post(`/api/v1/campaigns/${campaignId}/ad_campaigns/publish`, {
        ad_account_id: selectedAdAccount,
        page_id: selectedPage
      });
      toast.success("¡Campaña lanzada con éxito en Facebook!");
    } catch (error: any) {
      console.error("Publish error:", error);
      
      // Handle Budget Warning specifically
      if (error.response?.status === 422 && error.response?.data?.type === 'budget_warning') {
        const warning = error.response.data;
        setBudgetWarning({
          message: warning.error,
          detail: warning.detail
        });
        // Also show a warning toast
        toast.warning(warning.error, {
           description: "Revisa la alerta abajo para más detalles."
        });
      } else {
        const msg = error.response?.data?.error || "Error al lanzar la campaña";
        toast.error(msg);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative group">
      <CardHeader className="pb-3 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Target size={18} />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                {t("dashboard.ads_manager.title")}
              </CardTitle>
              <CardDescription className="text-[10px] font-medium leading-none mt-1">
                {t("dashboard.ads_manager.subtitle")}
              </CardDescription>
            </div>
          </div>
          <Switch 
            checked={adEnabled} 
            onCheckedChange={handleToggleAds}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>
      
      {adEnabled && (
        <CardContent className="space-y-5 pt-0 px-4 md:px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
          
          {/* Ad Account & Page Selectors */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">Cuenta Publicitaria</Label>
              <Select value={selectedAdAccount} onValueChange={setSelectedAdAccount}>
                <SelectTrigger className="h-9 text-[11px] bg-background/50 border-border/40 rounded-lg">
                  <SelectValue placeholder="Seleccionar cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {adAccounts.length > 0 ? (
                    adAccounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id} className="text-[11px]">
                        {acc.name || `Cuenta ${acc.account_id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-[10px] text-muted-foreground text-center">
                      No se encontraron cuentas. <br/>
                      Asegúrate de tener una cuenta de anuncios activa.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">Página de Facebook</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger className="h-9 text-[11px] bg-background/50 border-border/40 rounded-lg">
                  <SelectValue placeholder="Seleccionar página" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-[11px]">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <DollarSign size={10} className="text-primary" /> {t("dashboard.ads_manager.daily_budget")}
              </Label>
              <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary bg-primary/5 px-2">
                ${budget} {selectedAdAccount ? "LOCAL" : "USD"}
              </Badge>
            </div>
            <Slider 
              value={[budget]} 
              onValueChange={(vals) => {
                 setBudget(vals[0]);
                 if (budgetWarning) setBudgetWarning(null); // Clear warning on interaction
              }} 
              max={100000} 
              step={100} 
              className="py-1"
            />
            <p className="text-[9px] text-muted-foreground text-right italic">
              Ajusta según tu moneda local
            </p>
          </div>

          {/* AI Segmentation */}
          <div className="space-y-3 pt-2 border-t border-border/40">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
              <BrainCircuit size={10} className="text-primary" /> {t("dashboard.ads_manager.smart_segmentation")}
            </Label>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder={t("dashboard.ads_manager.seg_placeholder")}
                className="text-xs min-h-[60px] h-16 resize-none bg-background/50 border-border/40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      className="h-16 w-10 shrink-0 bg-primary hover:bg-primary/90 shadow-md active:scale-95 transition-all"
                      onClick={generateSegmentation}
                      disabled={isGenerating || !description}
                    >
                      {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px] font-bold">{t("dashboard.ads_manager.generate_seg")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {segmentation && (
              <div className="p-2 bg-background/60 rounded-xl border border-border/40 space-y-1">
                <div className="flex flex-wrap gap-1">
                  {segmentation.interests?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-[8px] h-3 bg-primary/5 text-primary border-primary/10 font-bold">
                      {tag}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-[8px] h-3">+{segmentation.interests?.length - 3} más</Badge>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                className="font-black text-[9px] tracking-widest uppercase h-9 border-primary/20 text-primary"
                onClick={saveAdsConfig}
                disabled={isSaving}
              >
                <Save size={12} className="mr-2" /> GUARDAR
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="bg-primary hover:bg-primary/90 font-black text-[9px] tracking-widest uppercase h-9 shadow-lg shadow-primary/20 animate-pulse-slow"
                      onClick={launchAds}
                      disabled={isPublishing || !segmentation}
                    >
                      {isPublishing ? <RefreshCw className="animate-spin mr-2" size={12} /> : <Megaphone size={12} className="mr-2" />}
                      LANZAR ADS
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px] font-bold">Publicar campaña oficial en Meta Ads Manager</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Warning Alert */}
            {budgetWarning && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                 <div className="bg-amber-500/20 p-1 rounded-full shrink-0 mt-0.5">
                   <Megaphone size={14} className="text-amber-600" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-[11px] font-bold text-amber-700 uppercase">{budgetWarning.message}</p>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">
                     {budgetWarning.detail}
                   </p>
                 </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

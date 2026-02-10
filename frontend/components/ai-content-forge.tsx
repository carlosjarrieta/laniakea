"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, Video, Wand2, RefreshCw, Paperclip, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Edit3 } from "lucide-react";

import api from "@/lib/api";

const AI_MODELS = [
  { id: 'gemini', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '✨' },
  // { id: 'gemini-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: '🧠' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🤖' },
  // { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', icon: '⚡' },
  // { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', icon: '☁️' },
];

export function AIContentForge() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [manualContent, setManualContent] = useState("");
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("model", selectedModel);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.post("/ai/forge", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error forging campaign:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative group">
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Sparkles size={120} className="text-primary" />
      </div>
      
      <CardHeader className="p-4 md:p-6 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border-none">
            {t("dashboard.content_forge.agent_active")}
          </Badge>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-7 w-[160px] text-[10px] font-bold bg-background/50 border-border/40 focus:ring-1 focus:ring-primary/20 rounded-lg">
              <SelectValue placeholder="Seleccionar Modelo" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-md border-border/40">
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-[10px] font-medium focus:bg-primary/10">
                  <div className="flex items-center gap-2">
                    <span>{model.icon}</span>
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-[8px] opacity-50 uppercase tracking-tighter">{model.provider}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9 bg-background/50 border border-border/40 p-1 mb-4">
            <TabsTrigger value="ai" className="text-[10px] font-bold uppercase tracking-wider gap-2">
              <Sparkles size={14} />
              {t("dashboard.content_forge.tabs.ai")}
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-[10px] font-bold uppercase tracking-wider gap-2">
              <Edit3 size={14} />
              {t("dashboard.content_forge.tabs.manual")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-0 border-none p-0 focus-visible:ring-0">
            <div className="relative">
              <Textarea 
                placeholder={t("dashboard.content_forge.placeholder")}
                className="min-h-[100px] md:min-h-[120px] bg-background/50 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 text-sm resize-none pb-12"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              {imagePreview && (
                <div className="absolute top-3 right-3 animate-in zoom-in-50 duration-200">
                  <div className="relative group/preview h-14 w-14 rounded-lg overflow-hidden border border-primary/30 shadow-lg">
                    <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
                    <button 
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <input
                  type="file"
                  id="forge-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="forge-image-upload"
                  className="flex items-center gap-2 px-3 h-8 rounded-lg bg-background/80 hover:bg-background border border-border/40 text-[10px] font-bold text-muted-foreground hover:text-primary transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Paperclip size={14} />
                  {imageFile ? "Imagen cargada" : "Referencia Visual"}
                </label>
                
                {imageFile && (
                  <Badge variant="outline" className="h-5 px-2 text-[8px] bg-primary/10 border-primary/20 text-primary">
                    Modo Visión Activo
                  </Badge>
                )}
              </div>

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
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-0 border-none p-0 focus-visible:ring-0">
             <RichTextEditor 
                content={manualContent}
                onChange={setManualContent}
                label={t("dashboard.content_forge.manual.label")}
                placeholder={t("dashboard.content_forge.manual.placeholder")}
             />
             <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] font-bold uppercase tracking-wider gap-2"
                  onClick={() => setManualContent("")}
                >
                   {t("dashboard.content_forge.manual.clean")}
                </Button>
             </div>
          </TabsContent>
        </Tabs>

        {result && result.error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-2">
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <div className="mt-6 pt-6 border-t border-border/40 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Wand2 size={16} className="text-primary" />
              {result.campaign_name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.posts?.map((post: any, idx: number) => {
                const promptForImage = post.image_prompt || post.video_prompt || result.campaign_name;
                const encodedPrompt = encodeURIComponent(promptForImage);
                const seed = idx + Math.floor(Date.now() / 10000); 
                
                // Prioridad: 1. Imagen DALL-E, 2. Imagen subida por usuario, 3. Pollinations fallback
                let imageUrl = post.real_image_url;
                if (!imageUrl && imagePreview) {
                  imageUrl = imagePreview;
                } else if (!imageUrl) {
                  imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&nologo=true&seed=${seed}`;
                }

                return (
                  <Card key={idx} className="bg-background/40 border-border/20 shadow-none flex flex-col overflow-hidden group/post hover:border-primary/40 transition-all duration-300">
                    <div className="aspect-video w-full bg-muted border-b border-border/10 relative overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={post.platform}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/post:scale-105"
                        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        style={{ opacity: 0, transition: "opacity 0.5s ease-in" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge variant="secondary" className="text-[8px] h-4 bg-background/80 backdrop-blur-sm border-none">
                          {post.platform === "TikTok" ? "VIDEO AI" : "IMAGE AI"}
                        </Badge>
                      </div>

                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-[9px] text-white/90 font-medium italic leading-tight line-clamp-2 drop-shadow-md">
                          "{post.image_prompt || post.video_prompt}"
                        </p>
                      </div>
                    </div>
                    <CardHeader className="p-3 pb-1">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={cn(
                          "text-[9px] uppercase tracking-tighter h-5",
                          post.platform === "Instagram" && "border-pink-500/50 text-pink-600 bg-pink-50/50",
                          post.platform === "Facebook" && "border-blue-600/50 text-blue-700 bg-blue-50/50",
                          post.platform === "LinkedIn" && "border-blue-800/50 text-blue-900 bg-blue-50/50",
                          post.platform === "TikTok" && "border-foreground/50 text-foreground bg-slate-50/50"
                        )}>
                          {post.platform}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">ROI: {result.estimated_roi}x</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-2 flex-grow">
                      <p className="text-[11px] text-foreground leading-relaxed line-clamp-6 mb-3">
                        {post.copy}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {post.hashtags?.map((h: string) => (
                          <span key={h} className="text-[9px] text-primary font-medium">{h}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

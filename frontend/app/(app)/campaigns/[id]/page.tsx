"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { campaignsApi, Campaign, CampaignPost } from "@/lib/campaigns-api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Save, 
  Megaphone, 
  MoreHorizontal,
  Calendar,
  Layers,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FacebookConnect } from "@/components/facebook-connect";

import { useCampaigns } from "@/hooks/use-campaigns";
// ... (imports)

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const { getOne, update, loading } = useCampaigns();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: ""
  });

  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    try {
      const data = await getOne(id);
      setCampaign(data);
      setFormData({
        name: data.name,
        description: data.description,
        status: data.status
      });
    } catch (error) {
      console.error("Error loading campaign:", error);
      toast.error("Error al cargar la campaña");
      router.push("/campaigns");
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updatedCampaign = await update(id, formData);
      setCampaign(updatedCampaign);
      toast.success("Campaña actualizada correctamente");
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Error al actualizar la campaña");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
     setSaving(true);
     try {
       const updated = await update(id, { ...formData, status: newStatus });
       setCampaign(updated);
       setFormData(prev => ({ ...prev, status: newStatus }));
       toast.success(`Estado actualizado a ${newStatus}`);
     } catch (error) {
       toast.error("Error al cambiar estado");
     } finally {
       setSaving(false);
     }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header & Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
             <Link href="/campaigns" className="hover:text-primary transition-colors">Campañas</Link>
             <span>/</span>
             <span className="font-medium text-foreground">Detalle</span>
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Gestión de Campaña</h1>
        </div>
        <div className="flex items-center gap-2">
           <Button 
             onClick={handleUpdate} 
             disabled={saving || (formData.name === campaign.name && formData.description === campaign.description)}
             className="gap-2 font-bold"
           >
             {saving && <Loader2 size={14} className="animate-spin" />}
             <Save size={16} />
             {saving ? 'Guardando...' : 'Guardar Cambios'}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campaign Details & Settings */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                 <div>
                   <CardTitle className="text-lg font-bold flex items-center gap-2">
                     <Megaphone size={18} className="text-primary" />
                     Información General
                   </CardTitle>
                   <CardDescription>Detalles principales de tu estrategia</CardDescription>
                 </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed">
                        <Badge className={cn(
                          "ml-1 h-5 px-1.5 text-[10px] uppercase font-bold border-none",
                          formData.status === 'active' ? "bg-emerald-500 text-white" :
                          formData.status === 'draft' ? "bg-blue-500 text-white" :
                          "bg-zinc-500 text-white"
                        )}>
                          {formData.status}
                        </Badge>
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange('draft')}>
                        Marcar como Borrador
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                         Activar Campaña
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('archived')} className="text-muted-foreground">
                         Archivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Campaña</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Lanzamiento de Verano 2024"
                  className="font-semibold text-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción / Objetivo</label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el objetivo principal de esta campaña..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Posts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Layers size={18} className="text-primary" />
                Piezas de Contenido ({campaign.campaign_posts?.length || 0})
              </h2>
            </div>
            
            {campaign.campaign_posts && campaign.campaign_posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campaign.campaign_posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden group hover:border-primary/40 transition-colors">
                    <div className="aspect-video w-full bg-muted/20 relative">
                      {post.real_image_url || post.image_url ? (
                        <img 
                          src={post.real_image_url || post.image_url} 
                          alt="Post preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/40">
                          <span className="text-xs text-muted-foreground italic">Sin imagen</span>
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase backdrop-blur-md bg-background/80">
                          {post.platform}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border/10">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{post.status}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-border/60 p-8 flex flex-col items-center justify-center text-center bg-transparent">
                 <p className="text-sm font-medium text-muted-foreground">No hay piezas de contenido generadas aún.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Metadata or Stats */}
        <div className="space-y-6">
           <Card className="border-border/40 bg-card/40 backdrop-blur-sm h-fit sticky top-6">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detalles Técnicos</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-border/10">
                  <span className="text-muted-foreground">ID Campaña</span>
                  <span className="font-mono font-bold text-xs">#{campaign.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/10">
                  <span className="text-muted-foreground">Creada el</span>
                  <span className="font-medium">{new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/10">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-bold">{campaign.campaign_posts?.length || 0}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                   <h4 className="font-bold text-xs uppercase text-muted-foreground mb-2">Integraciones</h4>
                   <FacebookConnect 
                     className="w-full justify-start gap-2 h-9 text-xs border-dashed text-muted-foreground hover:text-primary hover:border-primary/40" 
                     variant="outline"
                   />
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

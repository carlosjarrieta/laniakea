"use client";

import { useState, useEffect } from "react";
import { integrationsApi } from "@/lib/integrations-api";
import { campaignPostsApi } from "@/lib/campaigns-api";
import { Button } from "@/components/ui/button";
import { Loader2, Facebook, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FacebookPageSelectorProps {
  postId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FacebookPageSelector({ postId, isOpen, onOpenChange, onSuccess }: FacebookPageSelectorProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      loadPages();
    }
  }, [isOpen]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await integrationsApi.getFacebookPages();
      setPages(data.pages);
      if (data.pages.length > 0) {
        setSelectedPageId(data.pages[0].id);
      }
    } catch (error) {
      console.error("Error loading Facebook pages:", error);
      toast.error("Error al cargar tus fanpages. Asegúrate de que Facebook esté conectado.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPageId) return;
    
    const selectedPage = pages.find(p => p.id === selectedPageId);
    if (!selectedPage) return;

    setPublishing(true);
    try {
      await campaignPostsApi.publish(postId, selectedPage.id, selectedPage.access_token);
      toast.success("Post publicado exitosamente en Facebook", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error publishing to Facebook:", error);
      toast.error(error.response?.data?.error || "Error al publicar en Facebook");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Facebook className="text-blue-600" size={20} />
            Publicar en Facebook
          </DialogTitle>
          <DialogDescription>
            Selecciona la FanPage donde quieres realizar la publicación.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pages.length > 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecciona una Página</label>
              <Select value={selectedPageId} onValueChange={setSelectedPageId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar página..." />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      <div className="flex items-center gap-2">
                        {page.picture?.data?.url && (
                          <img src={page.picture.data.url} className="h-5 w-5 rounded-full" alt="" />
                        )}
                        <span>{page.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No se encontraron FanPages administradas.</p>
              <p className="text-xs mt-1">Verifica tus permisos en la integración de Facebook.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={publishing}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={!selectedPageId || publishing || loading}
            className="bg-blue-600 hover:bg-blue-700 font-bold gap-2"
          >
            {publishing && <Loader2 size={14} className="animate-spin" />}
            {publishing ? "Publicando..." : "Publicar Ahora"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

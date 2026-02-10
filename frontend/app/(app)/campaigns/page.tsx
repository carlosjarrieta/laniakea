"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  LayoutGrid, 
  List as ListIcon,
  Search as SearchIcon,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Campaign, CampaignsResponse } from "@/lib/campaigns-api";
import { useCampaigns } from "@/hooks/use-campaigns";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CampaignCard } from "@/components/campaign-card";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<CampaignsResponse['pagination'] | null>(null);
  const { getAll, deleteItem, loading } = useCampaigns();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadCampaigns(currentPage);
  }, [currentPage]);

  const loadCampaigns = async (page: number = 1) => {
    try {
      const data = await getAll(page, 20);
      setCampaigns(data.campaigns);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading campaigns:", error);
      toast.error("Error al cargar las campañas");
    }
  };

  const deleteCampaign = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId);
      setCampaigns(campaigns.filter(c => c.id !== deleteId));
      toast.success("Campaña eliminada");
      setDeleteId(null);
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="text-primary" size={24} />
            {t("sidebar.campaigns")}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Gestiona tus estrategias de contenido y piezas publicitarias.
          </p>
        </div>
        <Button size="sm" className="bg-primary font-bold gap-2">
          <Plus size={16} />
          NUEVA ESTRATEGIA
        </Button>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Buscar campañas..." 
              className="pl-9 h-9 bg-background/50 border-border/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 border-border/40 gap-2">
              <Filter size={14} />
              Filtrar
            </Button>
            <Button variant="ghost" size="icon" onClick={() => loadCampaigns(currentPage)} className="h-9 w-9 rounded-lg">
               <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-muted/20 border border-border/20 rounded-xl" />
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-transparent py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Megaphone size={28} />
            </div>
            <div className="max-w-xs">
              <p className="text-base font-bold">No hay campañas aún</p>
              <p className="text-xs text-muted-foreground mt-1">Empieza forjando una nueva idea en el dashboard y aparecerá aquí.</p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-primary font-bold shadow-lg shadow-primary/20">Ir al Content Forge</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onDelete={(id) => setDeleteId(id)} 
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border/10">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Mostrando {campaigns.length} de {pagination.count} Estrategias
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[11px] font-bold gap-1 rounded-lg border-border/40"
                  disabled={!pagination.prev}
                  onClick={() => setCurrentPage(pagination.prev!)}
                >
                  <ChevronLeft size={14} /> Anterior
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <Button 
                      key={p}
                      variant={pagination.page === p ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 text-[11px] font-bold rounded-lg",
                        pagination.page === p ? "shadow-md shadow-primary/10" : "text-muted-foreground"
                      )}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[11px] font-bold gap-1 rounded-lg border-border/40"
                  disabled={!pagination.next}
                  onClick={() => setCurrentPage(pagination.next!)}
                >
                  Siguiente <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="¿Eliminar Campaña?"
        description="Esta acción eliminará permanentemente la campaña y todas sus piezas de contenido generadas. No se puede deshacer."
        confirmText="Eliminar Estrategia"
        cancelText="Mantener"
        variant="destructive"
        onConfirm={deleteCampaign}
      />
    </div>
  );
}

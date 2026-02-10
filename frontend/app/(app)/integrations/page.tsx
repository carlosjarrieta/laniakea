"use client";

import { useEffect, useState } from "react";
import { integrationsApi, ConnectedAccount } from "@/lib/integrations-api";
import { 
  Facebook, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [disconnectingId, setDisconnectingId] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const token = useAuthStore((state: any) => state.token);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await integrationsApi.getIntegrations();
      setIntegrations(data.integrations);
    } catch (error) {
      console.error("Failed to load integrations:", error);
      toast.error("Error al cargar las integraciones");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    if (provider === "facebook") {
      toast.loading("Redirigiendo a Facebook...", { duration: 2000 });
      const authUrl = integrationsApi.getFacebookAuthUrl(token || "");
      window.location.href = authUrl;
    }
  };

  const confirmDisconnect = (id: number) => {
    setDisconnectingId(id);
    setIsAlertOpen(true);
  };

  const handleDisconnect = async () => {
    if (!disconnectingId) return;

    try {
      await integrationsApi.disconnectIntegration(disconnectingId);
      setIntegrations(integrations.filter((i) => i.id !== disconnectingId));
      toast.success("Cuenta desconectada exitosamente", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Error al desconectar la cuenta");
    } finally {
      setIsAlertOpen(false);
      setDisconnectingId(null);
    }
  };

  const isFacebookConnected = integrations.some((i) => i.provider === "facebook");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Cargando ecosistema...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="px-2 py-0 border-primary/30 text-primary bg-primary/5 text-[10px] uppercase font-bold tracking-widest">
            Channel Management
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Ecosistema de Integraciones
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Centraliza tus canales de comunicación. Conecta tus cuentas para que la IA pueda orquestar tus publicaciones de manera omnicanal.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Facebook Integration Card */}
        <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-md group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Facebook size={120} />
          </div>
          
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Facebook className="w-8 h-8 text-[#1877F2]" fill="#1877F2" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Facebook</CardTitle>
                <CardDescription className="text-xs">FanPages & Community Management</CardDescription>
              </div>
            </div>
            {isFacebookConnected && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 px-2.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Connection
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            <div className="flex flex-col gap-4">
              {isFacebookConnected ? (
                <div className="space-y-4">
                  {integrations
                    .filter((i) => i.provider === "facebook")
                    .map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/50 group/item">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {account.image ? (
                              <img
                                src={account.image}
                                alt={account.name}
                                className="w-10 h-10 rounded-full border-2 border-background ring-2 ring-primary/10"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <Facebook className="w-5 h-5 opacity-20" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
                              <ShieldCheck size={12} className="text-blue-500" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{account.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                              Linked on {new Date(account.connected_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDisconnect(account.id)}
                          className="h-9 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 font-bold text-xs"
                        >
                          <Trash2 size={14} />
                          Disconnet Account
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl border border-dashed border-border/60 bg-muted/5">
                  <p className="text-sm font-medium text-muted-foreground mb-4">No hay cuentas de Facebook conectadas.</p>
                  <Button
                    onClick={() => handleConnect("facebook")}
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold gap-2 px-6 h-11 shadow-lg shadow-blue-500/20"
                  >
                    <ExternalLink size={16} />
                    Integrate Facebook Now
                  </Button>
                </div>
              )}
            </div>

            <Separator className="bg-border/40" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/20 border border-border/20">
                <Zap size={14} className="text-amber-500" />
                <span className="text-[11px] font-medium opacity-70">Auto-publishing enabled</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/20 border border-border/20">
                <Globe size={14} className="text-blue-500" />
                <span className="text-[11px] font-medium opacity-70">FanPage analytics</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/20 border border-border/20">
                <Layers size={14} className="text-violet-500" />
                <span className="text-[11px] font-medium opacity-70">Omnichannel support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future integrations */}
        <div className="group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-border/50 via-border to-border/50">
          <div className="relative rounded-[23px] bg-card/60 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-white/10">
            <div className="flex -space-x-3 mb-2 opacity-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-background flex items-center justify-center">
                <span className="text-[10px] font-bold">In</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-background flex items-center justify-center">
                <span className="text-[10px] font-bold">X</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-background flex items-center justify-center">
                <span className="text-[10px] font-bold">Ig</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Expansion Pack Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-1">LinkedIn, X (Twitter) & Instagram are being prepared for AI synthesis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-3xl border-border/40 backdrop-blur-xl bg-card/95">
          <AlertDialogHeader>
            <div className="mx-auto bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-destructive" size={24} />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold">¿Desvincular Cuenta?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              Al desconectar esta cuenta, la IA de Laniakea ya no podrá gestionar tus FanPages ni publicar contenido de manera automática. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl border-border/60 font-bold px-8">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDisconnect}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-8 shadow-lg shadow-destructive/20"
            >
              Sí, Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

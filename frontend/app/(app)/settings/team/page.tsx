"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, UserMinus, Mail, Shield, User, Loader2, Search, Trash2, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Membership {
  id: number;
  role: 'member' | 'admin' | 'owner';
  user: {
    id: number;
    email: string;
    name: string;
    profile_image_url?: string;
  };
}

interface Invitation {
  id: number;
  email: string;
  role: 'member' | 'admin';
  created_at: string;
}

export default function TeamSettingsPage() {
  const { locale } = useLanguage();
  const { t, isLoading: translationsLoading } = useTranslations(locale);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "member"
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get("/memberships");
      setMemberships(response.data.memberships);
      setInvitations(response.data.invitations);
    } catch (error) {
      toast.error(t('settings.team.messages.fetch_error') || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await api.post("/memberships/invite", { invitation: inviteData });
      toast.success(t('settings.team.messages.invite_success'));
      setInviteData({ email: "", role: "member" });
      fetchTeam();
    } catch (error: any) {
      const message = error.response?.data?.errors?.join(", ") || t('settings.team.messages.invite_error');
      toast.error(message);
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (id: number) => {
    if (!confirm(t('settings.team.messages.remove_confirm'))) return;
    try {
      await api.delete(`/memberships/${id}`);
      toast.success(t('settings.team.messages.remove_success'));
      fetchTeam();
    } catch (error) {
      toast.error(t('settings.team.messages.remove_error'));
    }
  };

  const cancelInvitation = async (id: number) => {
    try {
      await api.delete(`/memberships/${id}/cancel`);
      toast.success(t('settings.team.messages.cancel_success'));
      fetchTeam();
    } catch (error) {
      toast.error(t('settings.team.messages.cancel_error'));
    }
  };

  if (loading || translationsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {t('settings.team.title')}
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          {t('settings.team.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invite Form */}
        <div className="lg:col-span-4">
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b bg-muted/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <UserPlus size={16} className="text-primary" />
                {t('settings.team.invite.title')}
              </CardTitle>
              <CardDescription className="text-[11px]">
                {t('settings.team.invite.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">
                    {t('settings.team.invite.email_label')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                    <Input 
                      required
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                      className="h-9 pl-9 text-xs bg-muted/20 border-border rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">
                    {t('settings.team.invite.role_label')}
                  </label>
                  <Select value={inviteData.role} onValueChange={(val: any) => setInviteData({...inviteData, role: val})}>
                    <SelectTrigger className="h-9 text-xs bg-muted/20 border-border rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member" className="text-xs">{t('settings.team.roles.member')}</SelectItem>
                      <SelectItem value="admin" className="text-xs">{t('settings.team.roles.admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground px-0.5">
                    {t('settings.team.invite.role_desc')}
                  </p>
                </div>

                <Button 
                  disabled={inviting || !inviteData.email} 
                  className="w-full h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-sm transition-all"
                >
                  {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('settings.team.invite.button')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border shadow-sm bg-card rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">{t('settings.team.active_members.title')}</CardTitle>
                <CardDescription className="text-[11px]">{t('settings.team.active_members.desc')}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold h-5 px-2">
                {t('settings.team.active_members.users_count', { count: memberships.length })}
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {memberships.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border shadow-sm">
                        <AvatarImage src={m.user.profile_image_url} />
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                          {m.user.name ? m.user.name.substring(0, 2).toUpperCase() : m.user.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground leading-none">{m.user.name || m.user.email.split('@')[0]}</p>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter",
                              m.role === 'owner' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : 
                              m.role === 'admin' ? "bg-primary/10 text-primary border-primary/20" : 
                              "bg-muted text-muted-foreground border-border"
                            )}
                          >
                            {t(`settings.team.roles.${m.role}`)}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">{m.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {m.role !== 'owner' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeMember(m.id)}
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive rounded-lg"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-[10px] font-bold">{t('settings.team.tooltips.remove')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card className="border shadow-sm bg-card rounded-xl overflow-hidden border-dashed">
              <CardHeader className="p-5 border-b border-dashed">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                   <Clock className="text-primary size-4" />
                   {t('settings.team.pending_invitations.title')}
                </CardTitle>
                <CardDescription className="text-[11px]">
                  {t('settings.team.pending_invitations.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border divide-dashed">
                  {invitations.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          <Mail size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground leading-none">{inv.email}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter">
                              {t(`settings.team.roles.${inv.role}`)}
                            </Badge>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                               {t('settings.team.pending_invitations.sent_at', { date: new Date(inv.created_at).toLocaleDateString() })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => cancelInvitation(inv.id)}
                              className="text-[10px] h-7 font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            >
                              Cancel
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-[10px] font-bold">{t('settings.team.tooltips.cancel')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

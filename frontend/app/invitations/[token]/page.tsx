"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle2, XCircle, LogIn, UserPlus, Building } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

export default function InvitationPage() {
  const { token } = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { t, isLoading: translationsLoading } = useTranslations(locale);
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await api.get(`/invitations/${token}`);
      setInvitation(response.data);
    } catch (err) {
      setError(t('invitations.page.error_invalid') || "La invitación es inválida o ha expirado.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await api.post(`/invitations/${token}/accept`);
      toast.success(t('invitations.page.success') || "¡Bienvenido al equipo!");
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al aceptar la invitación.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading || translationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="max-w-md w-full border-red-500/20 bg-red-500/5 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl font-bold text-red-500">{t('invitations.page.error_title')}</CardTitle>
            <CardDescription className="text-red-400/70 font-medium italic">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => router.push("/")} className="font-bold border-red-500/20 hover:bg-red-500/10">
              {t('common.back_to_dashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -z-10" />

      <Card className="max-w-lg w-full border-none bg-white/5 backdrop-blur-2xl shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 md:p-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight text-white">
              {t('invitations.page.title')}
            </CardTitle>
            <CardDescription className="text-zinc-400 font-bold text-base leading-relaxed">
              {t('invitations.page.subtitle', { account: invitation.account_name, role: t(`settings.team.roles.${invitation.role}`) || invitation.role })}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 md:p-10 bg-white/[0.02] border-t border-white/5 space-y-8">
          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-white">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{t('invitations.page.logged_in_as')}</p>
                  <p className="text-sm font-bold text-white">{user?.email}</p>
                </div>
              </div>

              {user?.email === invitation.email ? (
                <Button 
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {accepting ? <Loader2 className="animate-spin h-6 w-6" /> : t('invitations.page.accept_button')}
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-amber-500 font-bold text-center px-4 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    {t('invitations.page.wrong_account', { email: invitation.email, current_email: user?.email })}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/login?email=${invitation.email}`)}
                    className="w-full h-12 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl"
                  >
                    {t('invitations.page.switch_account')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => router.push(`/login?token=${token}&email=${invitation.email}`)}
                className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl gap-2 shadow-lg shadow-primary/20"
              >
                <LogIn size={18} strokeWidth={2.5} />
                {t('invitations.page.login_button')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push(`/signup?token=${token}`)}
                className="h-14 border-white/10 hover:bg-white/5 text-white font-black rounded-2xl gap-2 backdrop-blur-sm"
              >
                <UserPlus size={18} strokeWidth={2.5} />
                {t('invitations.page.signup_button')}
              </Button>
            </div>
          )}

          <p className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            Laniakea Supercluster · Secured Collaboration
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

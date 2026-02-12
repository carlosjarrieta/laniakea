"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  MousePointer2,
  Heart,
  Activity,
  BarChart3
} from "lucide-react";
import { Plus, Rocket as RocketIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { statsApi, campaignPostsApi } from "@/lib/campaigns-api";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "../../../hooks/use-translations";
import { KpiCard } from "@/components/kpi-card";
import { AdAdvisorCard } from "@/components/ad-advisor-card";
import { toast } from "sonner";
import { AIContentForge } from "@/components/ai-content-forge";
import { Users, TrendingUp } from "lucide-react";



export default function DashboardPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingIds, setRefreshingIds] = useState<number[]>([]);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);
 
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await statsApi.getDashboard();
      setStats(data);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleRefreshPost = async (postId: number) => {
    setRefreshingIds(prev => [...prev, postId]);
    try {
      const result = await campaignPostsApi.refreshMetrics(postId);
      toast.success(result.message);
      // Actualizar stats locales
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al actualizar métricas");
    } finally {
      setRefreshingIds(prev => prev.filter(id => id !== postId));
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin') {
      setIsLoading(true);
      api.get('/superadmin/accounts')
        .then(res => setAccounts(res.data))
        .finally(() => setIsLoading(false));
    } else {
      fetchStats();
    }
  }, [user]);

  if (user?.role === 'superadmin') {
    return (
      <div className="space-y-6 min-h-screen bg-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('superadmin.dashboard.title')}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">{t('superadmin.dashboard.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
            <CardContent className="p-4 md:p-6">
              <span className="text-sm font-medium text-muted-foreground">{t('superadmin.dashboard.total_accounts')}</span>
              <div className="text-3xl font-bold mt-2">{accounts.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
            <CardContent className="p-4 md:p-6">
              <span className="text-sm font-medium text-muted-foreground">{t('superadmin.dashboard.active_accounts')}</span>
              <div className="text-3xl font-bold mt-2">{accounts.filter(a => a.status === 'active').length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
            <CardContent className="p-4 md:p-6">
              <span className="text-sm font-medium text-muted-foreground">{t('superadmin.dashboard.trial_accounts')}</span>
              <div className="text-3xl font-bold mt-2">{accounts.filter(a => a.status === 'trialing').length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('superadmin.dashboard.registered_accounts')}</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="font-semibold">{t('superadmin.dashboard.table.name')}</TableHead>
                    <TableHead className="font-semibold">{t('superadmin.dashboard.table.plan')}</TableHead>
                    <TableHead className="font-semibold">{t('superadmin.dashboard.table.status')}</TableHead>
                    <TableHead className="font-semibold">{t('superadmin.dashboard.table.owner')}</TableHead>
                    <TableHead className="font-semibold text-right">{t('superadmin.dashboard.table.created')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">{t('superadmin.dashboard.table.loading')}</TableCell>
                    </TableRow>
                  ) : accounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">{t('superadmin.dashboard.table.no_accounts')}</TableCell>
                    </TableRow>
                  ) : (
                    accounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-muted/30 border-border/20 transition-colors">
                        <TableCell className="font-medium py-3">{account.name}</TableCell>
                        <TableCell className="py-3 text-muted-foreground">
                          <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[11px] font-bold border border-primary/10">
                            {account.plan?.name || t('common.none')}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                            account.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            account.status === 'trialing' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                            "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
                          )}>
                            {account.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">{account.owner?.name}</span>
                            <span className="text-[10px] text-muted-foreground">{account.owner?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-right text-muted-foreground text-xs">
                          {new Date(account.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-transparent pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('dashboard.welcome')}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold gap-2 border-border/60">
            <BarChart3 className="h-4 w-4" />
            {t('dashboard.view_roi_reports')}
          </Button>
          {user?.has_active_plan && (
            <Link href="/campaigns/new">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-xs font-semibold gap-2 shadow-sm shrink-0">
                <RocketIcon size={14} strokeWidth={2.5} />
                {t('dashboard.new_campaign')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* AI Content Forge - TOP PRIORITY FEATURE */}
      <AIContentForge />

      {/* KPI Section - Real Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title={t('dashboard.metrics.impressions')} 
          value={stats?.kpis?.reach?.value || "0"} 
          trend={stats?.kpis?.reach?.trend} 
          trendUp={stats?.kpis?.reach?.trend_up} 
          description={t('dashboard.kpi_descriptions.reach')}
          subDescription={t('dashboard.kpi_descriptions.reach_sub', { freq: "2.4" })}
          icon={TrendingUp}
        />
        <KpiCard 
          title="Clicks" 
          value={stats?.kpis?.clicks?.value || "0"} 
          trend={stats?.kpis?.clicks?.trend} 
          trendUp={stats?.kpis?.clicks?.trend_up} 
          description="Total Clics"
          subDescription="Interés generado"
          icon={MousePointer2}
        />
        <KpiCard 
          title="Reacciones" 
          value={stats?.kpis?.reactions?.value || "0"} 
          trend={stats?.kpis?.reactions?.trend} 
          trendUp={stats?.kpis?.reactions?.trend_up} 
          description="Total Reacciones"
          subDescription="Engagement social"
          icon={Heart}
        />
        <KpiCard 
          title="Engagement Rate" 
          value={stats?.kpis?.engagement_rate?.value || "0%"} 
          trend={stats?.kpis?.engagement_rate?.trend} 
          trendUp={stats?.kpis?.engagement_rate?.trend_up} 
          description="Tasa de interacción"
          subDescription="Calidad del contenido"
          icon={Activity}
        />
      </div>

      {/* Smart Ads Advisor Section - THE DIFFERENTIATOR */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <RocketIcon size={14} />
              </span>
              {t('dashboard.ad_advisor.title')}
            </h3>
            <p className="text-xs text-muted-foreground">{t('dashboard.ad_advisor.subtitle')}</p>
          </div>
          <Button variant="link" className="text-primary text-xs font-bold p-0 h-auto">
            Ver todas las oportunidades
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.top_posts && stats.top_posts.length > 0 ? (
            stats.top_posts.map((post: any) => (
              <AdAdvisorCard 
                key={post.id}
                postTitle={post.content?.substring(0, 30) + "..."}
                platform={post.platform}
                engagementRate={post.metrics?.clicks ? `${Math.round((post.metrics.clicks / (post.metrics.impressions || 1)) * 100)}%` : "0%"}
                projectedRoi="--"
                estimatedReach={post.metrics?.impressions || "0"}
                image={post.real_image_url || post.image_url}
                metrics={post.metrics}
                onRefresh={() => handleRefreshPost(post.id)}
                isRefreshing={refreshingIds.includes(post.id)}
              />
            ))
          ) : (
            <>
              <AdAdvisorCard 
                postTitle="Lanzamiento Colección Verano"
                platform="instagram"
                engagementRate="45%"
                projectedRoi="3.8x"
                estimatedReach="15k - 25k"
              />
              <AdAdvisorCard 
                postTitle="Tips de productividad con IA"
                platform="linkedin"
                engagementRate="22%"
                projectedRoi="5.2x"
                estimatedReach="5k - 8k"
              />
              <AdAdvisorCard 
                postTitle="Review: Nueva plataforma Laniakea"
                platform="tiktok"
                engagementRate="68%"
                projectedRoi="2.5x"
                estimatedReach="50k - 80k"
              />
              <AdAdvisorCard 
                postTitle="Promoción Webinar de Ventas"
                platform="facebook"
                engagementRate="12%"
                projectedRoi="4.1x"
                estimatedReach="10k - 18k"
              />
            </>
          )}
        </div>
      </div>

      {/* Grid: 2 columns (Chart 70% | List 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.metrics.performance_chart')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.metrics.total_3_months')}</p>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.charts?.performance || []}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a1a1aa', fontSize: 10}}
                    dy={10}
                    interval={stats?.charts?.performance ? 1 : 2} 
                  />
                  <Tooltip 
                    cursor={{fill: 'var(--primary)', opacity: 0.1}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]}
                    barSize={6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight px-1">{t('dashboard.audience_analysis')}</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Area Chart */}
         {/* Area Chart - Reach */}
         <Card className="lg:col-span-2 shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6">
             <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.metrics.reach_chart')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.metrics.total_reach')}</p>
             </div>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 {/* Reutilizamos el performance data por ahora ya que no tenemos histórico de 6 meses */}
                 <AreaChart data={stats?.charts?.performance || []}>
                   <defs>
                     <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a1a1aa', fontSize: 10}}
                    dy={10}
                   />
                   <Tooltip />
                   <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--primary)" 
                    fillOpacity={1} 
                    fill="url(#colorVis)" 
                    strokeWidth={2}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                   <span>{t('dashboard.metrics.increasing', { percent: stats?.kpis?.engagement_rate?.value || "0%" })}</span>
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
                <div>{new Date().toLocaleDateString()}</div>
             </div>
          </CardContent>
         </Card>

         {/* Pie Chart (Donut) */}
         {/* Pie Chart (Donut) */}
         <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6 h-full flex flex-col">
             <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.metrics.distribution')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.metrics.total_reach')}</p>
             </div>
             
             <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold tracking-tighter">{stats?.kpis?.reach?.value || "0"}</span>
                   <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('dashboard.metrics.impressions')}</span>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.charts?.distribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {(stats?.charts?.distribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="mt-auto pt-4 text-center border-t border-border/10">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                   <span>Facebook</span>
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
             </div>
          </CardContent>
         </Card>
      </div>
    </div>
  );
}

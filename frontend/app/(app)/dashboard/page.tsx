"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight
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
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "../../../hooks/use-translations";
import { KpiCard } from "@/components/kpi-card";
import { AdAdvisorCard } from "@/components/ad-advisor-card";
import { AIContentForge } from "@/components/ai-content-forge";
import { Users, TrendingUp } from "lucide-react";

const performanceData = [
  { name: "Lun", value: 24828 },
  { name: "Mar", value: 45000 },
  { name: "Mie", value: 12000 },
  { name: "Jue", value: 65000 },
  { name: "Vie", value: 18000 },
  { name: "Sab", value: 48000 },
  { name: "Dom", value: 25010 },
  { name: "Lun 2", value: 34000 },
  { name: "Mar 2", value: 52000 },
  { name: "Mie 2", value: 28000 },
  { name: "Jue 2", value: 41000 },
  { name: "Vie 2", value: 62000 },
  { name: "Sab 2", value: 39000 },
  { name: "Dom 2", value: 51000 },
];

const areaData = [
  { name: "Jan", visitors: 4000 },
  { name: "Feb", visitors: 3000 },
  { name: "Mar", visitors: 5000 },
  { name: "Apr", visitors: 2780 },
  { name: "May", visitors: 1890 },
  { name: "Jun", visitors: 2390 },
  { name: "Jul", visitors: 3490 },
];

const pieData = [
  { name: "Chrome", value: 1125, color: "var(--primary)" },
  { name: "Safari", value: 300, color: "var(--primary)" }, // Should be lighter/different shade in real implementation
  { name: "Firefox", value: 200, color: "var(--primary)" },
];

const recentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", avatar: "OM" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", avatar: "JL" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", avatar: "IN" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", avatar: "WK" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", avatar: "SD" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  useEffect(() => {
    if (user?.role === 'superadmin') {
      setIsLoading(true);
      api.get('/superadmin/accounts')
        .then(res => setAccounts(res.data))
        .finally(() => setIsLoading(false));
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
            <BarChart className="h-4 w-4" />
            {t('dashboard.view_roi_reports')}
          </Button>
          {user?.has_active_plan && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 text-xs font-semibold gap-2 shadow-sm shrink-0">
              <RocketIcon size={14} strokeWidth={2.5} />
              {t('dashboard.new_campaign')}
            </Button>
          )}
        </div>
      </div>

      {/* AI Content Forge - TOP PRIORITY FEATURE */}
      <AIContentForge />

      {/* KPI Section - Real Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title={t('dashboard.kpis.total_revenue')} 
          value="$12,450.00" 
          trend="+18.2%" 
          trendUp={true} 
          description={t('dashboard.kpi_descriptions.revenue')}
          subDescription={t('dashboard.kpi_descriptions.revenue_sub')}
          icon={RocketIcon}
        />
        <KpiCard 
          title={t('dashboard.kpis.new_customers')} 
          value="842" 
          trend="+5.4%" 
          trendUp={true} 
          description={t('dashboard.kpi_descriptions.customers')}
          subDescription={t('dashboard.kpi_descriptions.customers_sub', { cpa: "$14.50" })}
          icon={Users}
        />
        <KpiCard 
          title={t('dashboard.kpis.active_accounts')} 
          value="1.2M" 
          trend="-2.1%" 
          trendUp={false} 
          description={t('dashboard.kpi_descriptions.reach')}
          subDescription={t('dashboard.kpi_descriptions.reach_sub', { freq: "2.4" })}
          icon={TrendingUp}
        />
        <KpiCard 
          title={t('dashboard.kpis.growth_rate')} 
          value="4.2x" 
          trend="+0.8x" 
          trendUp={true} 
          description={t('dashboard.kpi_descriptions.growth')}
          subDescription={t('dashboard.kpi_descriptions.growth_sub', { target: "5.0x" })}
          icon={ArrowUpRight}
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
              <div className="flex bg-muted/30 rounded-lg p-1 border border-border/40">
                <div className="bg-background shadow-sm rounded-md px-4 py-2 text-right border border-border/20">
                  <span className="text-[10px] text-muted-foreground/70 block uppercase tracking-wider">{t('dashboard.metrics.organic')}</span>
                  <span className="text-lg font-bold">24,828</span>
                </div>
                <div className="px-4 py-2 text-right opacity-50">
                   <span className="text-[10px] text-muted-foreground/70 block uppercase tracking-wider">{t('dashboard.metrics.paid_ads')}</span>
                   <span className="text-lg font-bold">58,010</span>
                </div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a1a1aa', fontSize: 10}}
                    dy={10}
                    interval={2} 
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

        {/* Recent Conversions - Focus on Money, not just sales */}
        <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.recent_conversions')}</h3>
            <p className="text-xs text-muted-foreground mb-6">{t('dashboard.direct_attributions', { count: 24 })}</p>
            <div className="space-y-6">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${sale.name}`} />
                      <AvatarFallback>{sale.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Vía {i % 2 === 0 ? 'Facebook Ads' : 'Instagram Organic'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{sale.amount}</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase">ROI: 4.2x</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 h-8 text-xs border-dashed border-border/60 hover:bg-muted/50">
              {t('dashboard.view_full_history')}
            </Button>
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
         <Card className="lg:col-span-2 shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6">
             <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.metrics.reach_chart')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.metrics.visitors_6_months')}</p>
             </div>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={areaData}>
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
                    dataKey="visitors" 
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
                   <span>{t('dashboard.metrics.increasing', { percent: "5.2%" })}</span>
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
                <div>Enero - Junio 2024</div>
             </div>
          </CardContent>
         </Card>

         {/* Pie Chart (Donut) */}
         <Card className="shadow-sm border-border/40 rounded-xl bg-card/50">
          <CardContent className="p-4 md:p-6 h-full flex flex-col">
             <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('dashboard.metrics.distribution')}</h3>
                <p className="text-xs text-muted-foreground">{t('dashboard.metrics.visitors_distribution')}</p>
             </div>
             
             <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold tracking-tighter">1.2M</span>
                   <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{t('dashboard.metrics.impressions')}</span>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} style={{ opacity: 1 - (index * 0.2) }} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="mt-auto pt-4 text-center border-t border-border/10">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                   {t('dashboard.metrics.social_leader', { platform: "Instagram", percent: "64.4%" })}
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
             </div>
          </CardContent>
         </Card>
      </div>
    </div>
  );
}

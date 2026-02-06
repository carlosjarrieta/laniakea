"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
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
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-transparent">
      
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight">Hola, bienvenido de nuevo 👋</h2>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Ingresos totales", value: "$1,250.00", trend: "+12.5%", trendUp: true, desc: "En alza este mes", sub: "Variantes de los últimos 6 meses" },
          { title: "Nuevos Clientes", value: "1,234", trend: "-2.0%", trendUp: false, desc: "Disminuyó 2.0% en este periodo", sub: "La adquisición necesita atención" },
          { title: "Cuentas activas", value: "45,678", trend: "+12.5%", trendUp: true, desc: "Fuerte retención de usuarios", sub: "El compromiso supera los objetivos" },
          { title: "Tasa de crecimiento", value: "4.5%", trend: "+4.5%", trendUp: true, desc: "Incremento de desempeño constante", sub: "Cumple con las proyecciones de crecimiento" }
        ].map((kpi, i) => (
          <Card key={i} className="shadow-sm border-zinc-200 dark:border-zinc-800 rounded-xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-500">{kpi.title}</span>
                <span className={cn("text-xs font-bold flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full", kpi.trendUp ? "text-emerald-600" : "text-rose-600")}>
                  {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.trend}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{kpi.value}</div>
              <p className="text-sm font-medium mt-4 flex items-center gap-1">
                 {kpi.desc} {kpi.trendUp ? <ArrowUpRight size={14} className="text-zinc-400" /> : <ArrowDownRight size={14} className="text-zinc-400" />}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid: 2 columns (Chart 70% | List 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 rounded-xl bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Gráfica de barras - Interactiva</h3>
                <p className="text-xs text-zinc-500">Total de los últimos 3 meses</p>
              </div>
              <div className="flex bg-zinc-50 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-100 dark:border-zinc-800">
                <div className="bg-white dark:bg-zinc-800 shadow-sm rounded-md px-4 py-2 text-right border border-zinc-100 dark:border-zinc-700">
                  <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">Escritorio</span>
                  <span className="text-lg font-bold">24,828</span>
                </div>
                <div className="px-4 py-2 text-right opacity-50">
                   <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">Móvil</span>
                   <span className="text-lg font-bold">25,010</span>
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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

        {/* Recent Sales List */}
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 rounded-xl bg-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Ventas recientes</h3>
            <p className="text-xs text-zinc-500 mb-6">Realizaste 265 ventas este mes</p>
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
                      <p className="text-xs text-zinc-500 mt-1">{sale.email}</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Area Chart */}
         <Card className="lg:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 rounded-xl bg-card">
          <CardContent className="p-6">
             <div className="mb-6">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Gráfica de áreas - apilada</h3>
                <p className="text-xs text-zinc-500">Muestra visitantes totales de los últimos 6 meses</p>
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
             <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                   <span>En aumento 5.2% este mes</span>
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
                <div>Enero - Junio 2024</div>
             </div>
          </CardContent>
         </Card>

         {/* Pie Chart (Donut) */}
         <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 rounded-xl bg-card">
          <CardContent className="p-6 h-full flex flex-col">
             <div className="mb-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Gráfica de pastel - dona con texto</h3>
                <p className="text-xs text-zinc-500">Visitantes totales por navegador de los últimos 6 meses</p>
             </div>
             
             <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-bold tracking-tighter">1,125</span>
                   <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Visitantes</span>
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

             <div className="mt-auto pt-4 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-zinc-500 mb-1">
                   Chrome lidera con <span className="font-bold text-zinc-900 dark:text-zinc-100">24.4%</span>
                   <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
                <div className="text-[10px] text-zinc-400">
                   Basado en datos de enero a junio de 2024
                </div>
             </div>
          </CardContent>
         </Card>
      </div>
    </div>
  );
}

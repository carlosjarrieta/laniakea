"use client";

import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Bell,
  MoreVertical,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const performanceData = [
  { name: "Jun 23", visitors: 4000 },
  { name: "Jun 24", visitors: 3000 },
  { name: "Jun 25", visitors: 5000 },
  { name: "Jun 26", visitors: 2780 },
  { name: "Jun 27", visitors: 1890 },
  { name: "Jun 28", visitors: 2390 },
  { name: "Jun 29", visitors: 3490 },
];

const campaigns = [
  { id: 1, name: "Summer Launch", type: "Instagram Ad", status: "Active", target: "18-24", spend: "$1,200", performance: "High" },
  { id: 2, name: "Flash Sale", type: "Facebook Story", status: "In Progress", target: "All", spend: "$450", performance: "Medium" },
  { id: 3, name: "Brand Awareness", type: "LinkedIn Post", status: "Done", target: "Tech Leads", spend: "$3,000", performance: "Very High" },
  { id: 4, name: "Newsletter Promo", type: "Email", status: "Active", target: "Subscribers", spend: "$150", performance: "Low" },
];

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 bg-white dark:bg-zinc-950 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Buscar campañas, clientes o analíticas..." 
                className="pl-9 bg-zinc-50 dark:bg-zinc-900 border-none h-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className="text-zinc-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
            </Button>
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Plus size={18} />
              Crear Campaña
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
              <p className="text-zinc-500 mt-1">Monitorea el rendimiento de tus campañas globales.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Descargar Reporte</Button>
              <Button size="sm">Gestionar Vistas</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Revenue Total</CardTitle>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-md">
                   <ArrowUpRight size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450.00</div>
                <p className="text-xs text-emerald-600 mt-1">+12.5% del mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Nuevos Clientes</CardTitle>
                <div className="bg-rose-100 dark:bg-rose-900/30 p-1 rounded-md">
                   <ArrowDownRight size={14} className="text-rose-600 dark:text-rose-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-rose-600 mt-1">-4% del periodo anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">Conversiones</CardTitle>
                <div className="bg-violet-100 dark:bg-violet-900/30 p-1 rounded-md">
                   <ArrowUpRight size={14} className="text-violet-600 dark:text-violet-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,678</div>
                <p className="text-xs text-violet-600 mt-1">+18% tasa de retención</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">CPC Promedio</CardTitle>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-md">
                   <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.45</div>
                <p className="text-xs text-zinc-500 mt-1">Meta proyectada de $0.40</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rendimiento Global</CardTitle>
                <CardDescription>Visitas totales registradas en los últimos 3 meses.</CardDescription>
              </div>
              <Tabs defaultValue="90d" className="w-[300px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="90d">90 Días</TabsTrigger>
                  <TabsTrigger value="30d">30 Días</TabsTrigger>
                  <TabsTrigger value="7d">7 Días</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVisitors)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Table Section */}
          <div className="space-y-4">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">Todas las Campañas</TabsTrigger>
                  <TabsTrigger value="active">Activas</TabsTrigger>
                  <TabsTrigger value="drafts">Borradores</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm">Filtrar Columnas</Button>
                   <Button variant="outline" size="sm">Exportar CSV</Button>
                </div>
              </div>

              <TabsContent value="all" className="border rounded-xl mt-4 bg-white dark:bg-zinc-950">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Campaña</TableHead>
                      <TableHead>Tipo de Anuncio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Inversión</TableHead>
                      <TableHead>Desempeño</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="group cursor-pointer">
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell className="text-zinc-500">{campaign.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={campaign.status === "Active" ? "default" : "secondary"}
                            className={campaign.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                          >
                            {campaign.status === "Active" ? (
                              <CheckCircle2 size={12} className="mr-1" />
                            ) : (
                              <Clock size={12} className="mr-1" />
                            )}
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-500">{campaign.target}</TableCell>
                        <TableCell className="font-semibold">{campaign.spend}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              campaign.performance === "High" || campaign.performance === "Very High" ? "bg-emerald-500" : "bg-zinc-300"
                            )} />
                            {campaign.performance}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreVertical size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

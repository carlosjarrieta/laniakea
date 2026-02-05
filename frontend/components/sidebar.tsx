"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  Briefcase, 
  Layers,
  FileText,
  HelpCircle,
  LogOut,
  Command
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Campañas", icon: Briefcase, href: "/campaigns" },
  { label: "Analíticas", icon: BarChart3, href: "/analytics" },
  { label: "Creativos", icon: Layers, href: "/creatives" },
  { label: "Clientes", icon: Users, href: "/clients" },
  { label: "Documentos", icon: FileText, href: "/documents" },
];

const secondaryItems = [
  { label: "Configuración", icon: Settings, href: "/settings" },
  { label: "Ayuda", icon: HelpCircle, href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen border-r bg-zinc-50/50 dark:bg-zinc-900/50 w-64 pt-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="bg-violet-600 p-1.5 rounded-lg text-white">
          <Command size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight">Laniakea</span>
      </div>

      <div className="flex-1 px-4 space-y-8">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-4">
            Menú Principal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-4">
            Soporte
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Truck, 
  CreditCard,
  Archive,
  ArrowRightLeft,
  ShoppingBag,
  Store,
  Tag,
  Settings,
  Shield,
  Building2,
  LogOut,
  Command,
  User,
  Box,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname();
  const { handleLogout, user } = useAuth();
  const { collapsed } = useSidebar();

  const menuGroups = [
    {
      label: "Principal",
      items: [
        { label: "Panel", icon: LayoutDashboard, href: "/dashboard" },
      ]
    },
    {
      label: "Operación",
      items: [
        { label: "Ventas", icon: ShoppingCart, href: "/sales" },
        { label: "Asistencia", icon: Users, href: "/attendance" },
        { label: "Despachos", icon: Truck, href: "/dispatches" },
        { label: "Pagos", icon: CreditCard, href: "/payments" },
      ]
    },
    {
      label: "Inventario",
      items: [
        { label: "Stock", icon: Box, href: "/stock" },
        { label: "Almacenes", icon: Archive, href: "/warehouses" },
        { label: "Transferencias", icon: ArrowRightLeft, href: "/transfers" },
        { label: "Compras", icon: ShoppingBag, href: "/purchases" },
        { label: "Clientes", icon: Users, href: "/clients" },
        { label: "Proveedores", icon: Truck, href: "/suppliers" },
      ]
    },
    {
      label: "Catálogo",
      items: [
        { label: "Productos", icon: Tag, href: "/products" },
        { label: "Categorías", icon: Box, href: "/categories" },
      ]
    },
    {
      label: "Administración",
      items: [
        { label: "Cajas", icon: Wallet, href: "/registers" },
        { label: "Propiedades", icon: Store, href: "/properties" },
        { label: "Roles y permisos", icon: Shield, href: "/roles" },
        { label: "Empresa", icon: Building2, href: "/company" },
      ]
    }
  ];

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen border-r bg-white dark:bg-zinc-950/50 transition-all duration-300 ease-in-out sticky top-0 left-0 z-30",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className={cn(
        "h-16 flex items-center px-4 mb-2",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="bg-primary p-2 rounded-lg text-primary-foreground shrink-0">
          <Command size={18} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none">KARI</span>
            <span className="text-[10px] text-zinc-500 font-medium">Kali sucursal</span>
          </div>
        )}
      </div>

      <div className="flex-1 px-3 space-y-6 pt-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuGroups.map((group, index) => (
          <div key={index}>
            {!collapsed && (
              <p className="text-[11px] font-medium text-zinc-500 px-3 mb-2">
                {group.label}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group",
                    pathname.startsWith(item.href)
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                  )}
                >
                  <item.icon size={18} className={cn("shrink-0", pathname.startsWith(item.href) ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 group-hover:text-zinc-700")} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 border-t mt-auto">
        <div className={cn("flex items-center gap-3 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50", collapsed && "justify-center border-none bg-transparent p-0")}>
           <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
              <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'admin'}`} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">Admin User</p>
                 <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@admin.com'}</p>
              </div>
            )}

            {!collapsed && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            )}
        </div>
      </div>
    </aside>
  );
}

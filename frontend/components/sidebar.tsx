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
  User,
  Box,
  Wallet,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { 
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/components/providers/language-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { handleLogout, user } = useAuth();
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { locale } = useLanguage();

  const { t } = useTranslations(locale);

  const menuGroups = [
    {
      label: t('sidebar.main_menu'),
      items: [
        { label: t('sidebar.dashboard'), icon: LayoutDashboard, href: "/dashboard" },
      ]
    },
    {
      label: t('sidebar.operation'),
      items: [
        { label: t('sidebar.sales'), icon: ShoppingCart, href: "/sales" },
        { label: t('sidebar.attendance'), icon: Users, href: "/attendance" },
        { label: t('sidebar.dispatches'), icon: Truck, href: "/dispatches" },
        { label: t('sidebar.payments'), icon: CreditCard, href: "/payments" },
      ]
    },
    {
      label: t('sidebar.inventory'),
      items: [
        { label: t('sidebar.stock'), icon: Box, href: "/stock" },
        { label: t('sidebar.warehouses'), icon: Archive, href: "/warehouses" },
        { label: t('sidebar.transfers'), icon: ArrowRightLeft, href: "/transfers" },
        { label: t('sidebar.purchases'), icon: ShoppingBag, href: "/purchases" },
        { label: t('sidebar.clients'), icon: Users, href: "/clients" },
        { label: t('sidebar.suppliers'), icon: Truck, href: "/suppliers" },
      ]
    },
    {
      label: t('sidebar.catalog'),
      items: [
        { label: t('sidebar.products'), icon: Tag, href: "/products" },
        { label: t('sidebar.categories'), icon: Box, href: "/categories" },
      ]
    },
    {
      label: t('sidebar.administration'),
      items: [
        { label: t('sidebar.registers'), icon: Wallet, href: "/registers" },
        { label: t('sidebar.properties'), icon: Store, href: "/properties" },
        { label: t('sidebar.roles'), icon: Shield, href: "/roles" },
        { label: t('sidebar.company'), icon: Building2, href: "/company" },
      ]
    }
  ];

  // Close mobile sidebar when route changes
  const handleLinkClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          // Base styles
          "flex flex-col h-screen border-r bg-white dark:bg-zinc-950/50 transition-all duration-300 ease-in-out z-50",
          // Mobile: hidden by default, shown as fixed overlay when mobileOpen
          "fixed md:sticky top-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop: normal sidebar behavior
          collapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className={cn(
          "h-14 flex items-center px-4 mb-2 border-b dark:border-zinc-800/50",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-md shrink-0">
            <Rocket className="w-5 h-5" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col justify-center">
              <span className="text-base font-bold tracking-tight text-violet-700 dark:text-violet-400 leading-none">LANIAKEA</span>
              <span className="text-[8px] text-muted-foreground font-medium tracking-widest uppercase leading-tight mt-0.5">Social Media Manager</span>
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
                  onClick={handleLinkClick}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex w-full items-center gap-3 p-1.5 rounded-lg transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900/50 focus:outline-none",
              collapsed && "justify-center"
            )}>
               <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800 shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'admin'}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                     <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100 leading-tight">
                       {user?.name || 'Administrador'}
                     </p>
                     <p className="text-[10px] text-zinc-500 truncate leading-tight">{user?.email || 'user@admin.com'}</p>
                  </div>
                )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={collapsed ? "center" : "end"} side={collapsed ? "right" : "top"} className="w-56 mb-2">
            <DropdownMenuLabel>
              Mi Cuenta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="flex items-center w-full">
                <User size={16} className="mr-2" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/security" className="flex items-center w-full">
                <Shield size={16} className="mr-2" />
                <span>Seguridad</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing" className="flex items-center w-full">
                <CreditCard size={16} className="mr-2" />
                <span>Facturación</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-700 focus:bg-red-50" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span className="font-bold">Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
    </>
  );
}

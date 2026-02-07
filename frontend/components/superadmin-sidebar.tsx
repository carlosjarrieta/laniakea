"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Building2,
  Settings,
  Shield,
  LogOut,
  User,
  Rocket,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useTranslations } from "@/hooks/use-translations";

export function SuperadminSidebar() {
  const pathname = usePathname();
  const { handleLogout, user } = useAuth();
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { locale } = useLanguage();
  const { t } = useTranslations(locale);

  const menuGroups = [
    {
      label: t('superadmin.sidebar.global_management'),
      items: [
        { label: t('sidebar.dashboard'), icon: LayoutDashboard, href: "/dashboard" },
        { label: t('superadmin.sidebar.accounts'), icon: Building2, href: "/superadmin/accounts" },
        { label: t('superadmin.sidebar.plans'), icon: Package, href: "/superadmin/plans" },
        { label: t('superadmin.sidebar.payments'), icon: CreditCard, href: "/superadmin/payments" },
      ]
    },
    {
      label: t('superadmin.sidebar.system'),
      items: [
        { label: t('superadmin.sidebar.settings'), icon: Settings, href: "/superadmin/settings" },
      ]
    }
  ];

  const handleLinkClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "flex flex-col h-screen border-r bg-zinc-950 text-zinc-400 transition-all duration-300 ease-in-out z-50",
          "fixed md:sticky top-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className={cn(
          "h-14 flex items-center px-4 mb-2 border-b border-zinc-800/50",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-md shrink-0">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col justify-center">
              <span className="text-base font-bold tracking-tight text-white leading-none">LANIAKEA</span>
              <span className="text-[8px] text-violet-500 font-bold tracking-widest uppercase leading-tight mt-0.5">{t('superadmin.sidebar.panel_desc')}</span>
            </div>
          )}
        </div>

        <div className="flex-1 px-3 space-y-6 pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {menuGroups.map((group, index) => (
            <div key={index}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-zinc-500 px-3 mb-2 uppercase tracking-widest">
                  {group.label}
                </p>
              )}
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors group",
                          pathname === item.href
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                            : "hover:bg-zinc-900/50 hover:text-white text-zinc-400"
                        )}
                      >
                        <item.icon size={16} className="shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-semibold">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex w-full items-center gap-3 p-1.5 rounded-lg transition-all hover:bg-zinc-900/50 focus:outline-none",
                collapsed && "justify-center"
              )}>
                 <Avatar className="h-8 w-8 border border-zinc-800 shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'admin'}`} />
                    <AvatarFallback className="bg-violet-500/10 text-violet-500 font-bold text-xs">
                      {user?.email?.substring(0, 2).toUpperCase() || 'SA'}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 min-w-0 text-left">
                       <p className="text-sm font-semibold truncate text-white">
                         {user?.name || 'Super Admin'}
                       </p>
                       <p className="text-[10px] text-violet-500 font-bold uppercase tracking-tighter uppercase">{t('superadmin.sidebar.panel_desc')}</p>
                    </div>
                  )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? "center" : "end"} side={collapsed ? "right" : "top"} className="w-56 mb-2">
              <DropdownMenuLabel>
                {t('sidebar.main_menu')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="flex items-center w-full">
                  <User size={16} className="mr-2" />
                  <span>{t('settings.menu.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500 focus:bg-red-500/5" 
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                <span className="font-bold">{t('sidebar.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}

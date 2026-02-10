"use client";

import { Sidebar } from "@/components/sidebar";
import { SuperadminSidebar } from "@/components/superadmin-sidebar";
import { Search, Bell, Plus, PanelLeft, Rocket, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, useSidebar } from "@/components/providers/sidebar-provider";
import { ThemeColorProvider } from "@/components/providers/theme-color-provider";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const isSuperadmin = user?.role === 'superadmin';
    if (isSuperadmin) return;

    // Protection logic
    if (!user?.has_account && pathname !== "/onboarding/account") {
      router.push("/onboarding/account");
    } else if (user?.has_account && !user?.has_active_plan && pathname !== "/plans") {
      // If we are in onboarding, don't redirect to plans yet if we haven't finished account creation
      // but here has_account is already true, so we should be on /plans
      router.push("/plans");
    }
  }, [isAuthenticated, user, pathname, router]);

  const isSuperadmin = user?.role === 'superadmin';

  // Toggle sidebar - mobile opens overlay, desktop collapses
  const handleSidebarToggle = () => {
    // Check if we're on mobile (less than md breakpoint = 768px)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex w-full h-screen bg-white dark:bg-black overflow-hidden md:px-4 lg:px-8">
        <div className="flex w-full max-w-[1600px] mx-auto bg-zinc-50/50 dark:bg-zinc-950/50 shadow-2xl shadow-black/5 border-x border-border/60 overflow-hidden">
          {isSuperadmin ? <SuperadminSidebar /> : <Sidebar />}
          
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-zinc-950">
            {/* Header */}
            <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
              <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSidebarToggle}
                      className="text-muted-foreground hover:bg-muted rounded-xl h-10 w-10 shrink-0"
                    >
                      <PanelLeft size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground ml-2">
                   <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
                      <Home size={16} />
                   </Link>
                   {pathname.split('/').filter(Boolean).map((segment, index, array) => {
                      if(segment === 'dashboard') return null;
                      const href = `/${array.slice(0, index + 1).join('/')}`;
                      const isLast = index === array.length - 1;
                      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

                      return (
                        <div key={href} className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-muted-foreground/50" />
                          <Link 
                             href={href} 
                             className={cn(
                               "transition-colors hover:text-foreground capitalize",
                               isLast ? "font-medium text-foreground pointer-events-none" : ""
                             )}
                          >
                            {title}
                          </Link>
                        </div>
                      )
                   })}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                      className="font-bold border-border/60 h-9 px-3 rounded-xl text-xs hidden sm:flex"
                    >
                      {locale === 'es' ? '🇺🇸' : '🇪🇸'}
                      <span className="hidden md:inline ml-1">{locale === 'es' ? 'EN' : 'ES'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}</p>
                  </TooltipContent>
                </Tooltip>
                
                {!isSuperadmin && (
                  <div className="flex items-center bg-muted/30 p-1 rounded-xl gap-1">
                    <ThemeCustomizer className="w-[110px] border-none bg-transparent hover:bg-background/50" />
                    <ModeToggle />
                  </div>
                )}
                
                <div className="h-6 w-[1px] bg-border/40 mx-1 hidden md:block" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:bg-muted rounded-xl">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-sm" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{locale === 'es' ? 'Notificaciones' : 'Notifications'}</p>
                  </TooltipContent>
                </Tooltip>

                
                {!isSuperadmin && user?.has_active_plan && (
                  <div className="w-1 md:w-2" />
                )}
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-zinc-50/20 dark:bg-zinc-950/30 custom-scrollbar">
              <div className="px-4 md:px-8 lg:px-12 py-8 md:py-10">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeColorProvider>
      <SidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </SidebarProvider>
    </ThemeColorProvider>
  );
}

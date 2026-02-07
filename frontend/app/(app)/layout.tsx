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
  const { isAuthenticated, user } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/login");
    }
  }, [isAuthenticated, router]);

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
      <div className="flex w-full h-screen bg-white dark:bg-zinc-950 overflow-hidden">
        {isSuperadmin ? <SuperadminSidebar /> : <Sidebar />}
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-14 md:h-16 border-b flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSidebarToggle}
                    className="text-muted-foreground hover:bg-muted rounded-lg h-9 w-9 shrink-0"
                  >
                    <PanelLeft size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                </TooltipContent>
              </Tooltip>

              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground ml-2">
                 <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
                    <Home size={14} />
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
            
            <div className="flex items-center gap-1 md:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                    className="font-bold border-border/60 h-8 px-2.5 rounded-lg text-xs hidden sm:flex"
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
                <div className="flex items-center bg-muted/50 p-0.5 rounded-lg gap-0.5">
                  <ThemeCustomizer className="w-[110px] border-none bg-transparent hover:bg-background/50" />
                  <ModeToggle />
                </div>
              )}
              
              <div className="h-5 w-[1px] bg-border/40 mx-1 hidden md:block" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-background shadow-sm" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{locale === 'es' ? 'Notificaciones' : 'Notifications'}</p>
                </TooltipContent>
              </Tooltip>

              
              {!isSuperadmin && (
                <>
                  {/* Mobile: icon only, Desktop: full button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 md:hidden rounded-lg shadow-sm"
                      >
                        <Plus size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{locale === 'es' ? 'Crear Campaña' : 'Create Campaign'}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8 px-3 rounded-lg shadow-sm text-[11px] font-semibold hidden md:flex">
                      <Rocket className="h-3.5 w-3.5" strokeWidth={2.5} />
                      {locale === 'es' ? 'CREAR CAMPAÑA' : 'CREATE CAMPAIGN'}
                  </Button>
                </>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/30 custom-scrollbar">
            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
              <div className="border border-border/40 rounded-2xl bg-card/30 backdrop-blur-sm p-4 md:p-6 shadow-sm">
                {children}
              </div>
            </div>
          </div>
        </main>
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

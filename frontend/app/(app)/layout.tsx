"use client";

import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Plus, PanelLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/components/providers/language-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, useSidebar } from "@/components/providers/sidebar-provider";
import { ThemeColorProvider } from "@/components/providers/theme-color-provider";
import { ThemeCustomizer } from "@/components/theme-customizer";

function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { locale, setLocale } = useLanguage();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/login");
    }
  }, [isAuthenticated, router]);

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
    <div className="flex w-full h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 border-b flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSidebarToggle}
              className="text-muted-foreground hover:bg-muted rounded-lg h-9 w-9 shrink-0"
            >
              <PanelLeft size={18} />
            </Button>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Buscar campañas, clientes o analíticas..." 
                className="pl-10 bg-muted/50 border-none h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/50 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="font-bold border-border/60 h-8 px-2.5 rounded-lg text-xs hidden sm:flex"
            >
              {locale === 'es' ? '🇺🇸' : '🇪🇸'}
              <span className="hidden md:inline ml-1">{locale === 'es' ? 'EN' : 'ES'}</span>
            </Button>
            
            <div className="flex items-center bg-muted/50 p-0.5 rounded-lg gap-0.5">
              <ThemeCustomizer />
              <ModeToggle />
            </div>
            
            <div className="h-5 w-[1px] bg-border/40 mx-1 hidden md:block" />

            <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-background shadow-sm" />
            </Button>

            {/* Mobile: icon only, Desktop: full button */}
            <Button 
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 md:hidden rounded-lg shadow-sm"
            >
              <Plus size={16} />
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8 px-3 rounded-lg shadow-sm text-[11px] font-semibold hidden md:flex">
                <Rocket className="h-3.5 w-3.5" strokeWidth={2.5} />
                CREAR CAMPAÑA
            </Button>
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

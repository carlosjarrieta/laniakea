"use client";

import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Plus, PanelLeft } from "lucide-react";
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
  const { collapsed, setCollapsed } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex w-full h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl h-10 w-10 shrink-0"
            >
              <PanelLeft size={20} />
            </Button>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Buscar campañas, clientes o analíticas..." 
                className="pl-10 bg-zinc-100/50 dark:bg-zinc-900/50 border-none h-11 rounded-xl focus-visible:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="font-bold border-zinc-200 h-10 px-4 rounded-xl hidden md:flex mr-2"
            >
              {locale === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
            </Button>
            
            <div className="flex items-center bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-xl gap-1">
              <ThemeCustomizer />
              <ModeToggle />
            </div>
            
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block" />

            <Button variant="ghost" size="icon" className="relative h-10 w-10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-zinc-950" />
            </Button>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 px-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all active:scale-95 hidden lg:flex">
              <Plus size={18} />
              Crear Campaña
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/30 custom-scrollbar">
          {children}
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

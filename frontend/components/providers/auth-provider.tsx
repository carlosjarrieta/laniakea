"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

const publicRoutes = ["/login", "/signup", "/terms", "/privacy"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      // If user is logged in, check if they need onboarding or a plan
      const user = useAuthStore.getState().user;
      
      // Superadmins bypass onboarding/billing guards
      if (user?.role === 'superadmin') return;

      const isAuthRoute = publicRoutes.includes(pathname);
      const isOnboardingRoute = pathname.startsWith("/onboarding");
      const isPlansRoute = pathname === "/plans";
      const isSettingsRoute = pathname.startsWith("/settings");

      // 1. Has no account -> Force onboarding
      if (!user?.has_account && !isOnboardingRoute && !isAuthRoute) {
        router.push("/onboarding/account");
        return;
      }

      // 2. Has account but no active plan -> Force plans page
      if (user?.has_account && !user?.has_active_plan && !isPlansRoute && !isSettingsRoute && !isAuthRoute) {
        router.push("/plans");
        return;
      }

      // 3. Has active plan and on plans page -> Go to dashboard
      if (user?.has_active_plan && isPlansRoute) {
        router.push("/dashboard");
        return;
      }

      // 3. User is on a public route but already authenticated -> Go to dashboard
      if (isAuthRoute) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, isMounted]);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return <>{children}</>;
}

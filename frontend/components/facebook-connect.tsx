"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import endpoints from "@/lib/apiRoutes";

interface FacebookConnectProps {
  onConnected?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
  children?: React.ReactNode;
}

export function FacebookConnect({ onConnected, variant = "secondary", className, children }: FacebookConnectProps) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleConnect = () => {
    console.log("[FacebookConnect] Redirecting to OmniAuth flow");
    setLoading(true);
    
    // Store callback for after OAuth
    if (onConnected) {
      sessionStorage.setItem('facebook_connect_callback', 'true');
    }
    
    toast.loading("Redirigiendo a Facebook...", { duration: 2000 });
    const authUrl = endpoints.integrations.facebookAuthUrl(token || "");
    window.location.href = authUrl;
  };

  return (
    <Button 
      variant={variant} 
      className={className}
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : !children && (
        <div className="relative flex items-center justify-center mr-2 bg-blue-600 rounded-full h-4 w-4">
             <span className="text-white text-[10px] font-bold">f</span>
        </div>
      )}
      {loading ? "Redirigiendo..." : (children || "Conectar Facebook")}
    </Button>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import endpoints from "@/lib/apiRoutes";
import { useLanguage } from "@/components/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookConnectProps {
  onConnected?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}

export function FacebookConnect({ onConnected, variant = "secondary", className }: FacebookConnectProps) {
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const { locale } = useLanguage();
  // const { t } = useTranslations(locale); // Assuming generic translation strings or hardcoded for now

  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== "undefined") {
      if (document.getElementById("facebook-jssdk")) {
        setSdkLoaded(true);
        return;
      }

      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v19.0",
        });
        setSdkLoaded(true);
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement; 
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if (fjs && fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs);
        }
      }(document, "script", "facebook-jssdk"));
    }
  }, []);

  const handleLogin = () => {
    if (!sdkLoaded || !window.FB) {
      toast.error("Facebook SDK no está listo. Por favor recarga la página.");
      return;
    }

    setLoading(true);
    window.FB.login(
      function(response: any) {
        if (response.authResponse) {
          connectBackend(response.authResponse.accessToken);
        } else {
          toast.error("Cancelaste la conexión con Facebook.");
          setLoading(false);
        }
      },
      { scope: "email,pages_show_list,pages_manage_posts,pages_read_engagement" }
    );
  };

  const connectBackend = async (accessToken: string) => {
    try {
      await api.post(endpoints.integrations.facebookConnect(), { accessToken });
      toast.success("Cuenta de Facebook conectada exitosamente", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      if (onConnected) onConnected();
    } catch (error) {
      console.error("Error connecting facebook:", error);
      toast.error("Error al conectar con Facebook. Verifica tu App ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className}
      onClick={handleLogin}
      disabled={loading || !sdkLoaded}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <div className="relative flex items-center justify-center mr-2 bg-blue-600 rounded-full h-4 w-4">
             <span className="text-white text-[10px] font-bold">f</span>
        </div>
      )}
      {loading ? "Conectando..." : "Conectar Facebook"}
    </Button>
  );
}
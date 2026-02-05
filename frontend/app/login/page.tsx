"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Command } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await handleLogin({ email, password });

    if (result.success) {
      toast.success("¡Bienvenido al cúmulo Laniakea!");
      router.push("/dashboard");
    } else {
      toast.error(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6 relative overflow-hidden font-sans">
      {/* Subtle background nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />

      <Card className="w-full max-w-[1000px] overflow-hidden border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-10 flex flex-col md:flex-row bg-white">
        {/* Left Side: Visual Experience */}
        <div className="relative w-full md:w-1/2 min-h-[400px] bg-zinc-900 overflow-hidden">
          <Image 
            src="/images/laniakea_galaxy.png" 
            alt="Laniakea Supercluster Network" 
            fill
            className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex flex-col justify-end p-10 text-white">
            <div className="space-y-2">
               <h2 className="text-2xl font-bold tracking-tight">Cúmulo Laniakea</h2>
               <p className="text-zinc-300 text-sm leading-relaxed max-w-sm">
                 Nuestra IA orquestando redes de anuncios como si fueran galaxias perfectamente alineadas.
               </p>
            </div>
          </div>
          <div className="absolute top-10 left-10 flex items-center gap-2 text-white/90 font-bold tracking-tight">
            <div className="bg-violet-600 rounded-lg p-1">
              <Command size={18} />
            </div>
            Laniakea
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2">
              Ingresar a tu cuenta
            </h1>
            <p className="text-zinc-500 font-medium">
              Accede a tu panel de orquestación publicitaria.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-zinc-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold text-zinc-700">Contraseña</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-zinc-200 focus:border-violet-500 focus:ring-violet-500/10 rounded-xl transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-xl shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all active:scale-[0.98] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Conectando...
                </>
              ) : (
                "Entrar a Laniakea"
              )}
            </Button>
            
            <div className="relative flex items-center gap-3 py-2">
              <div className="h-[1px] bg-zinc-100 flex-1" />
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">O accede con</span>
              <div className="h-[1px] bg-zinc-100 flex-1" />
            </div>

            <Button 
              variant="outline" 
              type="button" 
              className="w-full h-12 border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold rounded-xl transition-all flex gap-2"
            >
              <svg className="w-5 h-5 shadow-sm" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="text-center text-sm pt-4">
              <span className="text-zinc-500 font-medium">¿Nuevo en la red?</span>{" "}
              <Link href="/signup" className="font-extrabold text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline">
                Crea tu cuenta aquí
              </Link>
            </div>
          </form>
        </div>
      </Card>
      
      {/* Social Footer */}
      <div className="absolute bottom-6 flex gap-6 text-zinc-400 text-xs font-bold uppercase tracking-widest z-10">
        <span className="hover:text-violet-500 cursor-pointer transition-colors">Twitter</span>
        <span className="hover:text-violet-500 cursor-pointer transition-colors">Dribbble</span>
        <span className="hover:text-violet-500 cursor-pointer transition-colors">GitHub</span>
      </div>
    </div>
  );
}

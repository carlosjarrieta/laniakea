"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket, Shield, Building, User, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

interface Country {
  name: string;
  code: string;
}

interface Plan {
  id: number;
  name: string;
  price_cents: number;
  features: any;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<Country[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    account_type: "individual",
    billing_email: "",
    country_code: "",
    address: "",
    city: "",
    postal_code: "",
    phone_number: "",
    plan_id: null as number | null
  });

  useEffect(() => {
    fetchCountries();
    fetchPlans();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data } = await api.get("/onboarding/countries");
      setCountries(data);
    } catch (error) {
      console.error("Failed to fetch countries");
    }
  };

  const fetchPlans = async () => {
    try {
      const { data } = await api.get("/plans");
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/onboarding", { account: formData });
      toast.success("¡Cuenta creada con éxito!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
             <div className="bg-primary/20 p-3 rounded-2xl">
                <Rocket className="w-10 h-10 text-primary" />
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configura tu experiencia Laniakea</h1>
          <p className="text-zinc-400">Paso {step} de 2: {step === 1 ? 'Detalles de la cuenta' : 'Selecciona tu plan'}</p>
        </div>

        {step === 1 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
              <CardDescription>Completa los detalles básicos para empezar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tipo de Cuenta</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setFormData({...formData, account_type: 'individual'})}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                          formData.account_type === 'individual' ? "border-primary bg-primary/10 text-primary" : "border-border/40 hover:bg-muted/50 text-zinc-400"
                        )}
                      >
                        <User size={20} />
                        <span className="text-xs font-medium">Individual</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, account_type: 'company'})}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                          formData.account_type === 'company' ? "border-primary bg-primary/10 text-primary" : "border-border/40 hover:bg-muted/50 text-zinc-400"
                        )}
                      >
                        <Building size={20} />
                        <span className="text-xs font-medium">Empresa</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nombre</label>
                    <Input 
                      placeholder={formData.account_type === 'company' ? "Nombre de la empresa" : "Tu nombre completo"}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-11 bg-zinc-900/50 border-border/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email de Facturación</label>
                    <Input 
                      placeholder="billing@email.com"
                      value={formData.billing_email}
                      onChange={(e) => setFormData({...formData, billing_email: e.target.value})}
                      className="h-11 bg-zinc-900/50 border-border/40"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">País</label>
                    <Select onValueChange={(v) => setFormData({...formData, country_code: v})}>
                      <SelectTrigger className="h-11 bg-zinc-900/50 border-border/40">
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ciudad / Dirección</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="Ciudad"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="h-11 bg-zinc-900/50 border-border/40"
                      />
                      <Input 
                        placeholder="CP"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        className="h-11 bg-zinc-900/50 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dirección Completa</label>
                    <Input 
                      placeholder="Calle, No, Piso..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="h-11 bg-zinc-900/50 border-border/40"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.country_code}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-xl font-bold gap-2 group"
                >
                  Continuar a Planes
                  <Check size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={cn(
                  "border-border/40 bg-card/50 backdrop-blur-xl transition-all relative overflow-hidden",
                  formData.plan_id === plan.id ? "ring-2 ring-primary scale-105" : "hover:scale-[1.02]"
                )}
              >
                {plan.name === 'Professional' && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                    Más Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">${plan.price_cents / 100}</span>
                    <span className="text-zinc-400 text-xs">/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {Object.entries(plan.features).map(([key, value]: [string, any]) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-zinc-300">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{key === 'profiles' ? `${value} Perfiles sociales` : `${key}: ${value}`}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => {
                        setFormData({...formData, plan_id: plan.id});
                        handleSubmit();
                    }}
                    disabled={loading}
                    className={cn(
                      "w-full rounded-xl font-bold h-11",
                      plan.name === 'Professional' ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Seleccionar Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="md:col-span-3 flex justify-center pt-4">
               <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">← Volver a detalles</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  subDescription?: string;
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({
  title,
  value,
  trend,
  trendUp,
  description,
  subDescription,
  icon: Icon,
  className
}: KpiCardProps) {
  return (
    <Card className={cn("shadow-sm border-border/40 rounded-xl bg-card/50 overflow-hidden", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary/70" strokeWidth={2.5} />}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
          </div>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold flex items-center gap-0.5 bg-muted/50 px-2 py-0.5 rounded-full border border-border/40",
              trendUp ? "text-emerald-600" : "text-rose-600"
            )}>
              {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
            </span>
          )}
        </div>
        <div className="text-2xl font-black tracking-tight mb-1">{value}</div>
        {description && (
          <p className="text-[11px] font-bold mt-4 flex items-center gap-1 text-foreground/80">
            {description}
          </p>
        )}
        {subDescription && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{subDescription}</p>
        )}
      </CardContent>
    </Card>
  );
}

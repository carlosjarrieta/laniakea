"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  fallbackUrl?: string;
}

export function BackButton({ className, fallbackUrl = "/dashboard" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className={cn("mr-2 h-8 w-8 rounded-full bg-muted/30 hover:bg-muted text-muted-foreground transition-colors", className)}
    >
      <ArrowLeft size={16} strokeWidth={2.5} />
    </Button>
  );
}

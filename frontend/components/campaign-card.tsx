"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  MoreHorizontal, 
  Calendar, 
  Trash2,
  ExternalLink,
  Globe,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Campaign } from "@/lib/campaigns-api";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: number) => void;
}

const PlatformIcon = ({ platform, className }: { platform: string, className?: string }) => {
  const p = platform.toLowerCase();
  
  if (p === 'facebook') return (
    <svg viewBox="0 0 24 24" className={cn("text-[#1877F2]", className)} style={{ width: 12, height: 12 }} fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h3.428l-.532 3.667h-2.896v7.98h-4.844Z" />
    </svg>
  );
  if (p === 'linkedin') return (
    <svg viewBox="0 0 24 24" className={cn("text-[#0A66C2]", className)} style={{ width: 12, height: 12 }} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
  if (p === 'x' || p === 'twitter') return (
    <svg viewBox="0 0 24 24" className={cn("text-foreground", className)} style={{ width: 11, height: 11 }} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (p === 'instagram') return (
    <svg viewBox="0 0 24 24" className={cn("text-[#E4405F]", className)} style={{ width: 12, height: 12 }} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
  if (p === 'youtube') return (
    <svg viewBox="0 0 24 24" className={cn("text-[#FF0000]", className)} style={{ width: 12, height: 12 }} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
  if (p === 'tiktok') return (
    <svg viewBox="0 0 24 24" className={cn("text-foreground", className)} style={{ width: 12, height: 12 }} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.14c0 3.48-2.52 5.79-5.96 5.79-2.45 0-5.08-1.55-5.69-4.22-.31-1.35.32-2.79 1.49-3.51 1.25-.79 2.82-.76 4.09-.08 1.05.57 1.74 1.65 1.74 2.86v.22c.03-2.12.02-4.24.02-6.36h-4.21v-4.13c0-2.6 1.83-4.73 4.44-4.79Z" />
    </svg>
  );
  if (p === 'multi') return <Globe size={12} className={cn("text-primary", className)} />;
  
  return <Megaphone size={12} className={className} />;
};

export function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const firstImage = campaign.campaign_posts?.find(p => p.image_url || p.real_image_url);
  const imageUrl = firstImage?.real_image_url || firstImage?.image_url;
  const postsCount = campaign.campaign_posts?.length || 0;
  const platforms = Array.from(new Set(campaign.campaign_posts?.map(p => p.platform) || []));
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card className="group hover:border-primary/40 transition-all duration-300 bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col border-border/40 shadow-sm hover:shadow-md h-fit">
      {/* Visual Preview - Top */}
      <div className="aspect-[16/10] w-full bg-muted/20 relative overflow-hidden border-b border-border/10">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={campaign.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Megaphone className="text-primary/20" size={20} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/60 to-transparent opacity-60" />
        
        <Badge className={cn(
          "absolute top-1.5 left-1.5 text-[7px] font-bold uppercase tracking-wider h-3.5 px-1 shadow-sm border-none",
          campaign.status === 'active' ? "bg-emerald-500 text-white" :
          campaign.status === 'draft' ? "bg-blue-500 text-white" :
          "bg-zinc-500 text-white"
        )}>
          {campaign.status}
        </Badge>

        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-6 w-6 rounded-lg bg-background/80 backdrop-blur-md border border-border/20">
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-border/40 min-w-[140px]">
              <DropdownMenuItem className="text-xs gap-2 cursor-pointer py-2">
                <ExternalLink size={14} /> Abrir Detalles
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs gap-2 text-destructive focus:text-destructive cursor-pointer py-2" 
                onClick={() => onDelete(campaign.id)}
              >
                <Trash2 size={14} /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {campaign.name}
          </h3>
          <p className="text-[9px] text-muted-foreground line-clamp-1 opacity-80">
            {campaign.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-border/5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Layers size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-bold">{postsCount}</span>
            </div>
            <div className="flex gap-1">
              {platforms.length > 0 ? platforms.map(p => (
                <div key={p} className="opacity-80" title={p}>
                  <PlatformIcon platform={p} />
                </div>
              )) : (
                <span className="text-[8px] text-muted-foreground italic">--</span>
              )}
            </div>
          </div>
          
          <Link href={`/dashboard?campaign_id=${campaign.id}`} className="text-[9px] font-bold text-primary hover:underline">
            Gestionar
          </Link>
        </div>
      </div>
    </Card>
  );
}

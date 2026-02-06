"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useThemeColor } from "@/components/providers/theme-color-provider"

const themes = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-950" },
  { name: "Verde", value: "green", color: "bg-green-600" },
  { name: "Azul", value: "blue", color: "bg-blue-600" },
  { name: "Violeta", value: "violet", color: "bg-violet-600" },
  { name: "Ámbar", value: "yellow", color: "bg-yellow-500" },
  { name: "Rosa", value: "rose", color: "bg-rose-600" },
  { name: "Naranja", value: "orange", color: "bg-orange-600" },
] as const

export function ThemeCustomizer() {
  const { themeColor, setThemeColor } = useThemeColor()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 w-full justify-start px-4 rounded-xl border-zinc-200 md:w-auto md:justify-center md:px-0 md:aspect-square"
          aria-label="Customize theme"
        >
          <div className={cn("h-4 w-4 rounded-full", 
            themes.find(t => t.value === themeColor)?.color || "bg-zinc-950"
          )} />
          <span className="ml-2 md:hidden">Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
        <DropdownMenuLabel className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 py-1.5">
          Color del tema
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-2 my-1" />
        <div className="grid grid-cols-3 gap-1">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant="ghost"
              className={cn(
                "group relative h-10 w-full justify-center rounded-lg border-2 border-transparent px-0 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                themeColor === theme.value && "border-primary/20 bg-zinc-50 dark:border-primary/50 dark:bg-zinc-900"
              )}
              onClick={() => setThemeColor(theme.value)}
              title={theme.name}
            >
              <div className={cn("h-4 w-4 rounded-full", theme.color)} />
              {themeColor === theme.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white mix-blend-difference" />
                </div>
              )}
              <span className="sr-only">{theme.name}</span>
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

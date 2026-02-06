"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeColor } from "@/components/providers/theme-color-provider"

const themes = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-950" },
  { name: "Verde", value: "green", color: "bg-green-600" },
  { name: "Azul", value: "blue", color: "bg-blue-600" },
  { name: "Violeta", value: "violet", color: "bg-violet-600" },
  { name: "Ámbar", value: "yellow", color: "bg-yellow-500" },
  { name: "Rosa", value: "rose", color: "bg-rose-600" },
  { name: "Naranja", value: "orange", color: "bg-orange-600" },
  { name: "Rojo", value: "red", color: "bg-red-600" },
] as const

import { useAuthStore } from "@/store/useAuthStore"
import api from "@/lib/api"
import { toast } from "sonner"

export function ThemeCustomizer() {
  const { themeColor, setThemeColor } = useThemeColor()
  const { user, updateUser } = useAuthStore()

  const handleThemeChange = async (value: string) => {
    // Optimistic update
    setThemeColor(value as any)
    
    if (user) {
      try {
        const response = await api.patch('/users/profile', { 
          user: { theme_color: value } 
        })
        if (response.data.user) {
          updateUser(response.data.user)
        }
      } catch (error) {
        console.error("Failed to persist theme preference:", error)
        toast.error("Error al guardar preferencia de tema")
      }
    }
  }

  return (
    <Select value={themeColor} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-[120px] h-10 rounded-xl border-zinc-200 bg-white/50 backdrop-blur-sm focus:ring-violet-500/20 transition-all font-medium text-zinc-700">
        <SelectValue placeholder="Tema" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-zinc-200">
        {themes.map((theme) => (
          <SelectItem 
            key={theme.value} 
            value={theme.value}
            className="rounded-lg focus:bg-zinc-100 py-2.5"
          >
            <span className="font-medium text-zinc-700">{theme.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

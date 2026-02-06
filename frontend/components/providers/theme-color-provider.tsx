"use client"

import * as React from "react"
import { createJSONStorage, persist } from "zustand/middleware"
import { create } from "zustand"

type ThemeColor = "zinc" | "slate" | "stone" | "gray" | "neutral" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet"

interface ThemeColorState {
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
}

export const useThemeColor = create<ThemeColorState>()(
  persist(
    (set) => ({
      themeColor: "zinc",
      setThemeColor: (themeColor) => set({ themeColor }),
    }),
    {
      name: "theme-color-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const themeColor = useThemeColor((state) => state.themeColor)

  // Apply data-theme attribute to body for CSS selector targeting if needed
  // But for Tailwind classes, we might need a simpler approach or a wrapper.
  // Actually, shadcn usually handles this via CSS variables in global.css
  // specific to each theme. We will implement these classes in globals.css shortly.
  
  React.useEffect(() => {
    const body = document.body
    // Remove all previous theme color classes
    const themes = ["theme-zinc", "theme-slate", "theme-stone", "theme-gray", "theme-neutral", "theme-red", "theme-rose", "theme-orange", "theme-green", "theme-blue", "theme-yellow", "theme-violet"]
    body.classList.remove(...themes)
    // Add new theme color class
    body.classList.add(`theme-${themeColor}`)
  }, [themeColor])

  return <>{children}</>
}

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

import { useAuthStore } from "@/store/useAuthStore"

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const { themeColor, setThemeColor } = useThemeColor()
  const user = useAuthStore((state) => state.user)

  // Sync with user preferences from backend when user object changes
  React.useEffect(() => {
    if (user?.theme_color && user.theme_color !== themeColor) {
      setThemeColor(user.theme_color as ThemeColor)
    }
  }, [user?.theme_color])

  React.useEffect(() => {
    const body = document.body
    const themes = ["theme-zinc", "theme-slate", "theme-stone", "theme-gray", "theme-neutral", "theme-red", "theme-rose", "theme-orange", "theme-green", "theme-blue", "theme-yellow", "theme-violet"]
    body.classList.remove(...themes)
    body.classList.add(`theme-${themeColor}`)
  }, [themeColor])

  return <>{children}</>
}

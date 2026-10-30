"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"

function isCmsRoute(pathname: string) {
  if (pathname.startsWith("/admin/blog/preview")) return false
  return pathname === "/login" || pathname.startsWith("/admin")
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname()

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={isCmsRoute(pathname) ? undefined : "light"}
      // Client-rendered copies never execute; marking them as data silences React's script-tag error.
      scriptProps={
        typeof window === "undefined" ? undefined : { type: "application/json" }
      }
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

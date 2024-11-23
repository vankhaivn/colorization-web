"use client"

import { ThemeProvider } from "@/providers/themes"
import * as React from "react"

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
    )
}

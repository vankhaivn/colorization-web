import type { Metadata } from "next"
import "../styles/globals.css"
import { baiJamjuree } from "@/styles/fonts"

import { AppHeader } from "@/components/layouts"
import { Toaster } from "@/components/ui"
import { ThemeProvider } from "@/providers/themes"

export const metadata: Metadata = {
    title: "Image Colorization App",
    description: "Enhance and restore your images with AI-powered tools for colorization and motion deblurring.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={baiJamjuree.className}>
            <body className="antialiased overflow-hidden">
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <div className="w-full h-[100vh] px-[8%] grid-bg">
                        <AppHeader />
                        {children}
                    </div>
                    <Toaster richColors={true} />
                </ThemeProvider>
            </body>
        </html>
    )
}

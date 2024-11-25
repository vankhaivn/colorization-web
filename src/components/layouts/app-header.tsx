"use client"

import { ThemeSwitcher } from "@/components/common"
import { PaintBucket } from "lucide-react"

export const AppHeader = () => {
    return (
        <div className="px-4 border-b-2 flex flex-row justify-between items-center h-[10vh] bg-background">
            <div className="uppercase text-2xl font-semibold flex items-center gap-x-2">
                <PaintBucket />
                <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
                    Colorization
                </span>
            </div>
            <ThemeSwitcher />
        </div>
    )
}

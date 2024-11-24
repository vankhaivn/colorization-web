"use client"

import { ThemeSwitcher } from "@/components/common"

export const AppHeader = () => {
    return (
        <div className="px-4 border-b-2 flex flex-row justify-between items-center h-[10vh]">
            <div className="uppercase text-2xl font-semibold">Colorization</div>
            <ThemeSwitcher />
        </div>
    )
}

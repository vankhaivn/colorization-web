"use client"

import { ThemeSwitcher } from "@/components/common"

export const AppHeader = () => {
    return (
        <div className="p-4 mb-4 border-b-2 flex flex-row justify-between">
            <div className="uppercase text-xl font-semibold">Colorization</div>
            <ThemeSwitcher />
        </div>
    )
}

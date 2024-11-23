"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"

import { enums } from "@/utils/constants"

export function ThemeSwitcher({ className }: IThemeSwitcherCompProps) {
    const { setTheme, theme } = useTheme()
    const [isDark, setIsDark] = useState<boolean>()

    useEffect(() => {
        setIsDark(theme === enums.THEME.DARK ? true : false)
    }, [setTheme])

    const handleSwitchTheme = () => {
        if (theme === enums.THEME.LIGHT) {
            setTheme(enums.THEME.DARK)
            toast("Changed to Dark mode")
        } else {
            setTheme(enums.THEME.LIGHT)
            toast("Changed to Light mode")
        }
    }

    return (
        <div className={`${className} flex flex-row justify-between items-center`}>
            <p className="mr-2">Dark mode</p>
            <Switch id="theme-switcher" onClick={handleSwitchTheme} checked={isDark} />
        </div>
    )
}

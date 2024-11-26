import { useTheme } from "next-themes"
import { toast } from "sonner"

import { Switch } from "@/components/ui"

import { enums } from "@/utils/constants"
import { Moon, SunMoon } from "lucide-react"

export function ThemeSwitcher({ className }: IThemeSwitcherCompProps) {
    const { setTheme, theme } = useTheme()

    const handleSwitchTheme = () => {
        if (theme === enums.THEME.LIGHT) {
            setTheme(enums.THEME.DARK)
            toast.success("Changed to Dark mode")
        } else {
            setTheme(enums.THEME.LIGHT)
            toast.success("Changed to Light mode")
        }
    }

    return (
        <div className={`${className} flex flex-row justify-between items-center`}>
            {theme === enums.THEME.LIGHT ? <Moon /> : <SunMoon />}
            <Switch
                id="theme-switcher"
                onClick={handleSwitchTheme}
                checked={theme === enums.THEME.DARK}
                className="ml-2"
            />
        </div>
    )
}

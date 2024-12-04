import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui"
import { enums } from "@/utils/constants"

export const ModeSelector = (props: IModeSelectorCompProps) => {
    const { className, onChange } = props

    const handleOnChange = (value: string) => {
        if (onChange) {
            onChange(value)
        }
    }

    return (
        <Select onValueChange={handleOnChange}>
            <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder="Select colorize mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select model type</SelectLabel>
                    <SelectItem value={enums.MODE.DEFAULT}>Default</SelectItem>
                    <SelectItem value={enums.MODE.WITH_GAN}>With GAN</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

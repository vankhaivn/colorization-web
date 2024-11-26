import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { enums } from "@/utils/constants"

export const TaskSelector = (props: ITaskSelectorCompProps) => {
    const { className, onChange } = props

    const handleOnChange = (value: string) => {
        if (onChange) {
            onChange(value)
        }
    }

    return (
        <Select onValueChange={handleOnChange}>
            <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Task</SelectLabel>
                    <SelectItem value={enums.TASK.COLORIZATION}>Colorization</SelectItem>
                    <SelectItem value={enums.TASK.MOTION_DEBLUR}>Motion Deblur</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

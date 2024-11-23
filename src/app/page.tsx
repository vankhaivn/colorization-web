"use client"

import { Image, ImageFallback, ImageWrapper } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"

export default function Page() {
    const [state, setState] = useState<IMainPageState>({
        previewImage: "",
    })
    const { previewImage } = state

    const handleOnChange = (field: string, value: string | null) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }))
    }

    const handleSubmitImage = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files
        if (fileList && fileList[0]) {
            const blob = URL.createObjectURL(fileList[0])
            handleOnChange("previewImage", blob)
        }
    }

    return (
        <div>
            <div className="w-[200px] h-[200px]">
                <Label htmlFor="input-image">
                    <ImageWrapper className="w-[200px] h-[200px]">
                        <Image src={previewImage} alt="@image" />
                        <ImageFallback>Image</ImageFallback>
                    </ImageWrapper>
                </Label>
            </div>
            <Input
                id="input-image"
                type="file"
                accept="image/*"
                onChange={handleSubmitImage}
                multiple={false}
                className="w-0 h-0 hidden"
            />
            <div className="text-foreground">hello</div>
        </div>
    )
}

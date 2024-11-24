"use client"

import { ChangeEvent, useState } from "react"
import { Download, WandSparkles } from "lucide-react"
import { toast } from "sonner"

import { Image, ImageFallback, ImageWrapper } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { apiHelper } from "@/utils/helpers"

export default function Page() {
    const [state, setState] = useState<IMainPageState>({
        previewInputImage: "",
        previewOutputImage: "",
        progress: 0,
        file: null,
        loading: false,
    })
    const { previewInputImage, previewOutputImage, progress, file, loading } = state

    const handleOnChange = (field: string, value: string | number | File | boolean | null) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }))
    }

    const handleSubmitImage = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files
        if (fileList && fileList[0]) {
            previewInputImage && URL.revokeObjectURL(previewInputImage)
            const blob = URL.createObjectURL(fileList[0])
            handleOnChange("previewInputImage", blob)
            handleOnChange("file", fileList[0])
        }
    }

    const handleColorize = async () => {
        handleOnChange("loading", true)
        handleOnChange("progress", 1)

        const apiPromise = file ? apiHelper.colorize(file) : null

        for (let i = 2; i <= 100; i++) {
            await new Promise((resolve) => setTimeout(resolve, 30))
            handleOnChange("progress", i)

            if (i === 100 && apiPromise) {
                break
            }
        }

        try {
            if (apiPromise) {
                const res = await apiPromise
                if (res.data) {
                    previewOutputImage && URL.revokeObjectURL(previewOutputImage)
                    handleOnChange("previewOutputImage", URL.createObjectURL(res.data))
                }
            } else {
                toast.error("Please provide an image!")
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }

        handleOnChange("progress", 100)
        handleOnChange("loading", false)
    }

    return (
        <div className="flex flex-row w-full h-[90vh] justify-between items-center py-8">
            <div className="w-[40%] shadow-lg">
                <Label htmlFor="input-image">
                    <ImageWrapper className="w-full h-full">
                        <Image src={previewInputImage} alt="@image" />
                        <ImageFallback className="min-h-[62vh] font-semibold text-lg">
                            Click to upload your image
                        </ImageFallback>
                    </ImageWrapper>
                </Label>
                <Input
                    id="input-image"
                    type="file"
                    accept="image/*"
                    onChange={handleSubmitImage}
                    multiple={false}
                    className="w-0 h-0 hidden"
                />
            </div>
            <div className="w-[16%] flex flex-col items-center gap-y-2">
                <Button variant={"secondary"} className="w-[56%]" onClick={handleColorize} disabled={loading}>
                    <WandSparkles />
                    Paint It
                </Button>
                {progress > 0 && <Progress value={progress} className="" />}
            </div>
            <div className="w-[40%] shadow-lg relative">
                <ImageWrapper className="w-full h-full">
                    <Image src={previewOutputImage} alt="@image" />
                    <ImageFallback className="min-h-[62vh] font-semibold text-lg">
                        Click to upload your image
                    </ImageFallback>
                </ImageWrapper>
                <Button className="absolute left-[50%] translate-x-[-50%] top-[102%]" size={"icon"} variant={"outline"}>
                    <Download />
                </Button>
            </div>
        </div>
    )
}

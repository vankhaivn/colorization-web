"use client"

import { ChangeEvent, useState } from "react"
import { Download, WandSparkles } from "lucide-react"
import { toast } from "sonner"

import { Image, ImageFallback, ImageWrapper, TaskSelector } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { apiHelper, timeHelper } from "@/utils/helpers"

export default function Page() {
    const [state, setState] = useState<IMainPageState>({
        previewInputImage: "",
        previewOutputImage: "",
        outputBlob: null,
        task: "",
        progress: 0,
        file: null,
        loading: false,
    })
    const { previewInputImage, previewOutputImage, outputBlob, task, progress, file, loading } = state

    const handleOnChange = (field: string, value: string | number | File | boolean | Blob | null) => {
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
        if (!task) {
            toast.error("Please provide a task!")
            return
        }

        if (!file) {
            toast.error("Please provide an image!")
            return
        }

        handleOnChange("loading", true)
        handleOnChange("progress", 0)

        try {
            const res = await apiHelper.colorize(file, (progress: number) => {
                handleOnChange("progress", progress)
            })
            if (res.data) {
                previewOutputImage && URL.revokeObjectURL(previewOutputImage)

                const outputBlob = new Blob([res.data], { type: "image/png" })
                handleOnChange("outputBlob", outputBlob)
                handleOnChange("previewOutputImage", URL.createObjectURL(outputBlob))
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }

        handleOnChange("progress", 100)
        await timeHelper.delay(500)
        handleOnChange("progress", 0)
        handleOnChange("loading", false)
    }

    const handleDownload = () => {
        if (outputBlob) {
            const link = document.createElement("a")
            link.href = URL.createObjectURL(outputBlob)
            link.download = "colorized-image.png"
            link.click()
            URL.revokeObjectURL(link.href)
        } else {
            toast.error("No image available to download!")
        }
    }

    return (
        <div className="flex flex-row w-full h-[90vh] justify-between items-center py-8 relative">
            <div className="w-[40%] shadow-lg">
                <Label htmlFor="input-image">
                    <ImageWrapper className="w-full h-full">
                        <Image src={previewInputImage} alt="@image" />
                        <ImageFallback className="min-h-[62vh] font-semibold text-sm md:text-base lg:text-xl">
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
            <div className="w-[20%] flex flex-col items-center gap-y-2 px-4 md:px-6 lg:px-8">
                <TaskSelector className="mb-4" onChange={(value) => handleOnChange("task", value)} />
                <Button variant={"secondary"} className="w-full" onClick={handleColorize} disabled={loading}>
                    <WandSparkles />
                    Make Magic!
                </Button>
            </div>
            <div className="w-[40%] shadow-lg relative">
                <ImageWrapper className="w-full h-full">
                    <Image src={previewOutputImage} alt="@image" />
                    <ImageFallback className="min-h-[62vh] font-semibold text-lg">
                        Click to upload your image
                    </ImageFallback>
                </ImageWrapper>
                <Button
                    className="absolute left-[50%] translate-x-[-50%] -top-12"
                    size={"icon"}
                    variant={"outline"}
                    onClick={handleDownload}
                >
                    <Download />
                </Button>
            </div>
            {progress > 0 && <Progress value={progress} className="absolute bottom-12" />}
        </div>
    )
}

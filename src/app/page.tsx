"use client"

import { ChangeEvent, useState } from "react"
import { Download, Loader2, WandSparkles } from "lucide-react"
import { toast } from "sonner"

import { Image, ImageFallback, ImageWrapper, ModeSelector } from "@/components/common"
import { Input, Label, Button, Progress } from "@/components/ui"

import { apiHelper, timeHelper } from "@/utils/helpers"
import { enums } from "@/utils/constants"

export default function Page() {
    const [state, setState] = useState<IMainPageState>({
        previewInputImage: "",
        previewOutputImage: "",
        mode: "",
        progress: 1,
        file: null,
        loading: false,
        outputFile: null,
        outputBlob: null,
        outputScore: 0,
    })
    const {
        previewInputImage,
        previewOutputImage,
        outputBlob,
        mode,
        progress,
        file,
        outputFile,
        loading,
        outputScore,
    } = state

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
        if (!mode) {
            toast.error("Please provide a mode!")
            return
        }

        if (!file) {
            toast.error("Please provide an image!")
            return
        }

        handleOnChange("loading", true)
        handleOnChange("progress", 0)

        try {
            let res
            if (mode === enums.MODE.DEFAULT) {
                res = await apiHelper.colorizeDefault(file, (progress: number) => {
                    handleOnChange("progress", progress)
                })
            } else if (mode === enums.MODE.WITH_GAN) {
                res = await apiHelper.colorizeWithGan(file, (progress: number) => {
                    handleOnChange("progress", progress)
                })
            } else {
                toast.error("Invalid mode selected!")
                handleOnChange("loading", false)
                return
            }

            if (res.data) {
                previewOutputImage && URL.revokeObjectURL(previewOutputImage)

                const outputBlob = new Blob([res.data], { type: "image/png" })
                handleOnChange("outputBlob", outputBlob)
                handleOnChange("outputFile", res.data)
                handleOnChange("previewOutputImage", URL.createObjectURL(outputBlob))
                toast.success("Task completed successfully!")
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

    const handleGetColorfulness = async (image: File) => {
        try {
            handleOnChange("loading", true)
            const res = await apiHelper.getColorfulness(image)
            handleOnChange("outputScore", Math.floor(res.data))
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        } finally {
            handleOnChange("loading", false)
        }
    }

    return (
        <div className="flex flex-row w-full h-[90vh] justify-between items-start mt-12 py-8 relative">
            <div className="w-[36%] shadow-lg relative">
                <Label htmlFor="input-image">
                    <ImageWrapper className="w-full h-full max-h-[80vh]">
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
            <div className="relative w-[28%] flex flex-col items-center gap-y-2 px-4 md:px-6 lg:px-8">
                <ModeSelector className="mb-4" onChange={(value) => handleOnChange("mode", value)} />
                <Button variant={"secondary"} className="w-full" onClick={handleColorize} disabled={loading}>
                    <WandSparkles />
                    Make Magic!
                </Button>
                {progress > 0 && <Progress value={progress} className="w-[82%] absolute -bottom-8" />}
            </div>
            <div className="w-[36%] shadow-lg relative">
                <ImageWrapper className="w-full h-full max-h-[80vh]">
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
                {outputFile && (
                    <div>
                        <Button
                            className="absolute bottom-0 translate-y-[160%] left-[50%] translate-x-[-50%]"
                            onClick={() => handleGetColorfulness(outputFile)}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Get Colorfulness"}
                        </Button>
                        {outputScore !== 0 && (
                            <div className="absolute bottom-0 translate-y-[320%] text-3xl font-bold left-[50%] translate-x-[-50%] text-green-500">
                                {outputScore}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

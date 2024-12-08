"use client"

import { ChangeEvent, useState } from "react"
import { Download, Loader2, RotateCwSquare, WandSparkles } from "lucide-react"
import { toast } from "sonner"
import ReactCompareImage from "react-compare-image"

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
            if (previewInputImage) {
                URL.revokeObjectURL(previewInputImage)
            }
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
                if (previewOutputImage) {
                    URL.revokeObjectURL(previewOutputImage)
                }
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
        <div className="flex flex-row w-full h-[90vh] justify-center items-center mt-2 py-8 relative">
            <div className="w-[20%] shadow-lg relative bg-card">
                {previewInputImage && (
                    <>
                        <Input
                            id="change-image"
                            type="file"
                            accept="image/*"
                            onChange={handleSubmitImage}
                            multiple={false}
                            className="w-0 h-0 hidden"
                        />
                        <Label
                            className="bg-zinc-700 cursor-pointer p-2 rounded-md absolute -top-[68%] flex justify-center items-center gap-x-2"
                            htmlFor="change-image"
                        >
                            <RotateCwSquare />
                            Change your image
                        </Label>
                    </>
                )}
                <ModeSelector className="mb-4" onChange={(value) => handleOnChange("mode", value)} />
                <Button variant={"secondary"} className="w-full" onClick={handleColorize} disabled={loading}>
                    <WandSparkles />
                    Make Magic!
                </Button>
                {progress > 0 && <Progress value={progress} className="w-full absolute -bottom-8" />}
            </div>
            <div className="relative max-w-[70%] w-[50%] max-h-[72vh] flex flex-col items-center gap-y-2 px-4 md:px-6 lg:px-8">
                {previewInputImage ? (
                    <ReactCompareImage
                        leftImage={previewInputImage}
                        rightImage={previewOutputImage || previewInputImage}
                    />
                ) : (
                    <div className="w-full shadow-lg relative">
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
                )}
            </div>
        </div>
    )
}

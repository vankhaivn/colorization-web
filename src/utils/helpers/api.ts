import axios from "axios"
import { appConfigs } from "@/utils/constants"

export const colorizeDefault = async (file: File, onProgress: (value: number) => void) => {
    try {
        const formData = new FormData()
        formData.append("file", file)

        let totalSize = 0
        let uploaded = 0
        let downloaded = 0

        const url = `${appConfigs.API_URL}/default`

        totalSize = file.size

        const res = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
            onUploadProgress: (progressEvent) => {
                uploaded = progressEvent.loaded
                const progress = Math.round(((uploaded / totalSize) * 0.3 + (downloaded / totalSize) * 0.7) * 100)
                if (onProgress) onProgress(progress)
            },
            onDownloadProgress: (progressEvent) => {
                downloaded = progressEvent.loaded
                const progress = Math.round(((uploaded / totalSize) * 0.3 + (downloaded / totalSize) * 0.7) * 100)
                if (onProgress) onProgress(progress)
            },
        })

        return res
    } catch (err) {
        throw err
    }
}

export const colorizeWithGan = async (file: File, onProgress: (value: number) => void) => {
    try {
        const formData = new FormData()
        formData.append("file", file)

        let totalSize = 0
        let uploaded = 0
        let downloaded = 0

        const url = `${appConfigs.API_URL}/with-gan`

        totalSize = file.size

        const res = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
            onUploadProgress: (progressEvent) => {
                uploaded = progressEvent.loaded
                const progress = Math.round(((uploaded / totalSize) * 0.3 + (downloaded / totalSize) * 0.7) * 100)
                if (onProgress) onProgress(progress)
            },
            onDownloadProgress: (progressEvent) => {
                downloaded = progressEvent.loaded
                const progress = Math.round(((uploaded / totalSize) * 0.3 + (downloaded / totalSize) * 0.7) * 100)
                if (onProgress) onProgress(progress)
            },
        })

        return res
    } catch (err) {
        throw err
    }
}

export const getColorfulness = async (file: File) => {
    try {
        const formData = new FormData()
        formData.append("file", file)

        const url = `${appConfigs.API_URL}/colorfulness`

        const res = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        return res.data
    } catch (err) {
        throw err
    }
}

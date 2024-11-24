import axios from "axios"

import { appConfigs } from "@/utils/constants"

export const colorize = async (file: File) => {
    try {
        const formData = new FormData()
        formData.append("file", file)

        const url = `${appConfigs.API_URL}/colorize`
        const res = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
        })
        return res
    } catch (err) {
        throw err
    }
}

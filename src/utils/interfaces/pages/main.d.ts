interface IMainPageState {
    previewInputImage: string
    previewOutputImage: string
    progress: number
    mode: string
    file: File | null
    loading: boolean
    outputFile: File | null
    outputBlob: Blob | null
    outputScore?: number
}

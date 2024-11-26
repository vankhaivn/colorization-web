interface IMainPageState {
    previewInputImage: string
    previewOutputImage: string
    progress: number
    mode: string
    file: File | null
    loading: boolean
    outputBlob: Blob | null
}

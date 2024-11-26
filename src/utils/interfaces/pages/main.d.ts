interface IMainPageState {
    previewInputImage: string
    previewOutputImage: string
    progress: number
    task: string
    file: File | null
    loading: boolean
    outputBlob: Blob | null
}

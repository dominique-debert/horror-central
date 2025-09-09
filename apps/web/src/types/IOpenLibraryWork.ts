export interface IOpenLibraryWork {
  key: string
  title: string
  authors?: Array<{
    author: {
      key: string
    }
  }>
  first_publish_date?: string
  covers?: number[]
  description?: string | { type: string; value: string }
  subjects?: string[]
}
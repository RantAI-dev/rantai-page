export interface BookLibraryProps {
  readonly books: readonly Book[]
}

export interface Book {
  code: string
  name: string
  imageUrl: string
  category: string
  url?: string
}

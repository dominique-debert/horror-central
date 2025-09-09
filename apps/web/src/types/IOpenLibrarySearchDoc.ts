export interface IOpenLibrarySearchDoc {
  key: string
  type: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  isbn?: string[]
  subject?: string[]
  publisher?: string[]
  publish_year?: number[]
  number_of_pages_median?: number
  ratings_average?: number
  ratings_count?: number
  want_to_read_count?: number
  already_read_count?: number
  currently_reading_count?: number
  readinglog_count?: number
  edition_count?: number
  language?: string[]
  id_goodreads?: string[]
  id_librarything?: string[]
}
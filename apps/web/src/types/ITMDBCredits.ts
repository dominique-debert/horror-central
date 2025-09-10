export interface ITMDBCredits {
  cast: Array<{
    id: number
    name: string
    character: string
    profile_path: string | null
  }>
  crew: Array<{
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }>
}
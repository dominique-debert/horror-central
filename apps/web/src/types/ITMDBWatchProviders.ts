export interface ITMDBWatchProviders {
  results: {
    [countryCode: string]: {
      link: string
      flatrate?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      rent?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      buy?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      ads?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
    }
  }
}
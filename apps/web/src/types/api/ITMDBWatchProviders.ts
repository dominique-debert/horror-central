export interface ITMDBWatchProvider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export interface ITMDBWatchProviderRegion {
  link?: string
  flatrate?: ITMDBWatchProvider[]
  rent?: ITMDBWatchProvider[]
  buy?: ITMDBWatchProvider[]
  ads?: ITMDBWatchProvider[]
}

export interface ITMDBWatchProvidersResponse {
  id: number
  results: Record<string, ITMDBWatchProviderRegion>
}

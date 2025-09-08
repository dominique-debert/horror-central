const API_URL = 'https://api.themoviedb.org/3';

if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
  throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not defined');
}

export async function fetchFromTMDB<T>(
  endpoint: string, 
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  
  // Add API key and other params
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB API key is not configured');
  }
  
  searchParams.set('api_key', apiKey);
  searchParams.set('language', 'en-US');
  
  // Add additional params
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value.toString());
    }
  }

  const url = `${API_URL}${endpoint}?${searchParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('TMDB API Error:', error);
    throw new Error(error.status_message || 'Failed to fetch from TMDB API');
  }

  return response.json();
}

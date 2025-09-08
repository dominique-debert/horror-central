import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/tmdb';

interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  try {
    if (!id) {
      return NextResponse.json({ error: 'TV show ID is required' }, { status: 400 });
    }

    // Use the tmdbClient to fetch videos
    const data = await tmdbClient.getTVVideos(parseInt(id));
    
    // Filter for YouTube trailers only
    const videos = data.results.filter(
      (video: TMDBVideo) => 
        video.site === 'YouTube' && 
        video.type === 'Trailer' &&
        video.official === true
    );

    return NextResponse.json({ id: data.id, results: videos });
  } catch (error) {
    console.error('Error fetching TV show videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV show videos' },
      { status: 500 }
    );
  }
}

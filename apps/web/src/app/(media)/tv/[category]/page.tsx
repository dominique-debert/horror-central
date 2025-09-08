import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaPagination } from '@/components/MediaPagination';
import { getTVShows } from '@/lib/tmdb/tv';

type TVCategory = 'popular' | 'airing-today' | 'on-the-air' | 'top-rated';

const validCategories = ['popular', 'airing-today', 'on-the-air', 'top-rated'] as const;

type TVCategoryPageProps = {
  params: { category: string };
  searchParams: { page?: string };
};

const getTitleFromCategory = (category: string): string => {
  const titles: Record<TVCategory, string> = {
    'airing-today': 'Airing Today',
    'on-the-air': 'On TV',
    'top-rated': 'Top Rated',
    'popular': 'Popular',
  };
  return titles[category as TVCategory] || 'TV Shows';
};

export async function generateMetadata({
  params,
}: TVCategoryPageProps): Promise<Metadata> {
  const category = params.category as TVCategory;
  const title = getTitleFromCategory(category);

  return {
    title: `${title} TV Shows | FreakyHub`,
    description: `Browse ${title} TV Shows on FreakyHub`,
  };
}

export default async function TVCategoryPage({
  params,
  searchParams,
}: TVCategoryPageProps) {
  const category = params.category as TVCategory;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  if (!validCategories.includes(category as TVCategory)) {
    notFound();
  }

  // Convert the category to the correct type expected by getTVShows
  const tvListType = category.replace(/-/g, '_') as 'popular' | 'airing_today' | 'on_the_air' | 'top_rated';
  const data = await getTVShows(tvListType, page);
  const title = getTitleFromCategory(category);
  
  // Debug logging
  console.log('TV Shows Data:', {
    category,
    tvListType,
    page,
    resultsCount: data?.results?.length,
    firstItem: data?.results?.[0],
    totalPages: data?.total_pages
  });

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">{title} TV Shows</h1>
      </div>
      <MediaGrid items={data.results} mediaType="tv" />
      <MediaPagination
        currentPage={page}
        totalPages={data.total_pages}
        basePath={`/tv/${category}`}
      />
    </div>
  );
}

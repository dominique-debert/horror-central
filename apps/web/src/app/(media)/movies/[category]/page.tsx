import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MediaGrid } from '@/components/MediaGrid';
import { MediaPagination } from '@/components/MediaPagination';
import { getMovies } from '@/lib/tmdb/movies';
import type { IMovieCategoryPageProps } from '@/types/components/IMovieCategoryPageProps';

const validCategories = ['popular', 'now-playing', 'top-rated', 'upcoming'];

export async function generateMetadata({
  params,
}: IMovieCategoryPageProps): Promise<Metadata> {
  // Ensure we're working with the latest params
  const { category } = await params;
  
  if (!validCategories.includes(category)) {
    return {
      title: 'Page Not Found | FreakyHub',
      description: 'The requested page could not be found.',
    };
  }

  const title = `${category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')} Movies`;

  return {
    title: `${title} | FreakyHub`,
    description: `Browse ${title} on FreakyHub`,
    openGraph: {
      title: `${title} | FreakyHub`,
      description: `Browse ${title} on FreakyHub`,
      type: 'website',
    },
  };
}

export default async function MovieCategoryPage({
  params,
  searchParams,
}: IMovieCategoryPageProps) {
  // Ensure we're working with the latest params
  const { category } = await params;
  const page = Number((await searchParams).page) || 1;

  if (!validCategories.includes(category)) {
    notFound();
  }

  let data;
  try {
    data = await getMovies(category, page);
  } catch (error) {
    console.error(`Failed to fetch ${category} movies:`, error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Movies
        </h1>
        <div className="text-red-500">
          Failed to load {category} movies. Please try again later.
        </div>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Movies
        </h1>
        <p>No movies found in this category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">
          {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Movies
        </h1>
      </div>
      <MediaGrid items={data.results} mediaType="movie" />
      {data.total_pages > 1 && (
        <MediaPagination
          currentPage={page}
          totalPages={data.total_pages}
          basePath={`/movies/${category}`}
        />
      )}
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { MediaItem } from '@/types/media';

interface MediaGridProps {
  items: MediaItem[];
  mediaType: 'movie' | 'tv';
}

export function MediaGrid({ items, mediaType }: MediaGridProps) {
  if (!items || items.length === 0) {
    console.warn('No items found in MediaGrid');
    return <div className="text-center py-12">No items found</div>;
  }

  // Filter out items without required data
  const validItems = items.filter(item => {
    const isValid = item && item.id && (item.poster_path || item.backdrop_path);
    if (!isValid) {
      console.warn('Invalid item in MediaGrid:', item);
    }
    return isValid;
  });

  if (validItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No valid items to display</p>
        <p className="text-sm text-gray-500 mt-2">
          Check the console for details about the invalid items
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {validItems.map((item) => (
        <Link
          key={item.id}
          href={`/details/${mediaType}/${item.id}`}
          className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <Image
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : '/placeholder.svg'
            }
            alt={item.title || item.name || 'Media poster'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div>
              <h3 className="font-semibold text-white line-clamp-2">
                {item.title || item.name}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-300">
                <span>{item.vote_average?.toFixed(1)}</span>
                <span className="mx-2">•</span>
                <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
        </div>
      </div>
    </div>
  );
}

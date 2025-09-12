import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface MediaPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export function MediaPagination({
  currentPage,
  totalPages,
  basePath,
  className = '',
}: MediaPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    return `${basePath}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PageButton key={1} page={1} url={getPageUrl(1)} />
      );
      if (startPage > 2) {
        pages.push(
          <Button
            key="start-ellipsis"
            variant="ghost"
            size="icon"
            className="pointer-events-none"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          page={i}
          url={getPageUrl(i)}
          isActive={i === currentPage}
        />
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <Button
            key="end-ellipsis"
            variant="ghost"
            size="icon"
            className="pointer-events-none"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      }
      pages.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          url={getPageUrl(totalPages)}
        />
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center mt-10 mb-8 space-x-2 ${className}`}>
      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <Link href={getPageUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {renderPageNumbers()}
      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <Link href={getPageUrl(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function PageButton({
  page,
  url,
  isActive = false,
}: {
  page: number;
  url: string;
  isActive?: boolean;
}) {
  return (
    <Button
      asChild
      variant={isActive ? 'default' : 'ghost'}
      size="icon"
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Page ${page}`}
    >
      <Link href={url}>{page}</Link>
    </Button>
  );
}

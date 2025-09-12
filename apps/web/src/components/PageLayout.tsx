import { ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { SearchAndFilter } from './SearchAndFilter';

type PageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedGenre?: string;
  onGenreChange?: (value: string) => void;
  selectedYear?: string;
  onYearChange?: (value: string) => void;
  selectedType?: 'all' | 'movie' | 'tv';
  onTypeChange?: (value: 'all' | 'movie' | 'tv') => void;
  sortBy?: 'date' | 'title' | 'score';
  onSortByChange?: (value: 'date' | 'title' | 'score') => void;
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange?: (value: 'asc' | 'desc') => void;
  availableGenres?: string[];
  availableYears?: string[];
  showFilters?: boolean;
  onToggleFilters?: () => void;
  className?: string;
  action?: ReactNode;
};

export function PageLayout({
  title,
  description,
  children,
  searchTerm = '',
  onSearchChange,
  selectedGenre = '',
  onGenreChange,
  selectedYear = '',
  onYearChange,
  selectedType = 'all',
  onTypeChange,
  sortBy = 'date',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderChange,
  availableGenres = [],
  availableYears = [],
  showFilters = false,
  onToggleFilters,
  className = '',
  action,
}: PageLayoutProps) {
  return (
    <div className="container mt-8 px-6">
      <div className={`text-white ${className}`}>
        <div className="px-0">
          <PageHeader title={title} description={description} action={action} />
          
          {(onSearchChange || onGenreChange || onYearChange || onTypeChange || onSortByChange) && (
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={onSearchChange || (() => {})}
              selectedGenre={selectedGenre}
              onGenreChange={onGenreChange || (() => {})}
              selectedYear={selectedYear}
              onYearChange={onYearChange || (() => {})}
              selectedType={selectedType}
              onTypeChange={onTypeChange || (() => {})}
              sortBy={sortBy}
              onSortByChange={onSortByChange || (() => {})}
              sortOrder={sortOrder}
              onSortOrderChange={onSortOrderChange || (() => {})}
              availableGenres={availableGenres}
              availableYears={availableYears}
              showFilters={showFilters}
              onToggleFilters={onToggleFilters}
              className=""
            />
          )}

          <main className="mt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

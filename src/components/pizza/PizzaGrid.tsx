/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Pizza as PizzaIcon, ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectFilteredPizzas, selectPizzaFilters } from '../../store/selectors';
import { PizzaCard } from './PizzaCard';
import { Button, PizzaGridSkeleton } from '../ui';
import { useInfiniteScroll } from '../../hooks';

// Number of pizzas to show per page
const ITEMS_PER_PAGE = 6;

type PaginationMode = 'loadMore' | 'infiniteScroll' | 'none';

interface PizzaGridProps {
  /** Initial number of items to show (default: 6) */
  initialItemsToShow?: number;
  /** Number of items to load on each "Load More" click */
  itemsPerLoad?: number;
  /** Show loading skeleton on initial load */
  showLoadingSkeleton?: boolean;
  /** Pagination mode: 'loadMore', 'infiniteScroll', or 'none' */
  paginationMode?: PaginationMode;
}

/**
 * Grid display of pizza cards with pagination options
 * - Supports "Load More" button pagination
 * - Supports Infinite Scroll pagination
 * - Shows limited items initially for better performance
 * - Resets when filters change
 */
export const PizzaGrid: React.FC<PizzaGridProps> = ({
  initialItemsToShow = ITEMS_PER_PAGE,
  itemsPerLoad = ITEMS_PER_PAGE,
  showLoadingSkeleton = false,
  paginationMode = 'loadMore',
}) => {
  const allPizzas = useAppSelector(selectFilteredPizzas);
  const filters = useAppSelector(selectPizzaFilters);

  // Track previous filters for comparison
  const prevFiltersRef = useRef(filters);

  // Number of items currently visible
  const [visibleCount, setVisibleCount] = useState(initialItemsToShow);
  const [isLoading, setIsLoading] = useState(false);

  // Reset visible count when filters change
  useEffect(() => {
    // Only reset if filters actually changed (not initial mount)
    if (prevFiltersRef.current !== filters) {
      prevFiltersRef.current = filters;
      setVisibleCount(initialItemsToShow);
    }
  }, [filters, initialItemsToShow]);

  // Get pizzas to display (limited by visibleCount)
  const visiblePizzas = paginationMode === 'none' ? allPizzas : allPizzas.slice(0, visibleCount);
  const hasMore = visibleCount < allPizzas.length;
  const remainingCount = allPizzas.length - visibleCount;

  // Handle load more with simulated loading
  const handleLoadMore = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerLoad, allPizzas.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, itemsPerLoad, allPizzas.length]);

  // Handle show all
  const handleShowAll = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(allPizzas.length);
      setIsLoading(false);
    }, 300);
  };

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    onLoadMore: handleLoadMore,
    isLoading,
    enabled: paginationMode === 'infiniteScroll',
    threshold: 300,
  });

  // Show skeleton while initially loading
  if (showLoadingSkeleton && allPizzas.length === 0) {
    return <PizzaGridSkeleton count={initialItemsToShow} />;
  }

  // Empty state
  if (allPizzas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
          <PizzaIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No pizzas found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Try adjusting your filters or search terms to find the perfect pizza for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pizza grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePizzas.map((pizza, index) => (
          <PizzaCard key={pizza.id} pizza={pizza} index={index} />
        ))}
      </div>

      {/* Load more section */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {visibleCount} of {allPizzas.length} pizzas
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load More ({Math.min(itemsPerLoad, remainingCount)})
                </>
              )}
            </Button>

            {remainingCount > itemsPerLoad && (
              <Button variant="ghost" onClick={handleShowAll} disabled={isLoading}>
                Show All ({allPizzas.length})
              </Button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${(visibleCount / allPizzas.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {paginationMode === 'infiniteScroll' && hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading more pizzas...</span>
            </div>
          )}
        </div>
      )}

      {/* All items loaded message */}
      {!hasMore && allPizzas.length > initialItemsToShow && paginationMode !== 'none' && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✓ Showing all {allPizzas.length} pizzas
          </p>
        </div>
      )}
    </div>
  );
};

export default PizzaGrid;

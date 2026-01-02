import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Callback to load more items */
  onLoadMore: () => void;
  /** Whether currently loading */
  isLoading: boolean;
  /** Whether infinite scroll is enabled */
  enabled?: boolean;
  /** Threshold in pixels from bottom to trigger load */
  threshold?: number;
}

interface UseInfiniteScrollReturn {
  /** Ref to attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for infinite scroll functionality
 * Uses Intersection Observer for efficient scroll detection
 *
 * Usage:
 * const { sentinelRef } = useInfiniteScroll({
 *   hasMore,
 *   onLoadMore: handleLoadMore,
 *   isLoading,
 *   enabled: true,
 * });
 *
 * return (
 *   <>
 *     {items.map(item => <Item key={item.id} />)}
 *     <div ref={sentinelRef} /> // Sentinel element
 *   </>
 * );
 */
export function useInfiniteScroll({
  hasMore,
  onLoadMore,
  isLoading,
  enabled = true,
  threshold = 200,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoized load handler
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  // Set up Intersection Observer
  useEffect(() => {
    if (!enabled || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, handleIntersection, threshold]);

  return {
    sentinelRef,
  };
}

export default useInfiniteScroll;

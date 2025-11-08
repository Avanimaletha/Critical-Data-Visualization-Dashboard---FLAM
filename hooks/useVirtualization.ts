'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { VirtualizedItem } from '@/lib/types';

interface UseVirtualizationOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualizationOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const { visibleRange, virtualItems, totalHeight } = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

    const visibleStart = Math.max(0, startIndex - overscan);
    const visibleEnd = Math.min(itemCount, endIndex + overscan);

    const items: VirtualizedItem[] = [];
    for (let i = visibleStart; i < visibleEnd; i++) {
      items.push({
        index: i,
        offset: i * itemHeight,
        size: itemHeight,
      });
    }

    return {
      visibleRange: { start: visibleStart, end: visibleEnd },
      virtualItems: items,
      totalHeight: itemCount * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Scroll to index
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const offset = index * itemHeight;
      setScrollTop(offset);
    },
    [itemHeight]
  );

  return {
    virtualItems,
    totalHeight,
    visibleRange,
    handleScroll,
    scrollToIndex,
  };
}

'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import OptimizedCardItem from './OptimizedCardItem';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface VirtualCardGridProps {
  initialCards?: any[];
  query?: string;
  filters?: Record<string, any>;
}

// Virtual scrolling configuration
const ITEM_HEIGHT = 320; // Approximate height of card item + margin
const BUFFER_SIZE = 5; // Number of items to render outside viewport
const CONTAINER_HEIGHT = 600; // Height of the visible container

export default function VirtualCardGrid({
  initialCards = [],
  query = '',
  filters = {}
}: VirtualCardGridProps) {
  const [cards, setCards] = useState(initialCards);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Calculate visible items for virtual scrolling
  const { visibleItems, startIndex, endIndex } = useMemo(() => {
    const viewportHeight = CONTAINER_HEIGHT;
    const visibleCount = Math.ceil(viewportHeight / ITEM_HEIGHT);

    const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIdx = Math.min(cards.length - 1, startIdx + visibleCount + BUFFER_SIZE * 2);

    const visible = cards.slice(startIdx, endIdx + 1).map((card, index) => ({
      ...card,
      index: startIdx + index,
    }));

    return {
      visibleItems: visible,
      startIndex: startIdx,
      endIndex: endIdx,
    };
  }, [cards, scrollTop]);

  // Intersection Observer for infinite loading
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMoreCards();
    }
  }, [hasMore, loading]);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [observerCallback]);

  const loadMoreCards = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await hearthstoneAPI.searchCards({
        query,
        filters,
        page: page + 1,
        limit: 40, // Load more items for virtual scrolling
      });

      setCards(prev => [...prev, ...result.cards]);
      setPage(prev => prev + 1);
      setHasMore(result.cards.length === 40);
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const cardCounts = useMemo(() => {
    const counts = cards.reduce((acc, card) => {
      const cost = card.cost || 0;
      acc[cost] = (acc[cost] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts)
      .map(cost => parseInt(cost))
      .sort((a, b) => a - b);
  }, [cards]);

  // Performance optimizations
  const maxCount = Math.max(...Object.values(cardCounts.map(cost => cards.filter(c => (c.cost || 0) === cost).length)), 1);

  return (
    <div className="flex-1 p-6">
      {/* Results Header with Performance Stats */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          搜索结果 ({cards.length} 张卡牌)
        </h2>
        {query && (
          <p className="text-gray-400">
            搜索 "{query}" 的结果
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>显示 {visibleItems.length} / {cards.length} 张卡牌</span>
          {startIndex > 0 && <span>从第 {startIndex + 1} 张开始</span>}
          {endIndex < cards.length - 1 && <span>到第 {endIndex + 1} 张</span>}
        </div>
      </div>

      {/* Virtual Scrolling Container */}
      <div
        ref={containerRef}
        className="relative overflow-auto border border-slate-700 rounded-lg"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
        onScroll={handleScroll}
      >
        {/* Spacer for virtual scrolling height */}
        <div style={{ height: `${cards.length * ITEM_HEIGHT}px`, position: 'relative' }}>
          {/* Visible items container */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 absolute"
            style={{
              top: `${startIndex * ITEM_HEIGHT}px`,
              width: '100%',
            }}
          >
            {visibleItems.map((card) => (
              <div
                key={card.id}
                className="transform transition-transform duration-200 hover:scale-105"
                style={{ height: `${ITEM_HEIGHT - 20}px` }}
              >
                <OptimizedCardItem card={card} index={card.index} lazy={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Loading sentinel for intersection observer */}
        <div
          ref={sentinelRef}
          className="absolute bottom-0 left-0 right-0 h-1"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-400">加载中...</span>
        </div>
      )}

      {/* No more items indicator */}
      {!hasMore && cards.length > 0 && (
        <div className="text-center mt-4 text-gray-500">
          已显示全部 {cards.length} 张卡牌
        </div>
      )}

      {/* Empty state */}
      {cards.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Search className="w-12 h-12 mb-4 text-gray-600" />
          <h3 className="text-lg font-medium mb-2">没有找到卡牌</h3>
          <p className="text-sm">尝试调整搜索条件或筛选器</p>
        </div>
      )}

      {/* Performance stats (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-slate-800 rounded text-xs text-gray-400">
          <div>性能统计:</div>
          <div>总卡牌数: {cards.length}</div>
          <div>可见卡牌数: {visibleItems.length}</div>
          <div>渲染范围: {startIndex} - {endIndex}</div>
          <div>内存节省: {((1 - visibleItems.length / cards.length) * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Grid, Loader2, Globe } from 'lucide-react';
import { CardGridItem } from './card-grid-item';
import { CompactCardFilters } from './compact-card-filters';
import { useInfiniteCards, type Card } from '@/hooks/use-infinite-cards';

export function CardGridInfinite() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    rarity: '',
    type: '',
    minCost: 0,
    maxCost: 10
  });
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // 使用 SWR 无限滚动
  const {
    cards,
    isLoading,
    isValidating,
    error,
    hasMore,
    loadMore,
    reset
  } = useInfiniteCards({
    search: searchTerm,
    class: filters.class,
    rarity: filters.rarity,
    type: filters.type,
    minCost: filters.minCost,
    maxCost: filters.maxCost
  });

  // 防抖搜索
  const debouncedSearch = useMemo(() => {
    const timer = setTimeout(() => {
      reset(); // 重置数据以触发新的搜索
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, reset]);

  // 清理防抖定时器
  useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  // 筛选变化时重置数据
  useEffect(() => {
    reset();
  }, [filters, reset]);

  // 无限滚动处理
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000) {
      if (hasMore && !isLoading && !isValidating) {
        loadMore();
      }
    }
  }, [hasMore, isLoading, isValidating, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCardClick = (card: Card) => {
    // TODO: Implement card detail modal or navigation
    console.log('Card clicked:', card);
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      class: '',
      rarity: '',
      type: '',
      minCost: 0,
      maxCost: 10
    });
    setSearchTerm('');
  };

  const hasActiveFilters = useMemo(() => {
    return !!(filters.class || filters.rarity || filters.type || filters.minCost > 0 || filters.maxCost < 10 || searchTerm);
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Filters - Top Fixed */}
      <CompactCardFilters
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 pb-8">
        {/* Card Grid - Full Width */}
        {/* Loading State */}
        {isLoading && cards.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">加载卡牌中...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-600 mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">加载失败: {error.message}</p>
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
            </div>
          </div>
        )}

        {/* Cards Display */}
        {!isLoading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'en' ? `Found ${cards.length}+ cards` : `找到 ${cards.length}+ 张卡牌`}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Grid className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">{language === 'en' ? '5 per row' : '每行 5 张'}</span>
                </div>

                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={language === 'zh' ? 'Switch to English' : '切换到中文'}
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'zh' ? '中文' : 'EN'}
                  </span>
                </button>
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎴</div>
                  <p className="text-gray-600 text-lg mb-2">没有找到符合条件的卡牌</p>
                  <p className="text-gray-500 text-sm">尝试调整筛选条件或搜索关键词</p>
                </div>
              </div>
            ) : (
              <>
                {/* Grid Layout - 5 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                  {cards.map((card) => (
                    <CardGridItem
                      key={card.id}
                      {...card}
                      language={language}
                      onClick={() => handleCardClick(card)}
                    />
                  ))}
                </div>

                {/* Load More Indicator */}
                {(isLoading || isValidating) && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-gray-600">加载更多卡牌...</span>
                  </div>
                )}

                {/* No More Data */}
                {!hasMore && cards.length > 0 && (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <span>已加载所有卡牌</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, FilterOptions, SortOption, HearthstoneClass } from '@/types/hearthstone';
import CardDisplay from './CardDisplay';
import { Search, Filter, SortAsc, Grid, List, Loader2 } from 'lucide-react';

interface CardListProps {
  cards: Card[];
  loading?: boolean;
  error?: string;
  onCardClick?: (card: Card) => void;
  onFiltersChange?: (filters: FilterOptions) => void;
  onSortChange?: (sort: SortOption) => void;
  availableFilters?: {
    classes: HearthstoneClass[];
    rarities: Card['rarity'][];
    types: Card['cardType'][];
    sets: string[];
    mechanics: string[];
  };
  initialFilters?: FilterOptions;
  initialSort?: SortOption;
  showFilters?: boolean;
  showSearch?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  viewMode?: 'grid' | 'list';
  className?: string;
}

export default function CardList({
  cards,
  loading = false,
  error,
  onCardClick,
  onFiltersChange,
  onSortChange,
  availableFilters,
  initialFilters = {},
  initialSort = { field: 'name', direction: 'asc' },
  showFilters = true,
  showSearch = true,
  cardSize = 'medium',
  viewMode = 'grid',
  className = ''
}: CardListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let result = [...cards];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(card =>
        card.name.toLowerCase().includes(query) ||
        card.text.toLowerCase().includes(query) ||
        card.flavorText?.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (filters.classes && filters.classes.length > 0) {
      result = result.filter(card =>
        filters.classes!.some(cls => card.playerClass.slug === cls.slug)
      );
    }

    if (filters.rarities && filters.rarities.length > 0) {
      result = result.filter(card => filters.rarities!.includes(card.rarity));
    }

    if (filters.types && filters.types.length > 0) {
      result = result.filter(card => filters.types!.includes(card.cardType));
    }

    if (filters.costs) {
      result = result.filter(card =>
        card.cost >= filters.costs!.min && card.cost <= filters.costs!.max
      );
    }

    if (filters.mechanics && filters.mechanics.length > 0) {
      result = result.filter(card =>
        filters.mechanics!.some(mechanic =>
          card.mechanics.some(m => m.toLowerCase() === mechanic.toLowerCase())
        )
      );
    }

    if (filters.sets && filters.sets.length > 0) {
      result = result.filter(card => filters.sets!.includes(card.set));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = a[sort.field as keyof Card];
      let bValue: any = b[sort.field as keyof Card];

      // Handle nested properties
      if (sort.field === 'playerClass') {
        aValue = a.playerClass.name;
        bValue = b.playerClass.name;
      }

      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      // Compare based on type
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [cards, searchQuery, filters, sort]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    onSortChange?.(newSort);
  }, [onSortChange]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  const getActiveFilterCount = () => {
    let count = searchQuery.trim() ? 1 : 0;
    if (filters.classes?.length) count++;
    if (filters.rarities?.length) count++;
    if (filters.types?.length) count++;
    if (filters.costs) count++;
    if (filters.mechanics?.length) count++;
    if (filters.sets?.length) count++;
    return count;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-red-500 mb-4">
          <Search className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">加载失败</p>
        </div>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with search and controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="搜索卡牌..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* View mode toggle */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setLocalViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                localViewMode === 'grid'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLocalViewMode('list')}
              className={`p-2 rounded transition-colors ${
                localViewMode === 'list'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [any, any];
                handleSortChange({ field, direction });
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="name-asc">名称 (A-Z)</option>
              <option value="name-desc">名称 (Z-A)</option>
              <option value="cost-asc">费用 (低到高)</option>
              <option value="cost-desc">费用 (高到低)</option>
              <option value="rarity-desc">稀有度</option>
            </select>
          </div>

          {/* Filter button */}
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`relative px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showFilterPanel
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 border border-slate-700 text-gray-300 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && showFilterPanel && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Class filter */}
            {availableFilters?.classes && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">职业</label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {availableFilters.classes.map(cls => (
                    <label key={cls.slug} className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={filters.classes?.some(c => c.slug === cls.slug) || false}
                        onChange={(e) => {
                          const current = filters.classes || [];
                          const updated = e.target.checked
                            ? [...current, cls]
                            : current.filter(c => c.slug !== cls.slug);
                          handleFilterChange({ ...filters, classes: updated });
                        }}
                        className="mr-2 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      {cls.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rarity filter */}
            {availableFilters?.rarities && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">稀有度</label>
                <div className="space-y-1">
                  {availableFilters.rarities.map(rarity => (
                    <label key={rarity} className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={filters.rarities?.includes(rarity as any) || false}
                        onChange={(e) => {
                          const current = filters.rarities || [];
                          const updated = e.target.checked
                            ? [...current, rarity as any]
                            : current.filter(r => r !== rarity);
                          handleFilterChange({ ...filters, rarities: updated });
                        }}
                        className="mr-2 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      {rarity === 'common' ? '普通' :
                       rarity === 'rare' ? '稀有' :
                       rarity === 'epic' ? '史诗' : '传说'}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Type filter */}
            {availableFilters?.types && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
                <div className="space-y-1">
                  {availableFilters.types.map(type => (
                    <label key={type} className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={filters.types?.includes(type as any) || false}
                        onChange={(e) => {
                          const current = filters.types || [];
                          const updated = e.target.checked
                            ? [...current, type as any]
                            : current.filter(t => t !== type);
                          handleFilterChange({ ...filters, types: updated });
                        }}
                        className="mr-2 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      {type === 'minion' ? '随从' :
                       type === 'spell' ? '法术' :
                       type === 'weapon' ? '武器' :
                       type === 'hero' ? '英雄' : '地点'}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Cost filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">费用</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={filters.costs?.min || 0}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    costs: { min: parseInt(e.target.value) || 0, max: filters.costs?.max || 10 }
                  })}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={filters.costs?.max || 10}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    costs: { min: filters.costs?.min || 0, max: parseInt(e.target.value) || 10 }
                  })}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Clear filters button */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              清除所有筛选
            </button>
          </div>
        </div>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          找到 {filteredAndSortedCards.length} 张卡牌
          {searchQuery && ` · 搜索 "${searchQuery}"`}
          {getActiveFilterCount() > 1 && ` · ${getActiveFilterCount() - 1} 个筛选条件`}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mr-3" />
          <span className="text-gray-400">加载中...</span>
        </div>
      )}

      {/* Card grid/list */}
      {!loading && (
        <>
          {filteredAndSortedCards.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">没有找到匹配的卡牌</p>
              <p className="text-gray-500 text-sm mt-2">尝试调整搜索条件或筛选器</p>
            </div>
          ) : (
            <div className={
              localViewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'
                : 'space-y-4'
            }>
              {filteredAndSortedCards.map((card) => (
                <div
                  key={card.id}
                  className={
                    localViewMode === 'grid'
                      ? 'flex justify-center'
                      : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition-all'
                  }
                >
                  {localViewMode === 'grid' ? (
                    <CardDisplay
                      card={card}
                      size={cardSize}
                      onClick={() => onCardClick?.(card)}
                      showTooltip={true}
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <CardDisplay
                        card={card}
                        size="small"
                        onClick={() => onCardClick?.(card)}
                        showTooltip={false}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{card.name}</h3>
                        <p className="text-sm text-gray-400">
                          {card.cost} 法力 • {card.playerClass.name} • {card.cardType}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {card.text.replace(/<[^>]*>/g, '')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
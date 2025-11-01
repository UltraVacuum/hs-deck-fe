'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchStore } from '@/stores/search-store';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import { Search, Clock, TrendingUp, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Cache for search results and suggestions
const searchCache = new Map<string, any[]>();
const suggestionCache = new Map<string, string[]>();

// Search history persistence
const SEARCH_HISTORY_KEY = 'hearthstone_search_history';
const MAX_HISTORY_ITEMS = 10;

export default function OptimizedSearchHeader() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    suggestions,
    setSuggestions,
    loading,
    setLoading
  } = useSearchStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches] = useState([
    '火球术', '烈日风暴', '死亡之翼', '雷诺·杰克逊', '火车王里诺艾'
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTimeoutRef = useRef<NodeJS.Timeout>();

  // Load search history from localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }, []);

  // Debounced search with caching
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debouncedTimeoutRef.current) {
        clearTimeout(debouncedTimeoutRef.current);
      }

      debouncedTimeoutRef.current = setTimeout(async () => {
        if (searchQuery.trim().length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setLoading(true);
        try {
          // Check cache first
          if (suggestionCache.has(searchQuery)) {
            setSuggestions(suggestionCache.get(searchQuery)!);
            setShowSuggestions(true);
            setLoading(false);
            return;
          }

          // Fetch suggestions from API
          const result = await hearthstoneAPI.getCardSuggestions(searchQuery);
          const suggestions = result.suggestions || [];

          // Cache the results
          suggestionCache.set(searchQuery, suggestions);

          setSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce delay
    },
    [setSuggestions, setLoading]
  );

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  // Handle search submission
  const handleSearch = useCallback((searchQuery: string = localQuery) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setShowSuggestions(false);
    setSuggestions([]);

    // Update search history
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(item => item !== searchQuery)
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(newHistory);
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, [localQuery, setQuery, setSuggestions, searchHistory]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, [handleSearch]);

  // Quick filter buttons for popular classes
  const quickFilters = useMemo(() => [
    { id: 'all', label: '全部', color: 'bg-slate-600 hover:bg-slate-700' },
    { id: 'mage', label: '法师', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'warrior', label: '战士', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'hunter', label: '猎人', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'rogue', label: '潜行者', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'priest', label: '牧师', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'warlock', label: '术士', color: 'bg-purple-800 hover:bg-purple-900' },
    { id: 'druid', label: '德鲁伊', color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'paladin', label: '骑士', color: 'bg-yellow-700 hover:bg-yellow-800' },
    { id: 'shaman', label: '萨满祭司', color: 'bg-blue-700 hover:bg-blue-800' },
  ], []);

  const handleQuickFilter = (filterId: string) => {
    if (filterId === 'all') {
      setFilters({});
    } else {
      setFilters({ ...filters, class: [filterId] });
    }
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="搜索卡牌名称、技能或关键词..."
              className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {loading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      最近搜索
                    </div>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item)}
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    搜索建议
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:bg-slate-700 rounded transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {localQuery.length === 0 && (
                <div className="p-3 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    热门搜索
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item)}
                        className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm text-gray-400 whitespace-nowrap">快速筛选:</span>
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => handleQuickFilter(filter.id)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${filter.color} text-white border-transparent transition-all duration-200 hover:scale-105`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
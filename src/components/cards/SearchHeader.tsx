'use client';

import { useState, useCallback } from 'react';
import { useSearchStore } from '@/stores/search-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import SearchSuggestions from './SearchSuggestions';

const QUICK_FILTERS = [
  { label: '法师', value: 'mage', color: 'bg-blue-500' },
  { label: '术士', value: 'warlock', color: 'bg-purple-500' },
  { label: '猎人', value: 'hunter', color: 'bg-green-500' },
  { label: '战士', value: 'warrior', color: 'bg-red-500' },
];

export default function SearchHeader() {
  const { query, setQuery, setFilters } = useSearchStore();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  }, [setQuery]);

  const handleQuickFilter = useCallback((filterValue: string) => {
    setFilters({ class: [filterValue] });
    setShowSuggestions(false);
  }, [setFilters]);

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="搜索卡牌..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-4 py-3 text-lg bg-slate-700 border-slate-600 focus:border-blue-500"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </Button>
          )}

          {/* Search Suggestions */}
          {showSuggestions && (
            <SearchSuggestions
              query={query}
              onSelect={(suggestion) => {
                setQuery(suggestion);
                setShowSuggestions(false);
              }}
            />
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400 mr-2">快速筛选:</span>
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              size="sm"
              onClick={() => handleQuickFilter(filter.value)}
              className={`${filter.color} text-white border-transparent hover:opacity-80`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
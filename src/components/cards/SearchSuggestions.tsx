'use client';

import { useState, useEffect } from 'react';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import { Sparkles } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
}

export default function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const result = await hearthstoneAPI.searchCards({
          query,
          limit: 5
        });

        const cardNames = result.cards.map((card: any) => card.name);
        setSuggestions(cardNames);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (suggestions.length === 0 && !loading) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-50">
      {loading ? (
        <div className="p-3 text-center text-gray-400">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="py-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
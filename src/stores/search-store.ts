import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface SearchState {
  query: string;
  filters: Record<string, any>;
  results: any[];
  loading: boolean;
  page: number;
  suggestions: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setResults: (results: any[]) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setSuggestions: (suggestions: string[]) => void;
}

export const useSearchStore = create<SearchState>()(
  subscribeWithSelector((set, get) => ({
    query: '',
    filters: {},
    results: [],
    loading: false,
    page: 1,
    suggestions: [],

    setQuery: (query) => set({ query }),

    setFilters: (filters) => set({ filters }),

    setResults: (results) => set({ results }),

    setLoading: (loading) => set({ loading }),

    setPage: (page) => set({ page }),

    setSuggestions: (suggestions) => set({ suggestions }),
  }))
);
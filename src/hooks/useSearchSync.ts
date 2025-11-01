'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/stores/search-store';

export function useSearchSync() {
  const searchParams = useSearchParams();
  const { setQuery, setFilters, setPage } = useSearchStore();

  useEffect(() => {
    // Sync from URL to store
    const query = searchParams?.get('q') || '';
    const page = parseInt(searchParams?.get('page') || '1');

    // Parse filters from URL
    const filters: Record<string, any> = {};
    searchParams?.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        filters[filterKey] = value.split(',');
      }
    });

    setQuery(query);
    setFilters(filters);
    setPage(page);
  }, [searchParams, setQuery, setFilters, setPage]);
}
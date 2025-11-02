import { useState, useCallback } from 'react';
import useSWR, { SWRConfig } from 'swr';

export interface Card {
  id: string;
  name_zh: string;
  name_en: string | null;
  cost: number | null;
  attack: number | null;
  health: number | null;
  durability: number | null;
  card_class: string;
  type: string;
  rarity: string;
  text_zh: string | null;
  text_en: string | null;
  collectible: boolean;
  imageUrls: {
    orig: string;
    normal: string;
    large: string;
    tile: string;
    render: string;
    renderLarge: string;
  };
}

export interface CardsResponse {
  cards: Card[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UseInfiniteCardsOptions {
  search?: string;
  class?: string;
  rarity?: string;
  type?: string;
  minCost?: number;
  maxCost?: number;
}

const fetcher = async (url: string): Promise<CardsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  return response.json();
};

export function useInfiniteCards(options: UseInfiniteCardsOptions = {}) {
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));

  // 构建查询参数
  const buildQueryParams = useCallback((page: number = 1) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '24', // 每页24张卡牌 (8张 x 3行)
      ...(options.search && { search: options.search }),
      ...(options.class && options.class !== 'all' && { class: options.class }),
      ...(options.rarity && options.rarity !== 'all' && { rarity: options.rarity }),
      ...(options.type && options.type !== 'all' && { type: options.type }),
      ...(options.minCost !== undefined && { minCost: options.minCost.toString() }),
      ...(options.maxCost !== undefined && { maxCost: options.maxCost.toString() }),
    });
    return params.toString();
  }, [options]);

  const getKey = useCallback((pageIndex: number, previousPageData: CardsResponse | null) => {
    // 如果是第一页，总是返回key
    if (pageIndex === 0) {
      return `/api/cards?${buildQueryParams(1)}`;
    }

    // 如果没有更多数据了，返回null
    if (previousPageData && pageIndex * 24 >= previousPageData.pagination.total) {
      return null;
    }

    // 否则返回下一页的key
    return `/api/cards?${buildQueryParams(pageIndex + 1)}`;
  }, [buildQueryParams]);

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    size,
    setSize
  } = useSWRInfinite<CardsResponse>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      refreshInterval: 0,
      onError: (error) => {
        console.error('SWR Error:', error);
      }
    }
  );

  // 将所有页面的数据合并
  const cards: Card[] = data ? data.flatMap(page => page.cards) : [];

  // 计算是否还有更多数据
  const hasMore = data && data.length > 0 ?
    (data[data.length - 1]?.pagination.page || 0) < (data[data.length - 1]?.pagination.totalPages || 0) :
    false;

  // 加载更多数据的函数
  const loadMore = useCallback(() => {
    if (!isLoading && !isValidating && hasMore) {
      setSize(size + 1);
    }
  }, [isLoading, isValidating, hasMore, size, setSize]);

  // 重置数据的函数
  const reset = useCallback(() => {
    setSize(1);
    setLoadedPages(new Set([1]));
  }, [setSize]);

  // 刷新当前数据的函数
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    cards,
    isLoading,
    isValidating,
    error,
    hasMore,
    loadMore,
    reset,
    refresh,
    currentPage: size,
    totalCards: data?.[0]?.pagination.total || 0
  };
}

// 导入 SWRInfinite
import useSWRInfinite from 'swr/infinite';
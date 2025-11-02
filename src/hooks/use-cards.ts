import { useState, useEffect } from 'react';

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

export interface UseCardsOptions {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  rarity?: string;
  type?: string;
  minCost?: number;
  maxCost?: number;
}

export function useCards(options: UseCardsOptions = {}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchCards = async (newOptions: UseCardsOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(newOptions.page || options.page || 1),
        limit: String(newOptions.limit || options.limit || 20),
        ...(newOptions.search || options.search) && { search: newOptions.search || options.search },
        ...(newOptions.class || options.class) && { class: newOptions.class || options.class },
        ...(newOptions.rarity || options.rarity) && { rarity: newOptions.rarity || options.rarity },
        ...(newOptions.type || options.type) && { type: newOptions.type || options.type },
        ...(newOptions.minCost || options.minCost) && { minCost: String(newOptions.minCost || options.minCost) },
        ...(newOptions.maxCost || options.maxCost) && { maxCost: String(newOptions.maxCost || options.maxCost) },
      });

      const response = await fetch(`/api/cards?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data: CardsResponse = await response.json();

      setCards(data.cards);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [options.page, options.limit, options.search, options.class, options.rarity, options.type, options.minCost, options.maxCost]);

  return {
    cards,
    loading,
    error,
    pagination,
    refetch: fetchCards
  };
}
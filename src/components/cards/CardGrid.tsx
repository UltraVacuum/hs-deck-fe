'use client';

import { useState, useMemo } from 'react';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import CardItem from './CardItem';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CardGridProps {
  initialCards?: any[];
  query?: string;
  filters?: Record<string, any>;
}

export default function CardGrid({ initialCards = [], query = '', filters = {} }: CardGridProps) {
  const [cards, setCards] = useState(initialCards);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreCards = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await hearthstoneAPI.searchCards({
        query,
        filters,
        page: page + 1,
        limit: 20,
      });

      setCards(prev => [...prev, ...result.cards]);
      setPage(prev => prev + 1);
      setHasMore(result.cards.length === 20);
    } catch (error) {
      console.error('Error loading more cards:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const maxCount = Math.max(...Object.values(cardCounts.map(cost => cards.filter(c => (c.cost || 0) === cost).length)), 1);

  return (
    <div className="flex-1 p-6">
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          搜索结果 ({cards.length} 张卡牌)
        </h2>
        {query && (
          <p className="text-gray-400">
            搜索 "{query}" 的结果
          </p>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMoreCards}
            disabled={loading}
            variant="outline"
            className="px-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
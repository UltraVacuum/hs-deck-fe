'use client';

import { useState } from 'react';
import { CardPerformance } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import Image from 'next/image';

interface CardItemProps {
  card: any;
}

const RARITY_COLORS = {
  legendary: 'border-orange-500',
  epic: 'border-purple-500',
  rare: 'border-blue-500',
  common: 'border-gray-500',
};

export default function CardItem({ card }: CardItemProps) {
  const [performance, setPerformance] = useState<CardPerformance | null>(null);
  const [imageError, setImageError] = useState(false);

  // Load performance data on mount
  useState(() => {
    const loadPerformance = async () => {
      try {
        const result = await hearthstoneAPI.getCardPerformance(card.id);
        setPerformance(result.performance);
      } catch (error) {
        // Silently fail if performance data not available
      }
    };

    loadPerformance();
  });

  const rarityColor = RARITY_COLORS[card.rarity as keyof typeof RARITY_COLORS] || 'border-gray-500';

  return (
    <div className={`bg-white rounded-lg overflow-hidden border-2 ${rarityColor} hover:shadow-lg transition-shadow cursor-pointer`}>
      {/* Card Image */}
      <div className="relative aspect-[2.6/3.6] bg-gray-800">
        {!imageError && card.image ? (
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center p-4">
              <div className="text-lg font-bold mb-2">{card.name}</div>
              <div className="text-sm">{card.cost} 费用</div>
            </div>
          </div>
        )}

        {/* Cost Badge */}
        <div className="absolute top-2 left-2 bg-gray-900/90 rounded px-2 py-1">
          <span className="text-white font-bold text-sm">{card.cost}</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 space-y-2 bg-white">
        <h3 className="text-gray-900 font-semibold text-sm truncate" title={card.name}>
          {card.name}
        </h3>

        {/* Performance Metrics */}
        {performance && performance.gamesPlayed > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">携带率</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-900 font-medium">
                  {performance.deckInclusionRate.toFixed(1)}%
                </span>
                {performance.popularityChange !== 0 && (
                  performance.popularityChange > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">胜率</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-900 font-medium">
                  {performance.playedWinrate.toFixed(1)}%
                </span>
                {performance.winrateChange !== 0 && (
                  performance.winrateChange > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rarity and Class */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 capitalize">{card.rarity}</span>
          <span className="text-gray-400 capitalize">{card.playerClass}</span>
        </div>
      </div>
    </div>
  );
}
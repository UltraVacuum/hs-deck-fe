'use client';

import { useMemo } from 'react';
import { Deck } from '@/types/hearthstone';

interface ManaCurveProps {
  deck: Deck;
  className?: string;
}

export default function ManaCurve({ deck, className = '' }: ManaCurveProps) {
  const manaCurve = useMemo(() => {
    const curve = Array(8).fill(0); // 0-7+ mana

    deck.cards?.forEach(card => {
      const mana = Math.min(card.card.cost, 7);
      curve[mana] += card.count;
    });

    const maxCount = Math.max(...curve);

    return curve.map((count, mana) => ({
      mana,
      count,
      percentage: maxCount > 0 ? (count / maxCount) * 100 : 0
    }));
  }, [deck.cards]);

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <h4 className="text-lg font-semibold text-white mb-3">法力曲线</h4>

      <div className="flex items-end justify-between h-24 gap-1">
        {manaCurve.map(({ mana, count, percentage }) => (
          <div key={mana} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-slate-700 rounded-t relative flex-1 flex items-end">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300"
                style={{ height: `${percentage}%` }}
              />
              {count > 0 && (
                <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {mana === 7 ? '7+' : mana}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
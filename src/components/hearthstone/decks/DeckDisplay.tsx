'use client';

import { useState, useEffect } from 'react';
import { Deck, DeckMatchup } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import useDeckCopy from '@/hooks/useDeckCopy';
import ManaCurve from './ManaCurve';
import {
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DeckDisplayProps {
  deck: Deck;
  format?: 'standard' | 'wild' | 'classic' | 'twist';
  className?: string;
}

export default function DeckDisplay({
  deck,
  format = 'standard',
  className = ''
}: DeckDisplayProps) {
  const [matchups, setMatchups] = useState<DeckMatchup[]>([]);
  const [loading, setLoading] = useState(true);
  const { copyDeck, isCopying, copySuccess } = useDeckCopy();

  useEffect(() => {
    const loadMatchups = async () => {
      try {
        const data = await hearthstoneAPI.getDeckMatchups(deck.id, format);
        setMatchups(data.matchups || []);
      } catch (error) {
        console.error('Error loading deck matchups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (deck.id) {
      loadMatchups();
    }
  }, [deck.id, format]);

  const handleCopyDeck = async () => {
    await copyDeck(deck);
  };

  const totalDust = deck.cards?.reduce((sum, card) => {
    return sum + (card.count * (card.card.rarity === 'legendary' ? 1600 : card.card.rarity === 'epic' ? 400 : card.card.rarity === 'rare' ? 100 : 40));
  }, 0) || 0;

  const totalCards = deck.cards?.length || 0;
  const avgManaCost = totalCards > 0
    ? (deck.cards?.reduce((sum, card) => sum + (card.card.cost * card.count), 0) || 0) / totalCards
    : 0;

  return (
    <div className={`bg-slate-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{deck.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                {deck.class?.name}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                {deck.stats?.winRate?.toFixed(1) || 'N/A'}% 胜率
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-blue-500" />
                {totalDust.toLocaleString()} 尘
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyDeck}
            disabled={isCopying || !deck.deckCode}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              copySuccess
                ? 'bg-green-600 text-white'
                : isCopying
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {copySuccess ? (
              <>
                <Check className="w-5 h-5" />
                已复制
              </>
            ) : isCopying ? (
              '复制中...'
            ) : (
              <>
                <Copy className="w-5 h-5" />
                复制卡组
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mana Curve */}
          <ManaCurve deck={deck} />

          {/* Deck Stats */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">卡组统计</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">卡牌数量</span>
                <span className="text-white font-medium">{totalCards} 张</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">平均费用</span>
                <span className="text-white font-medium">
                  {avgManaCost.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">更新时间</span>
                <span className="text-white font-medium">
                  {new Date(deck.updated).toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Matchups */}
        {!loading && matchups.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">对阵分析</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {matchups.map((matchup) => (
                <div key={matchup.id} className="text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: matchup.opponentClass?.color }}
                  />
                  <div className="text-lg font-bold text-white">
                    {matchup.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {matchup.opponentClass?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {matchup.gamesPlayed} 场
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
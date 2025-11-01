'use client';

import { useState, useEffect } from 'react';
import { HearthstoneCard, CardPerformance } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

interface CardAnalysisProps {
  card: HearthstoneCard;
  format?: 'standard' | 'wild' | 'classic' | 'twist';
  timeframe?: '24h' | '7d' | '30d';
  className?: string;
}

export default function CardAnalysis({
  card,
  format = 'standard',
  timeframe = '7d',
  className = ''
}: CardAnalysisProps) {
  const [performance, setPerformance] = useState<CardPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const data = await hearthstoneAPI.getCardPerformance(parseInt(card.id), format, timeframe);
        setPerformance(data.performance);
      } catch (error) {
        console.error('Error loading card performance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, [card.id, format, timeframe]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!performance || performance.gamesPlayed === 0) {
    return (
      <div className={`text-center text-gray-500 py-4 ${className}`}>
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无数据</p>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${className}`}>
      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        数据分析
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Target className="w-3 h-3" />
            卡组携带率
          </div>
          <div className="text-lg font-bold text-white">
            {performance.deckInclusionRate.toFixed(1)}%
          </div>
          {performance.popularityChange !== 0 && (
            <div className="flex items-center gap-1 text-xs">
              {performance.popularityChange > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={performance.popularityChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(performance.popularityChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <TrendingUp className="w-3 h-3" />
            打出胜率
          </div>
          <div className="text-lg font-bold text-white">
            {performance.playedWinrate.toFixed(1)}%
          </div>
          {performance.winrateChange !== 0 && (
            <div className="flex items-center gap-1 text-xs">
              {performance.winrateChange > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={performance.winrateChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(performance.winrateChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <BarChart3 className="w-3 h-3" />
            起手保留率
          </div>
          <div className="text-lg font-bold text-white">
            {performance.mulliganWinrate.toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Target className="w-3 h-3" />
            平均携带
          </div>
          <div className="text-lg font-bold text-white">
            {performance.avgCopiesInDeck.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700">
        <div className="text-xs text-gray-500">
          基于近 {timeframe === '24h' ? '24小时' : timeframe === '7d' ? '7天' : '30天'} 的 {performance.gamesPlayed.toLocaleString()} 场对局数据
        </div>
      </div>
    </div>
  );
}
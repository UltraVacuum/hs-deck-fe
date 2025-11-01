'use client';

import { useMemo } from 'react';
import { DeckCard } from '@/types/hearthstone';
import { cardUtils } from '@/lib/hearthstone-api';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Star,
  Target,
  Zap
} from 'lucide-react';

interface DeckStatsProps {
  cards: DeckCard[];
  className?: string;
}

interface ManaCurveBar {
  cost: number;
  count: number;
  percentage: number;
  color: string;
}

interface RarityDistribution {
  rarity: string;
  count: number;
  color: string;
  icon: string;
}

interface TypeDistribution {
  type: string;
  count: number;
  color: string;
}

export default function DeckStats({ cards, className = '' }: DeckStatsProps) {
  const stats = useMemo(() => cardUtils.getDeckStats(cards), [cards]);

  const manaCurve = useMemo((): ManaCurveBar[] => {
    const curve = cardUtils.getManaCurve(cards);
    const totalCards = cards.reduce((sum, { count }) => sum + count, 0);

    return curve.map((item, index) => {
      let color = 'bg-blue-500';
      if (item.cost <= 3) color = 'bg-green-500';
      else if (item.cost <= 6) color = 'bg-yellow-500';
      else color = 'bg-red-500';

      return {
        cost: item.cost,
        count: item.count,
        percentage: totalCards > 0 ? (item.count / totalCards) * 100 : 0,
        color
      };
    });
  }, [cards]);

  const rarityDistribution = useMemo((): RarityDistribution[] => {
    const distribution = stats.rarityDistribution;
    return Object.entries(distribution).map(([rarity, count]) => {
      let color = 'bg-gray-500';
      let icon = '○';

      switch (rarity) {
        case 'common':
          color = 'bg-gray-500';
          icon = '○';
          break;
        case 'rare':
          color = 'bg-blue-500';
          icon = '◆';
          break;
        case 'epic':
          color = 'bg-purple-500';
          icon = '◈';
          break;
        case 'legendary':
          color = 'bg-amber-500';
          icon = '★';
          break;
      }

      return {
        rarity,
        count,
        color,
        icon
      };
    });
  }, [stats.rarityDistribution]);

  const typeDistribution = useMemo((): TypeDistribution[] => {
    const distribution = stats.typeDistribution;
    return Object.entries(distribution).map(([type, count]) => {
      let color = 'bg-slate-500';

      switch (type) {
        case 'minion':
          color = 'bg-green-600';
          break;
        case 'spell':
          color = 'bg-blue-600';
          break;
        case 'weapon':
          color = 'bg-red-600';
          break;
        case 'hero':
          color = 'bg-purple-600';
          break;
        case 'location':
          color = 'bg-orange-600';
          break;
      }

      return {
        type,
        count,
        color
      };
    });
  }, [stats.typeDistribution]);

  const getPlayStyle = () => {
    const avgCost = stats.avgCost;
    if (avgCost <= 2) return { name: '快攻', color: 'text-red-500', icon: Zap };
    if (avgCost <= 4) return { name: '中速', color: 'text-yellow-500', icon: Target };
    return { name: '控制', color: 'text-blue-500', icon: Clock };
  };

  const playStyle = getPlayStyle();
  const totalCards = cards.reduce((sum, { count }) => sum + count, 0);

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-amber-500" />
        卡组统计
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">卡牌总数</span>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {totalCards}
          </div>
          <div className="text-xs text-gray-500">张卡牌</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">平均费用</span>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.avgCost.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">法力值</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">游戏风格</span>
            <playStyle.icon className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`text-lg font-bold ${playStyle.color}`}>
            {playStyle.name}
          </div>
          <div className="text-xs text-gray-500">风格</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">卡牌种类</span>
            <Star className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(stats.typeDistribution).length}
          </div>
          <div className="text-xs text-gray-500">种类型</div>
        </div>
      </div>

      {/* Mana Curve */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          法力曲线
        </h4>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-end gap-1 h-24">
            {manaCurve.slice(0, 7).map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-16">
                  <span className="text-xs text-gray-400 mb-1">{item.count}</span>
                  <div
                    className={`w-full ${item.color} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${Math.max(item.percentage * 0.6, 2)}px` }}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1">{item.cost}</span>
              </div>
            ))}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-16">
                <span className="text-xs text-gray-400 mb-1">
                  {manaCurve.slice(7).reduce((sum, item) => sum + item.count, 0)}
                </span>
                <div
                  className="w-full bg-red-500 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${Math.max(
                      (manaCurve.slice(7).reduce((sum, item) => sum + item.percentage, 0) / 3) * 0.6,
                      2
                    )}px`
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">7+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity Distribution */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          稀有度分布
        </h4>
        <div className="space-y-2">
          {rarityDistribution.map((item) => (
            <div key={item.rarity} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-24">
                <span className={`w-4 h-4 ${item.color} rounded-full`} />
                <span className="text-sm text-gray-300 capitalize">
                  {item.rarity === 'common' ? '普通' :
                   item.rarity === 'rare' ? '稀有' :
                   item.rarity === 'epic' ? '史诗' : '传说'}
                </span>
              </div>
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-300`}
                  style={{ width: `${(item.count / totalCards) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-8 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Type Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-green-500" />
          卡牌类型分布
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {typeDistribution.map((item) => (
            <div key={item.type} className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {item.type === 'minion' ? '随从' :
                   item.type === 'spell' ? '法术' :
                   item.type === 'weapon' ? '武器' :
                   item.type === 'hero' ? '英雄' : '地点'}
                </span>
                <div className={`w-3 h-3 ${item.color} rounded-full`} />
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {item.count}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((item.count / totalCards) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">卡组分析</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          {stats.avgCost <= 2 && (
            <li>• 这是一个快攻卡组，前期压力很大</li>
          )}
          {stats.avgCost >= 2 && stats.avgCost <= 4 && (
            <li>• 这是一个中速卡组，节奏平衡</li>
          )}
          {stats.avgCost > 4 && (
            <li>• 这是一个控制卡组，注重后期资源</li>
          )}
          {rarityDistribution.find(r => r.rarity === 'legendary')?.count! >= 5 && (
            <li>• 包含较多传说卡牌，可能需要更多资源</li>
          )}
          {typeDistribution.find(t => t.type === 'spell')?.count! > typeDistribution.find(t => t.type === 'minion')?.count! && (
            <li>• 法术数量较多，注重控制和节奏</li>
          )}
          {typeDistribution.find(t => t.type === 'weapon')?.count! > 0 && (
            <li>• 包含武器，需要考虑装备和耐久度</li>
          )}
        </ul>
      </div>
    </div>
  );
}
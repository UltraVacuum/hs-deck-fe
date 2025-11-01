'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Deck, Card, TierRanking, HearthstoneClass } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import CardDisplay from '@/components/hearthstone/cards/CardDisplay';
import { TrendingUp, Eye, Users, Trophy, Clock, ArrowRight, Loader2, Star } from 'lucide-react';

interface TrendingSectionProps {
  initialDecks?: Deck[];
  initialTrendingCards?: Card[];
}

// Mock data for development
const mockTierRankings: TierRanking[] = [
  {
    archetype: 'Control Warlock',
    tier: 'S',
    winRate: 58.5,
    popularity: 15.2,
    gamesPlayed: 1234,
    sampleDeck: {} as Deck,
    class: {
      id: 5,
      name: '术士',
      slug: 'warlock',
      color: '#9482C9',
      heroClass: true,
      standard: true,
      wild: true,
      classic: true
    },
    popularityChange: 2.1,
    winRateChange: 1.5
  },
  {
    archetype: 'Face Hunter',
    tier: 'A',
    winRate: 54.2,
    popularity: 22.8,
    gamesPlayed: 2341,
    sampleDeck: {} as Deck,
    class: {
      id: 3,
      name: '猎人',
      slug: 'hunter',
      color: '#ABD473',
      heroClass: true,
      standard: true,
      wild: true,
      classic: true
    },
    popularityChange: -1.2,
    winRateChange: 0.8
  },
  {
    archetype: 'Miracle Rogue',
    tier: 'A',
    winRate: 52.8,
    popularity: 8.5,
    gamesPlayed: 876,
    sampleDeck: {} as Deck,
    class: {
      id: 7,
      name: '潜行者',
      slug: 'rogue',
      color: '#FFF569',
      heroClass: true,
      standard: true,
      wild: true,
      classic: true
    },
    popularityChange: 3.4,
    winRateChange: 2.1
  }
];

export default function TrendingSection({
  initialDecks = [],
  initialTrendingCards = []
}: TrendingSectionProps) {
  const [tierRankings, setTierRankings] = useState<TierRanking[]>(mockTierRankings);
  const [trendingDecks, setTrendingDecks] = useState<Deck[]>(initialDecks);
  const [trendingCards, setTrendingCards] = useState<Card[]>(initialTrendingCards);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from your API
        // For now, we'll use mock data and some real card data
        const allCards = await hearthstoneAPI.getLegendaryCards();
        const sampleTrendingCards = allCards
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);

        setTrendingCards(sampleTrendingCards);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, [timeframe]);

  const filteredRankings = useMemo(() => {
    if (selectedClass === 'all') return tierRankings;
    return tierRankings.filter(ranking => ranking.class.slug === selectedClass);
  }, [tierRankings, selectedClass]);

  const getTierColor = useCallback((tier: string) => {
    switch (tier) {
      case 'S': return 'from-red-600 to-red-800 text-red-400 border-red-500';
      case 'A': return 'from-amber-600 to-amber-800 text-amber-400 border-amber-500';
      case 'B': return 'from-blue-600 to-blue-800 text-blue-400 border-blue-500';
      case 'C': return 'from-gray-600 to-gray-800 text-gray-600 border-gray-500';
      default: return 'from-gray-700 to-gray-900 text-gray-500 border-gray-600';
    }
  }, []);

  const getWinRateColor = useCallback((winRate: number) => {
    if (winRate >= 55) return 'text-green-500';
    if (winRate >= 52) return 'text-yellow-500';
    if (winRate >= 50) return 'text-orange-500';
    return 'text-red-500';
  }, []);

  const getChangeIndicator = useCallback((change: number) => {
    if (Math.abs(change) < 0.1) return { icon: '—', color: 'text-gray-500' };
    if (change > 0) return { icon: '↑', color: 'text-green-500' };
    return { icon: '↓', color: 'text-red-500' };
  }, []);

  const classes = useMemo(() => hearthstoneAPI.getClasses(), []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">当前热门趋势 | Current Trends</h2>
          </div>
          <p className="text-xl text-gray-700 mb-6">发现最新的主流趋势和制胜策略</p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Timeframe Selector */}
            <div className="flex bg-white border border-gray-200 rounded-lg p-1">
              {[
                { value: '24h', label: '24小时' },
                { value: '7d', label: '7天' },
                { value: '30d', label: '30天' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value as any)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    timeframe === option.value
                      ? 'bg-amber-500 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">职业:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-amber-500"
              >
                <option value="all">全部职业</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.slug}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mr-3" />
            <span className="text-gray-600">加载热门数据...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Tier Rankings */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">分级排名 | Tier Rankings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRankings.map((ranking, index) => (
                  <div
                    key={`${ranking.archetype}-${index}`}
                    className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-6 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    {/* Tier Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 bg-gradient-to-r ${getTierColor(ranking.tier)} border rounded-full font-bold text-sm`}>
                        {ranking.tier} Tier
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Archetype Name */}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{ranking.archetype}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ranking.class.color }}
                      />
                      <span className="text-sm text-gray-700">{ranking.class.name}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getWinRateColor(ranking.winRate)}`}>
                          {ranking.winRate}%
                        </div>
                        <div className="text-xs text-gray-600">胜率</div>
                        {ranking.winRateChange && (
                          <div className={`text-xs mt-1 ${getChangeIndicator(ranking.winRateChange).color}`}>
                            {getChangeIndicator(ranking.winRateChange).icon} {Math.abs(ranking.winRateChange)}%
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {ranking.popularity}%
                        </div>
                        <div className="text-xs text-gray-600">使用率</div>
                        {ranking.popularityChange && (
                          <div className={`text-xs mt-1 ${getChangeIndicator(ranking.popularityChange).color}`}>
                            {getChangeIndicator(ranking.popularityChange).icon} {Math.abs(ranking.popularityChange)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {ranking.gamesPlayed.toLocaleString()} 场
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        标准模式
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 rounded-md hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-semibold">
                        查看卡组
                      </button>
                      <button className="px-3 py-2 bg-blue-600 text-gray-900 rounded-md hover:bg-slate-600 transition-all text-sm">
                        <Trophy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Cards */}
            {trendingCards.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">热门卡牌 | Trending Cards</h3>
                <div className="bg-white/30 backdrop-blur-sm border border-gray-200 rounded-lg p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {trendingCards.map((card) => (
                      <div key={card.id} className="flex flex-col items-center group">
                        <div className="transform hover:scale-110 transition-all">
                          <CardDisplay
                            card={card}
                            size="medium"
                            onClick={() => {
                              // Handle card click
                              console.log('Card clicked:', card.name);
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-900 font-medium truncate w-full">
                            {card.name}
                          </div>
                          <div className="text-xs text-green-400">↑ 热门</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View More Cards */}
                  <div className="text-center mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-gray-900 rounded-lg hover:bg-slate-600 transition-all font-semibold inline-flex items-center gap-2">
                      查看更多热门卡牌
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            想要更详细的分析？
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            访问完整的元分析页面，深入了解当前环境
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold text-lg">
            查看完整元分析
          </button>
        </div>
      </div>
    </section>
  );
}
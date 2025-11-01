'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, MetaSnapshot, TierRanking, HearthstoneClass } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Trophy,
  Clock,
  Users,
  Target,
  Eye,
  Star,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface MetaDashboardProps {
  format?: 'standard' | 'wild' | 'classic' | 'twist';
  timeRange?: '24h' | '7d' | '30d';
  className?: string;
}

export default function MetaDashboard({
  format = 'standard',
  timeRange = '7d',
  className = ''
}: MetaDashboardProps) {
  const [metaSnapshots, setMetaSnapshots] = useState<MetaSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<MetaSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Mock data for development
  useEffect(() => {
    const loadMetaSnapshot = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockSnapshot: MetaSnapshot = {
          id: 'mock-snapshot-1',
          timestamp: new Date(),
          format,
          rankings: [
            {
              archetype: 'Control Warlock',
              tier: 'S',
              winRate: 58.5,
              popularity: 15.2,
              gamesPlayed: 1234,
              sampleDeck: {} as any,
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
              sampleDeck: {} as any,
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
              sampleDeck: {} as any,
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
            },
            {
              archetype: 'Midrange Shaman',
              tier: 'B',
              winRate: 51.5,
              popularity: 12.3,
              gamesPlayed: 1567,
              sampleDeck: {} as any,
              class: {
                id: 8,
                name: '萨满祭司',
                slug: 'shaman',
                color: '#0070DE',
                heroClass: true,
                standard: true,
                wild: true,
                classic: true
              },
              popularityChange: 0.5,
              winRateChange: -0.8
            }
          ],
          popularDecks: [],
          risingCards: [],
          fallingCards: [],
          classDistribution: [
            {
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
              popularity: 22.8,
              winRate: 54.2,
              gamesPlayed: 2341,
              archetypeDistribution: []
            },
            {
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
              popularity: 15.2,
              winRate: 58.5,
              gamesPlayed: 1234,
              archetypeDistribution: []
            }
          ],
          sampleSize: 5000,
          rankRange: 'all'
        };

        setMetaSnapshots([mockSnapshot]);
        setSelectedSnapshot(mockSnapshot);
      } catch (error) {
        console.error('Error loading meta snapshot:', error);
        setError('加载元数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadMetaSnapshot();
  }, [format, timeRange]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'from-red-600 to-red-800 text-red-400';
      case 'A': return 'from-amber-600 to-amber-800 text-amber-400';
      case 'B': return 'from-green-600 to-green-800 text-green-400';
      case 'C': return 'from-blue-600 to-blue-800 text-blue-400';
      default: return 'from-gray-600 to-gray-800 text-gray-400';
    }
  };

  const getTrendIcon = (change: number) => {
    if (Math.abs(change) < 0.1) return <Minus className="w-4 h-4 text-gray-500" />;
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  };

  const getChangeColor = (change: number) => {
    if (Math.abs(change) < 0.1) return 'text-gray-500';
    if (change > 0) return 'text-green-500';
    return 'text-red-500';
  };

  const totalGames = useMemo(() => {
    if (!selectedSnapshot) return 0;
    return selectedSnapshot.rankings.reduce((sum, ranking) => sum + ranking.gamesPlayed, 0);
  }, [selectedSnapshot]);

  const averageWinRate = useMemo(() => {
    if (!selectedSnapshot) return 0;
    const totalGames = selectedSnapshot.rankings.reduce((sum, ranking) => sum + ranking.gamesPlayed, 0);
    const weightedWinRate = selectedSnapshot.rankings.reduce(
      (sum, ranking) => sum + (ranking.winRate * ranking.gamesPlayed),
      0
    );
    return totalGames > 0 ? weightedWinRate / totalGames : 0;
  }, [selectedSnapshot]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mr-3" />
        <span className="text-gray-600">加载元数据...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-12 ${className}`}>
        <div className="text-red-500 mb-4">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">加载失败</p>
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!selectedSnapshot) {
    return (
      <div className={`text-center p-12 ${className}`}>
        <div className="text-gray-500 mb-4">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">暂无元数据</p>
        </div>
        <p className="text-gray-600">该格式的元数据暂不可用</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            元分析仪表板
          </h2>
          <p className="text-gray-600 mt-1">
            {format.toUpperCase()} • {timeRange === '24h' ? '过去24小时' : timeRange === '7d' ? '过去7天' : '过去30天'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={format}
            onChange={(e) => {
              // In a real implementation, this would update the format
              console.log('Format changed to:', e.target.value);
            }}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-amber-500"
          >
            <option value="standard">标准模式</option>
            <option value="wild">狂野模式</option>
            <option value="classic">经典模式</option>
            <option value="twist">轮换模式</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => {
              // In a real implementation, this would update the time range
              console.log('Time range changed to:', e.target.value);
            }}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-amber-500"
          >
            <option value="24h">24小时</option>
            <option value="7d">7天</option>
            <option value="30d">30天</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">总游戏数</span>
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalGames.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">场游戏</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">平均胜率</span>
            <Target className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {averageWinRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">胜率</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">活跃卡组</span>
            <Trophy className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {selectedSnapshot.rankings.length}
          </div>
          <div className="text-xs text-gray-500">个卡组</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">更新时间</span>
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {selectedSnapshot.timestamp.toLocaleDateString('zh-CN')}
          </div>
          <div className="text-xs text-gray-500">
            {selectedSnapshot.timestamp.toLocaleTimeString('zh-CN')}
          </div>
        </div>
      </div>

      {/* Tier Rankings */}
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          分级排名
        </h3>

        <div className="space-y-3">
          {selectedSnapshot.rankings.map((ranking, index) => (
            <div
              key={`${ranking.archetype}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12">
                  <div className={`text-lg font-bold px-2 py-1 bg-gradient-to-r ${getTierColor(ranking.tier)} rounded text-white`}>
                    {ranking.tier}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{ranking.archetype}</h4>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ranking.class.color }}
                    />
                    <span className="text-sm text-gray-600">{ranking.class.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>排名 #{index + 1}</span>
                    <span>•</span>
                    <span>{ranking.gamesPlayed.toLocaleString()} 场</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {ranking.winRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                      {getTrendIcon(ranking.winRateChange || 0)}
                      <span className={getChangeColor(ranking.winRateChange || 0)}>
                        {Math.abs(ranking.winRateChange || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {ranking.popularity.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                      {getTrendIcon(ranking.popularityChange || 0)}
                      <span className={getChangeColor(ranking.popularityChange || 0)}>
                        {Math.abs(ranking.popularityChange || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-500" />
            职业分布
          </h3>

          <div className="space-y-3">
            {selectedSnapshot.classDistribution.map((classData, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: classData.class.color }}
                  />
                  <span className="text-gray-900 font-medium">{classData.class.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {classData.popularity.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {classData.winRate.toFixed(1)}% 胜率
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    ({classData.gamesPlayed.toLocaleString()} 场)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            元数据洞察
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-amber-600 mb-1">🔥 最强职业</h4>
              <p className="text-sm text-gray-700">
                {selectedSnapshot.classDistribution.reduce((prev, current) =>
                  current.winRate > prev.winRate ? current : prev
                ).class.name} 的胜率最高 ({Math.max(...selectedSnapshot.classDistribution.map(c => c.winRate)).toFixed(1)}%)
              </p>
            </div>

            <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-blue-600 mb-1">📊 最受欢迎</h4>
              <p className="text-sm text-gray-700">
                {selectedSnapshot.classDistribution.reduce((prev, current) =>
                  current.popularity > prev.popularity ? current : prev
                ).class.name} 的使用率最高 ({Math.max(...selectedSnapshot.classDistribution.map(c => c.popularity)).toFixed(1)}%)
              </p>
            </div>

            <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-green-600 mb-1">📈 趋势观察</h4>
              <p className="text-sm text-gray-700">
                {selectedSnapshot.rankings
                  .filter(r => (r.popularityChange || 0) > 1)
                  .slice(0, 2)
                  .map(r => r.archetype)
                  .join('、')} 卡组使用率显著上升
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold">
          查看详细分析报告
        </button>
      </div>
    </div>
  );
}
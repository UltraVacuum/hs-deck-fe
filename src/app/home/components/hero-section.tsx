'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Deck, HearthstoneClass } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import CardDisplay from '@/components/hearthstone/cards/CardDisplay';
import { Search, Sparkles, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  featuredDeck?: Deck;
  trendingCards?: Card[];
}

export default function HeroSection({ featuredDeck, trendingCards = [] }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [randomCards, setRandomCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const router = useRouter();

  // Load random cards for hero display
  useEffect(() => {
    const loadRandomCards = async () => {
      try {
        setLoadingCards(true);
        const allCards = await hearthstoneAPI.getAllCards();

        // Get a mix of interesting cards (legendaries, epics, and popular cards)
        const legendaryCards = allCards.filter(card => card.rarity === 'legendary').slice(0, 2);
        const epicCards = allCards.filter(card => card.rarity === 'epic').slice(0, 2);
        const otherCards = allCards.filter(card =>
          card.rarity !== 'legendary' && card.rarity !== 'epic'
        ).sort(() => Math.random() - 0.5).slice(0, 2);

        setRandomCards([...legendaryCards, ...epicCards, ...otherCards]);
      } catch (error) {
        console.error('Error loading random cards:', error);
        setRandomCards([]);
      } finally {
        setLoadingCards(false);
      }
    };

    loadRandomCards();
  }, []);

  // Debounced search
  useEffect(() => {
    const searchCards = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await hearthstoneAPI.searchCards({ query: searchQuery });
        setSearchResults(results.slice(0, 8)); // Limit to 8 results
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchCards, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCardClick = useCallback((card: Card) => {
    router.push(`/cards/${card.id}`);
    setSearchQuery('');
    setShowResults(false);
  }, [router]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  }, [searchQuery, router]);

  const handleClassClick = useCallback((classSlug: string) => {
    router.push(`/decks?class=${classSlug}`);
  }, [router]);

  const handleRandomDeck = useCallback(() => {
    router.push('/deck-builder?random=true');
  }, [router]);

  const handleMetaAnalysis = useCallback(() => {
    router.push('/meta');
  }, [router]);

  const classes = useMemo(() => hearthstoneAPI.getClasses(), []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full opacity-50 blur-sm" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
            炉石传说卡组发现
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Hearthstone Deck Discovery
          </p>
          <p className="text-lg text-gray-600">
            探索新奇卡组，发现无限可能 | Discover Innovative Decks
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索卡牌、卡组或策略... | Search cards, decks, strategies..."
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              搜索
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm border border-blue-300/50 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  搜索中... | Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="flex items-center p-3 hover:bg-gray-100/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <CardDisplay
                          card={card}
                          size="small"
                          showTooltip={false}
                          className="transform-none hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{card.name}</div>
                        <div className="text-sm text-gray-600">
                          {card.cost}法力 • {card.playerClass.name} • {
                            card.cardType === 'minion' ? '随从' :
                            card.cardType === 'spell' ? '法术' :
                            card.cardType === 'weapon' ? '武器' :
                            card.cardType === 'hero' ? '英雄' : '地点'
                          }
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {card.text.replace(/<[^>]*>/g, '')}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ml-2 flex-shrink-0 ${
                        card.rarity === 'legendary' ? 'bg-amber-500' :
                        card.rarity === 'epic' ? 'bg-purple-500' :
                        card.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  未找到结果 | No results found
                </div>
              )}
            </div>
          )}
        </div>

  
        {/* Featured Deck - 热门卡组 */}
        {featuredDeck && (
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-lg p-6 hover:border-blue-300/80 transition-all mb-8">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">热门卡组 | Popular Deck</h3>
            </div>
            <h4 className="text-lg font-semibold text-amber-400 mb-2">{featuredDeck.name}</h4>
            <p className="text-gray-700 mb-4 text-sm line-clamp-3">{featuredDeck.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">{featuredDeck.class.name}</span>
              <span className="text-sm text-green-400">{featuredDeck.stats.winRate}% 胜率</span>
            </div>
            <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-semibold">
              复制卡组代码 | Copy Deck
            </button>
          </div>
        )}

        {/* Three Column Row: Quick Actions, Trending Cards, Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">快速开始</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">立即开始你的炉石之旅</p>
            <div className="space-y-3">
              <button
                onClick={handleRandomDeck}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-900 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm flex items-center group-hover:text-blue-600">
                      🎲 随机卡组生成
                    </div>
                    <div className="text-xs text-gray-500 mt-1">AI智能生成创新卡组</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                </div>
              </button>
              <button
                onClick={handleMetaAnalysis}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-gray-900 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm flex items-center group-hover:text-amber-600">
                      🔥 元数据分析
                    </div>
                    <div className="text-xs text-gray-500 mt-1">实时环境数据与趋势</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all" />
                </div>
              </button>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-gray-900 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm flex items-center group-hover:text-green-600">
                      🏆 锦标赛卡组
                    </div>
                    <div className="text-xs text-gray-500 mt-1">职业选手常用构筑</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </div>

            {/* Stats Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">1.2K+</div>
                  <div className="text-xs text-gray-500">卡组数量</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">8.5K</div>
                  <div className="text-xs text-gray-500">活跃玩家</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Cards */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">卡牌趋势</h3>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">实时更新</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">发现当前环境热门卡牌</p>
            <div className="space-y-3">
              {trendingCards.slice(0, 5).map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="flex items-center p-3 bg-gray-50/60 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-all group"
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
                      <CardDisplay card={card} size="small" showTooltip={false} />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600">{card.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 10 + 5)}%
                      </div>
                      <div className="text-xs text-gray-500">{card.playerClass.name}</div>
                    </div>
                  </div>
                </div>
              ))}
              {trendingCards.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm">暂无热门卡牌数据</div>
                </div>
              )}
            </div>
          </div>

          {/* Featured Cards - 精选卡牌 */}
          {!loadingCards && randomCards.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">精选卡牌</h3>
                </div>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">编辑推荐</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">探索强大的卡牌和策略组合</p>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {randomCards.slice(0, 8).map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="flex items-center p-2 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50 rounded-lg cursor-pointer hover:from-amber-100/70 hover:to-orange-100/70 hover:border-amber-300/70 transition-all group"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="relative">
                        <CardDisplay card={card} size="small" showTooltip={false} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate group-hover:text-amber-600 transition-colors">
                        {card.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          card.rarity === 'legendary' ? 'bg-amber-100 text-amber-700' :
                          card.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                          card.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {card.rarity === 'legendary' ? '传说' :
                           card.rarity === 'epic' ? '史诗' :
                           card.rarity === 'rare' ? '稀有' : '普通'}
                        </span>
                        <span className="text-xs text-gray-500">{card.cost} 法力</span>
                        <span className="text-xs text-gray-400">{card.playerClass.name}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-all transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>

              {/* Card Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center text-xs text-gray-500">
                  <span className="text-amber-600 font-semibold">⭐ 精选</span> 每日更新最强力卡牌
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Class Selection */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">选择职业开始探索 | Choose Your Class</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {classes.map((heroClass) => (
              <button
                key={heroClass.id}
                onClick={() => handleClassClick(heroClass.slug)}
                className="relative group px-4 py-3 bg-gradient-to-br rounded-lg transform transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${heroClass.color}dd, ${heroClass.color}99)`
                }}
              >
                <div className="text-xl mb-1">
                  {heroClass.slug === 'warrior' && '⚔️'}
                  {heroClass.slug === 'mage' && '🔮'}
                  {heroClass.slug === 'hunter' && '🏹'}
                  {heroClass.slug === 'druid' && '🌳'}
                  {heroClass.slug === 'warlock' && '👹'}
                  {heroClass.slug === 'priest' && '✨'}
                  {heroClass.slug === 'rogue' && '🗡️'}
                  {heroClass.slug === 'shaman' && '⚡'}
                  {heroClass.slug === 'paladin' && '⚔️'}
                  {heroClass.slug === 'demonhunter' && '👿'}
                </div>
                <div className="text-white font-semibold text-sm">{heroClass.name}</div>
                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            开始构建你的完美卡组
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            加入数千名玩家，发现最新的卡组策略
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRandomDeck}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold text-lg"
            >
              立即开始
            </button>
            <button
              onClick={handleMetaAnalysis}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg"
            >
              浏览卡组
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
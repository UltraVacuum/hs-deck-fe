'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 简化的卡牌类型定义
interface SimpleCard {
  id: string;
  name: string;
  cost: number;
  cardType: string;
  playerClass: { name: string };
  rarity: string;
  text: string;
}

// 简化的职业类型定义
interface HearthstoneClass {
  id: string;
  slug: string;
  name: string;
  color: string;
}

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SimpleCard[]>([]);
  const router = useRouter();

  // 模拟卡牌搜索
  const handleSearch = () => {
    if (searchQuery.trim().length < 2) return;

    setIsSearching(true);
    setShowResults(true);

    // 模拟搜索结果
    setTimeout(() => {
      const mockResults: SimpleCard[] = [
        {
          id: '1',
          name: '炎爆术',
          cost: 10,
          cardType: 'spell',
          playerClass: { name: '法师' },
          rarity: 'legendary',
          text: '造成10点伤害'
        },
        {
          id: '2',
          name: '弗丁',
          cost: 8,
          cardType: 'minion',
          playerClass: { name: '圣骑士' },
          rarity: 'legendary',
          text: '嘲讽，亡语：装备一把5/2的灰烬使者'
        }
      ];
      setSearchResults(mockResults.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsSearching(false);
    }, 300);
  };

  // 模拟职业数据
  const classes: HearthstoneClass[] = [
    { id: '1', slug: 'warrior', name: '战士', color: '#C79C6E' },
    { id: '2', slug: 'mage', name: '法师', color: '#69CCF0' },
    { id: '3', slug: 'hunter', name: '猎人', color: '#ABD473' },
    { id: '4', slug: 'druid', name: '德鲁伊', color: '#FF7D0A' },
    { id: '5', slug: 'warlock', name: '术士', color: '#9482C9' },
    { id: '6', slug: 'priest', name: '牧师', color: '#FFFFFF' },
    { id: '7', slug: 'rogue', name: '潜行者', color: '#FFF569' },
    { id: '8', slug: 'shaman', name: '萨满祭司', color: '#0070DE' },
    { id: '9', slug: 'paladin', name: '圣骑士', color: '#F58CBA' },
    { id: '10', slug: 'demonhunter', name: '恶魔猎手', color: '#A330C9' }
  ];

  const handleClassClick = (classSlug: string) => {
    router.push(`/decks?class=${classSlug}`);
  };

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
                      className="flex items-center p-3 hover:bg-gray-100/80 rounded-lg cursor-pointer transition-colors"
                      onClick={() => {
                        router.push(`/cards/${card.id}`);
                        setSearchQuery('');
                        setShowResults(false);
                      }}
                    >
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
                          {card.text}
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

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200/60 rounded-lg p-6 hover:border-blue-300/80 transition-all mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900">快速开始</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">立即开始你的炉石之旅</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-900 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all text-left group">
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
            <button className="py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-gray-900 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all text-left group">
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
            <button className="py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-gray-900 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all text-left group">
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
      </div>
    </section>
  );
}
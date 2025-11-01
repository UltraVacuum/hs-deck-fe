'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Deck, HearthstoneClass, FilterOptions } from '@/types/hearthstone';
import { hearthstoneAPI } from '@/lib/hearthstone-api';
import CardDisplay from '@/components/hearthstone/cards/CardDisplay';
import {
  Beaker,
  Lightbulb,
  Shuffle,
  Sparkles,
  Zap,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Loader2,
  Dices
} from 'lucide-react';

interface DiscoveryLabProps {
  onDeckSelect?: (deck: Deck) => void;
  onCardSelect?: (card: Card) => void;
}

export default function DiscoveryLab({ onDeckSelect, onCardSelect }: DiscoveryLabProps) {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [suggestedCards, setSuggestedCards] = useState<Card[]>([]);
  const [randomDecks, setRandomDecks] = useState<Deck[]>([]);
  const [activeTab, setActiveTab] = useState<'synergy' | 'random' | 'combo'>('synergy');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('');
  const [costFilter, setCostFilter] = useState<{ min: number; max: number }>({ min: 0, max: 10 });

  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const cards = await hearthstoneAPI.getAllCards();
        setAllCards(cards);
      } catch (error) {
        console.error('Error loading cards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  // Generate synergy suggestions when selected cards change
  useEffect(() => {
    if (selectedCards.length > 0) {
      generateSynergySuggestions();
    } else {
      setSuggestedCards([]);
    }
  }, [selectedCards]);

  const generateSynergySuggestions = useCallback(async () => {
    if (selectedCards.length === 0) return;

    setLoading(true);
    try {
      // Simple synergy logic - in real implementation this would be more sophisticated
      const suggestions: Card[] = [];

      for (const selectedCard of selectedCards) {
        // Find cards with similar mechanics
        const similarMechanicCards = allCards.filter(card =>
          selectedCard.mechanics.some(mechanic =>
            card.mechanics.includes(mechanic) && card.id !== selectedCard.id
          )
        );

        // Find cards with similar cost
        const similarCostCards = allCards.filter(card =>
          Math.abs(card.cost - selectedCard.cost) <= 1 && card.id !== selectedCard.id
        );

        // Find cards from the same class
        const sameClassCards = allCards.filter(card =>
          card.playerClass.slug === selectedCard.playerClass.slug && card.id !== selectedCard.id
        );

        suggestions.push(...similarMechanicCards.slice(0, 2));
        suggestions.push(...similarCostCards.slice(0, 1));
        suggestions.push(...sameClassCards.slice(0, 1));
      }

      // Remove duplicates and selected cards
      const uniqueSuggestions = Array.from(new Set(suggestions))
        .filter(card => !selectedCards.some(selected => selected.id === card.id))
        .slice(0, 12);

      setSuggestedCards(uniqueSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestedCards([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCards, allCards]);

  const generateRandomDeck = useCallback(() => {
    if (!classFilter) return;

    setLoading(true);
    setTimeout(() => {
      try {
        const classCards = allCards.filter(card => card.playerClass.slug === classFilter);
        const neutralCards = allCards.filter(card => card.playerClass.slug === 'neutral');

        // Create a balanced random deck
        const deckCards: Card[] = [];
        const cardCount = new Map<string, number>();

        // Add some class cards
        const classDeckCards = classCards
          .sort(() => Math.random() - 0.5)
          .slice(0, 15);

        // Add neutral cards
        const neutralDeckCards = neutralCards
          .sort(() => Math.random() - 0.5)
          .slice(0, 15);

        // Combine and ensure 30 cards
        const allDeckCards = [...classDeckCards, ...neutralDeckCards];

        while (allDeckCards.length < 30) {
          const randomCard = [...classCards, ...neutralCards][Math.floor(Math.random() * [...classCards, ...neutralCards].length)];
          allDeckCards.push(randomCard);
        }

        const mockDeck: Deck = {
          id: `random-${Date.now()}`,
          name: `随机${classFilter}卡组`,
          description: '自动生成的随机卡组，可能包含意想不到的组合！',
          class: hearthstoneAPI.getClassBySlug(classFilter) || hearthstoneAPI.getClasses()[0],
          format: 'standard',
          cards: allDeckCards.map(card => ({ card, count: 1 })),
          creator: { id: 'system', name: '随机生成器' } as any,
          stats: {
            gamesPlayed: 0,
            winRate: 50,
            avgGameDuration: 300,
            popularity: 0,
            rank: 0,
            lastUpdated: new Date()
          },
          created: new Date(),
          updated: new Date(),
          isPublic: true,
          tags: ['random', 'fun']
        };

        setRandomDecks([mockDeck]);
      } catch (error) {
        console.error('Error generating random deck:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, [classFilter, allCards]);

  const handleCardSelect = useCallback((card: Card) => {
    if (selectedCards.some(selected => selected.id === card.id)) {
      setSelectedCards(selectedCards.filter(selected => selected.id !== card.id));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
    }
  }, [selectedCards]);

  const handleClearSelection = useCallback(() => {
    setSelectedCards([]);
    setSuggestedCards([]);
  }, []);

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (classFilter && card.playerClass.slug !== classFilter && card.playerClass.slug !== 'neutral') {
        return false;
      }
      if (card.cost < costFilter.min || card.cost > costFilter.max) {
        return false;
      }
      return true;
    });
  }, [allCards, searchQuery, classFilter, costFilter]);

  const classes = useMemo(() => hearthstoneAPI.getClasses(), []);

  if (loading && allCards.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mr-3" />
        <span className="text-gray-600">加载卡牌数据...</span>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Beaker className="w-8 h-8 text-purple-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">卡牌发现实验室 | Card Discovery Lab</h2>
          </div>
          <p className="text-xl text-gray-700 mb-6">探索卡牌协同作用，发现意想不到的组合</p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-1">
              {[
                { id: 'synergy', label: '协同作用', icon: Sparkles },
                { id: 'random', label: '随机卡组', icon: Shuffle },
                { id: 'combo', label: '连击组合', icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-md transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-blue-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Synergy Finder Tab */}
        {activeTab === 'synergy' && (
          <div className="space-y-8">
            {/* Selected Cards */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  选择卡牌 (最多3张)
                </h3>
                {selectedCards.length > 0 && (
                  <button
                    onClick={handleClearSelection}
                    className="px-4 py-2 bg-blue-100 text-gray-700 rounded-md hover:bg-slate-600 transition-colors text-sm"
                  >
                    清除选择
                  </button>
                )}
              </div>

              {/* Selected Cards Display */}
              <div className="min-h-[120px] mb-6">
                {selectedCards.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>选择1-3张卡牌来发现协同作用</p>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4 flex-wrap">
                    {selectedCards.map((card) => (
                      <div key={card.id} className="relative">
                        <CardDisplay
                          card={card}
                          size="medium"
                          onClick={() => handleCardSelect(card)}
                          className="cursor-pointer ring-2 ring-amber-500"
                        />
                        <button
                          onClick={() => handleCardSelect(card)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-gray-900 hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索卡牌..."
                    className="w-full pl-10 pr-4 py-2 bg-blue-100 border border-slate-600 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-blue-100 border border-slate-600 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="">所有职业</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.slug}>{cls.name}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2 bg-blue-100 border border-slate-600 rounded-lg px-4 py-2">
                  <span className="text-gray-600 text-sm">费用:</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={costFilter.min}
                    onChange={(e) => setCostFilter({ ...costFilter, min: parseInt(e.target.value) || 0 })}
                    className="w-12 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-gray-900 text-sm"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={costFilter.max}
                    onChange={(e) => setCostFilter({ ...costFilter, max: parseInt(e.target.value) || 10 })}
                    className="w-12 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Card Selection Grid */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {filteredCards.slice(0, 50).map((card) => (
                    <CardDisplay
                      key={card.id}
                      card={card}
                      size="small"
                      onClick={() => handleCardSelect(card)}
                      isSelectable={true}
                      isSelected={selectedCards.some(selected => selected.id === card.id)}
                      showTooltip={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Cards */}
            {suggestedCards.length > 0 && (
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  推荐协同卡牌
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {suggestedCards.map((card) => (
                    <div key={card.id} className="flex flex-col items-center">
                      <CardDisplay
                        card={card}
                        size="medium"
                        onClick={() => onCardSelect?.(card)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                      />
                      <p className="text-xs text-gray-700 mt-2 text-center truncate w-full">
                        {card.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Random Deck Generator Tab */}
        {activeTab === 'random' && (
          <div className="space-y-8">
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
                <Dices className="w-6 h-6 text-amber-500" />
                随机卡组生成器
              </h3>

              <div className="text-center mb-8">
                <p className="text-gray-700 mb-6">
                  选择一个职业，让AI为你生成一个有趣的随机卡组！
                </p>

                {/* Class Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => setClassFilter(cls.slug)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        classFilter === cls.slug
                          ? 'border-amber-500 bg-amber-500/20'
                          : 'border-slate-600 hover:border-amber-500/50 bg-blue-100/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {cls.slug === 'warrior' && '⚔️'}
                        {cls.slug === 'mage' && '🔮'}
                        {cls.slug === 'hunter' && '🏹'}
                        {cls.slug === 'druid' && '🌳'}
                        {cls.slug === 'warlock' && '👹'}
                        {cls.slug === 'priest' && '✨'}
                        {cls.slug === 'rogue' && '🗡️'}
                        {cls.slug === 'shaman' && '⚡'}
                        {cls.slug === 'paladin' && '⚔️'}
                        {cls.slug === 'demonhunter' && '👿'}
                      </div>
                      <div className="text-gray-900 font-semibold text-sm">{cls.name}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={generateRandomDeck}
                  disabled={!classFilter || loading}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4" />
                      生成随机卡组
                    </>
                  )}
                </button>
              </div>

              {/* Generated Decks */}
              {randomDecks.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">生成的卡组:</h4>
                  {randomDecks.map((deck) => (
                    <div key={deck.id} className="bg-blue-100/50 rounded-lg p-6 border border-slate-600">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold text-gray-900">{deck.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            {deck.cards.length} 张卡牌
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                            {deck.class.name}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{deck.description}</p>

                      {/* Sample Cards */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">部分卡牌预览:</p>
                        <div className="flex gap-2 flex-wrap">
                          {deck.cards.slice(0, 10).map(({ card }) => (
                            <CardDisplay
                              key={card.id}
                              card={card}
                              size="small"
                              showTooltip={true}
                            />
                          ))}
                          {deck.cards.length > 10 && (
                            <div className="flex items-center text-gray-500 text-sm">
                              +{deck.cards.length - 10} 更多
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-amber-500 text-gray-900 rounded-md hover:bg-amber-600 transition-colors text-sm font-semibold">
                          使用此卡组
                        </button>
                        <button className="px-4 py-2 bg-slate-600 text-gray-900 rounded-md hover:bg-slate-500 transition-colors text-sm">
                          重新生成
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Combo Finder Tab */}
        {activeTab === 'combo' && (
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              连击组合探索器
            </h3>
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4">
                这个功能正在开发中！即将推出智能连击组合分析...
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-blue-100 text-gray-600 rounded-lg cursor-not-allowed" disabled>
                  即将推出 | Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
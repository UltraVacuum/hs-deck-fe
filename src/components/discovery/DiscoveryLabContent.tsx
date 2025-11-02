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

export default function DiscoveryLabContent() {
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
        setAllCards(cards.slice(0, 200)); // Limit for performance
      } catch (error) {
        console.error('Failed to load cards:', error);
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

      // Find cards with same class or cost
      selectedCards.forEach(selectedCard => {
        const synergyCards = allCards.filter(card =>
          card.id !== selectedCard.id &&
          !selectedCards.some(selected => selected.id === card.id) &&
          (card.playerClass.id === selectedCard.playerClass.id ||
           card.cost === selectedCard.cost)
        ).slice(0, 3);

        suggestions.push(...synergyCards);
      });

      // Remove duplicates
      const uniqueSuggestions = suggestions.filter((card, index, self) =>
        index === self.findIndex(c => c.id === card.id)
      ).slice(0, 6);

      setSuggestedCards(uniqueSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCards, allCards]);

  const handleCardSelect = useCallback((card: Card) => {
    if (selectedCards.some(selected => selected.id === card.id)) {
      setSelectedCards(selectedCards.filter(selected => selected.id !== card.id));
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, card]);
    }
  }, [selectedCards]);

  const handleGenerateRandomDecks = useCallback(async () => {
    setLoading(true);
    try {
      // Generate random deck ideas
      const classes = hearthstoneAPI.getClasses();
      const randomDeckIdeas = [];

      for (let i = 0; i < 3; i++) {
        const randomClass = classes[Math.floor(Math.random() * classes.length)];

        // Create mock user
        const mockUser = {
          id: 'system-generated',
          name: 'System',
          createdAt: new Date(),
          lastActiveAt: new Date()
        };

        // Create mock stats
        const mockStats = {
          gamesPlayed: 0,
          winRate: 0,
          avgGameDuration: 0,
          popularity: 0,
          rank: 0,
          lastUpdated: new Date()
        };

        const randomDeck: Deck = {
          id: `random-${Date.now()}-${i}`,
          name: `${randomClass.name} 创新卡组 | Innovative ${randomClass.name} Deck`,
          description: `基于最新卡牌协同分析生成的${randomClass.name}创新卡组组合，包含意想不到的策略和打法。| An innovative ${randomClass.name} deck generated based on latest card synergy analysis, featuring unexpected strategies and playstyles.`,
          class: randomClass,
          format: 'standard',
          cards: [],
          creator: mockUser,
          stats: mockStats,
          created: new Date(),
          updated: new Date(),
          isPublic: true,
          tags: ['generated', 'experimental', 'synergy-based']
        };
        randomDeckIdeas.push(randomDeck);
      }

      setRandomDecks(randomDeckIdeas);
      setActiveTab('random');
    } catch (error) {
      console.error('Failed to generate random decks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (card.text && card.text.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesClass = !classFilter || card.playerClass.slug === classFilter;
      const matchesCost = card.cost >= costFilter.min && card.cost <= costFilter.max;

      return matchesSearch && matchesClass && matchesCost;
    });
  }, [allCards, searchQuery, classFilter, costFilter]);

  if (loading && allCards.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
        <span className="text-gray-600">加载卡牌数据... | Loading card data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('synergy')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'synergy'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Beaker className="inline w-4 h-4 mr-2" />
            协同分析 | Synergy Analysis
          </button>
          <button
            onClick={() => setActiveTab('random')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'random'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Dices className="inline w-4 h-4 mr-2" />
            随机生成 | Random Generation
          </button>
          <button
            onClick={() => setActiveTab('combo')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'combo'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Zap className="inline w-4 h-4 mr-2" />
            连招组合 | Combo Builder
          </button>
        </div>
      </div>

      {/* Synergy Analysis Tab */}
      {activeTab === 'synergy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                选择卡牌 | Select Cards
              </h3>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜索卡牌... | Search cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">所有职业 | All Classes</option>
                    {hearthstoneAPI.getClasses().map(cls => (
                      <option key={cls.id} value={cls.slug}>{cls.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                    <span className="text-gray-600 text-sm">费用:</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={costFilter.min}
                      onChange={(e) => setCostFilter(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-12 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={costFilter.max}
                      onChange={(e) => setCostFilter(prev => ({ ...prev, max: parseInt(e.target.value) || 10 }))}
                      className="w-12 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Available Cards */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCards.slice(0, 20).map(card => (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCards.some(selected => selected.id === card.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <CardDisplay card={card} size="small" showTooltip={false} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{card.name}</div>
                      <div className="text-sm text-gray-600">
                        {card.cost} 法力 • {card.playerClass.name}
                      </div>
                    </div>
                    {selectedCards.some(selected => selected.id === card.id) && (
                      <div className="text-blue-600">
                        <Plus className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Cards */}
            {selectedCards.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  已选择卡牌 ({selectedCards.length}/5) | Selected Cards
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {selectedCards.map(card => (
                    <div key={card.id} className="relative group">
                      <CardDisplay card={card} size="small" showTooltip={false} />
                      <button
                        onClick={() => handleCardSelect(card)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                推荐卡牌 | Suggested Cards
              </h3>

              {suggestedCards.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {suggestedCards.map(card => (
                    <div
                      key={card.id}
                      onClick={() => handleCardSelect(card)}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCards.some(selected => selected.id === card.id)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                      }`}
                    >
                      <CardDisplay card={card} size="small" showTooltip={false} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{card.name}</div>
                        <p className="text-xs text-gray-600 mt-1 text-center truncate w-full">
                          {card.playerClass.name} • {card.cost}费
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedCards.length === 0
                    ? "选择卡牌以查看协同建议 | Select cards to see synergy suggestions"
                    : "生成协同建议中... | Generating synergy suggestions..."
                  }
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateRandomDecks}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              生成随机卡组 | Generate Random Decks
            </button>
          </div>
        </div>
      )}

      {/* Random Generation Tab */}
      {activeTab === 'random' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
              <Shuffle className="w-6 h-6 text-purple-600" />
              随机卡组生成器 | Random Deck Generator
            </h3>

            <p className="text-gray-700 mb-8 text-center">
              基于当前环境和卡牌协同分析，生成创新的卡组组合
              <br />
              Generate innovative deck combinations based on current meta and card synergy analysis
            </p>

            {randomDecks.length > 0 ? (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">生成的卡组:</h4>
                {randomDecks.map(deck => (
                  <div key={deck.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{deck.name}</h5>
                    <p className="text-gray-700 mb-4">{deck.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">职业: {deck.class.name}</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold">
                        查看详情 | View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dices className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">点击下方按钮生成随机卡组</p>
                <button
                  onClick={handleGenerateRandomDecks}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold inline-flex items-center gap-2"
                >
                  <Shuffle className="w-5 h-5" />
                  生成卡组 | Generate Decks
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Combo Builder Tab */}
      {activeTab === 'combo' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              连招组合构建器 | Combo Builder
            </h3>

            <p className="text-gray-700 mb-8 text-center">
              创建强大的卡牌连招组合，发现制胜的关键序列
              <br />
              Create powerful card combos and discover winning sequences
            </p>

            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">功能开发中 | Feature in Development</h4>
              <p className="text-gray-600 max-w-md mx-auto">
                连招构建器正在开发中，敬请期待！
                <br />
                Combo builder is currently under development. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
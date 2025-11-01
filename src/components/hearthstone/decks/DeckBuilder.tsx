'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Deck, DeckCard, HearthstoneClass, FilterOptions } from '@/types/hearthstone';
import { hearthstoneAPI, cardUtils } from '@/lib/hearthstone-api';
// import { logger } from '@/lib/logger';
import CardDisplay from '../cards/CardDisplay';
import {
  Plus,
  X,
  Copy,
  Save,
  Download,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';

interface DeckBuilderProps {
  initialDeck?: Deck;
  onSave?: (deck: Partial<Deck>) => void;
  onExport?: (deck: Deck) => void;
  onImport?: (deckCode: string) => void;
  selectedClass?: HearthstoneClass;
  format?: 'standard' | 'wild' | 'classic' | 'twist';
  className?: string;
}

interface ManaCurveData {
  cost: number;
  count: number;
  percentage: number;
}

export default function DeckBuilder({
  initialDeck,
  onSave,
  onExport,
  onImport,
  selectedClass,
  format = 'standard',
  className = ''
}: DeckBuilderProps) {
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Load available cards based on class and format
  useEffect(() => {
    const loadAvailableCards = async () => {
      try {
        let cards: Card[] = [];

        if (selectedClass) {
          // Get class cards and neutral cards
          const [classCards, neutralCards] = await Promise.all([
            hearthstoneAPI.getCardsByClass(selectedClass.slug, format),
            hearthstoneAPI.getCardsByClass('neutral', format)
          ]);
          cards = [...classCards, ...neutralCards];
        } else {
          // Get all cards for the format
          cards = await hearthstoneAPI.getAllCards();
        }

        setAvailableCards(cards.sort((a, b) => a.cost - b.cost));
      } catch (error) {
        // logger.error('Error loading available cards', { error, selectedClass, format });
        console.error('Error loading available cards', error);
        setAvailableCards([]);
      }
    };

    loadAvailableCards();
  }, [selectedClass, format]);

  // Initialize with initial deck if provided
  useEffect(() => {
    if (initialDeck) {
      setDeckCards(initialDeck.cards);
      setDeckName(initialDeck.name);
      setDeckDescription(initialDeck.description || '');
    }
  }, [initialDeck]);

  // Filter available cards based on search and filters
  const filteredAvailableCards = useMemo(() => {
    let filtered = availableCards;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(query) ||
        card.text.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (filters.rarities && filters.rarities.length > 0) {
      filtered = filtered.filter(card => filters.rarities!.includes(card.rarity));
    }

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(card => filters.types!.includes(card.cardType));
    }

    if (filters.costs) {
      filtered = filtered.filter(card =>
        card.cost >= filters.costs!.min && card.cost <= filters.costs!.max
      );
    }

    if (filters.mechanics && filters.mechanics.length > 0) {
      filtered = filtered.filter(card =>
        filters.mechanics!.some(mechanic =>
          card.mechanics.some(m => m.toLowerCase() === mechanic.toLowerCase())
        )
      );
    }

    return filtered;
  }, [availableCards, searchQuery, filters]);

  // Calculate mana curve
  const manaCurve = useMemo((): ManaCurveData[] => {
    const curve = cardUtils.getManaCurve(deckCards);
    const totalCards = deckCards.reduce((sum, { count }) => sum + count, 0);

    return curve.map(item => ({
      ...item,
      percentage: totalCards > 0 ? Math.round((item.count / totalCards) * 100) : 0
    }));
  }, [deckCards]);

  // Calculate deck statistics
  const deckStats = useMemo(() => cardUtils.getDeckStats(deckCards), [deckCards]);

  // Validate deck
  const validateDeck = useCallback((): string[] => {
    const validationErrors: string[] = [];

    // Check deck size
    const totalCards = deckCards.reduce((sum, { count }) => sum + count, 0);
    if (totalCards !== 30) {
      validationErrors.push(`卡组数量必须为30张，当前为${totalCards}张`);
    }

    // Check card limits
    const cardCounts = new Map<string, number>();
    deckCards.forEach(({ card, count }) => {
      const current = cardCounts.get(card.id) || 0;
      cardCounts.set(card.id, current + count);
    });

    cardCounts.forEach((count, cardId) => {
      const card = deckCards.find(dc => dc.card.id === cardId)?.card;
      if (card) {
        const maxAllowed = card.rarity === 'legendary' ? 1 : 2;
        if (count > maxAllowed) {
          validationErrors.push(`${card.name} 数量超过限制（${card.rarity === 'legendary' ? '1' : '2'}张）`);
        }
      }
    });

    // Check if class is selected and cards match
    if (selectedClass) {
      const invalidCards = deckCards.filter(({ card }) => {
        return card.playerClass.slug !== selectedClass.slug &&
               card.playerClass.slug !== 'neutral' &&
               !card.multiClassGroup?.includes(selectedClass.slug);
      });

      if (invalidCards.length > 0) {
        validationErrors.push(`包含${invalidCards.length}张不属于${selectedClass.name}的卡牌`);
      }
    }

    return validationErrors;
  }, [deckCards, selectedClass]);

  // Add card to deck
  const addCardToDeck = useCallback((card: Card, count: number = 1) => {
    setDeckCards(prev => {
      const existingIndex = prev.findIndex(dc => dc.card.id === card.id);

      if (existingIndex !== -1) {
        const updated = [...prev];
        const maxAllowed = card.rarity === 'legendary' ? 1 : 2;
        const newCount = Math.min(updated[existingIndex].count + count, maxAllowed);

        if (newCount === 0) {
          return updated.filter((_, index) => index !== existingIndex);
        }

        updated[existingIndex] = { ...updated[existingIndex], count: newCount };
        return updated;
      } else {
        return [...prev, { card, count: Math.min(count, card.rarity === 'legendary' ? 1 : 2) }];
      }
    });
  }, []);

  // Remove card from deck
  const removeCardFromDeck = useCallback((cardId: string, count: number = 1) => {
    setDeckCards(prev => {
      const existingIndex = prev.findIndex(dc => dc.card.id === cardId);

      if (existingIndex !== -1) {
        const updated = [...prev];
        const newCount = updated[existingIndex].count - count;

        if (newCount <= 0) {
          return updated.filter((_, index) => index !== existingIndex);
        }

        updated[existingIndex] = { ...updated[existingIndex], count: newCount };
        return updated;
      }

      return prev;
    });
  }, []);

  // Clear deck
  const clearDeck = useCallback(() => {
    setDeckCards([]);
    setDeckName('');
    setDeckDescription('');
    setErrors([]);
    setSuccess(false);
  }, []);

  // Save deck
  const saveDeck = useCallback(async () => {
    const validationErrors = validateDeck();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSaving(true);

    try {
      const deck: Partial<Deck> = {
        name: deckName || '未命名卡组',
        description: deckDescription,
        class: selectedClass!,
        format,
        cards: deckCards,
        isPublic: true,
        archetype: 'custom',
        tags: ['custom-built'],
      };

      await onSave?.(deck);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      // logger.error('Error saving deck', { error, deckName, cardCount: deckCards.length });
      console.error('Error saving deck', error);
      setErrors(['保存卡组失败，请重试']);
    } finally {
      setSaving(false);
    }
  }, [deckName, deckDescription, selectedClass, format, deckCards, onSave, validateDeck]);

  // Export deck code
  const exportDeck = useCallback(() => {
    if (deckCards.length === 0) return;

    const deck: Deck = {
      id: 'export',
      name: deckName || '未命名卡组',
      description: deckDescription,
      class: selectedClass!,
      format,
      cards: deckCards,
      creator: { id: 'user', name: '用户' } as any,
      stats: {
        gamesPlayed: 0,
        winRate: 0,
        avgGameDuration: 0,
        popularity: 0,
        rank: 0,
        lastUpdated: new Date()
      },
      created: new Date(),
      updated: new Date(),
      isPublic: true,
      tags: []
    };

    onExport?.(deck);
  }, [deckName, deckDescription, selectedClass, format, deckCards, onExport]);

  // Import deck code
  const importDeck = useCallback((deckCode: string) => {
    onImport?.(deckCode);
  }, [onImport]);

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          {selectedClass && (
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: selectedClass.color }}
            />
          )}
          卡组构建器
        </h3>

        <div className="flex gap-2">
          <button
            onClick={clearDeck}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
          <button
            onClick={exportDeck}
            disabled={deckCards.length === 0}
            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            复制代码
          </button>
          <button
            onClick={saveDeck}
            disabled={!selectedClass || saving}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                保存中
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存卡组
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deck Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">卡组名称</label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="输入卡组名称..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">卡组描述</label>
          <input
            type="text"
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            placeholder="输入卡组描述..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Error and Success Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium mb-1">验证错误:</p>
              <ul className="text-red-300 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">卡组保存成功！</span>
        </div>
      )}

      {/* Deck Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">卡牌数量</span>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {deckCards.reduce((sum, { count }) => sum + count, 0)} / 30
          </div>
          <div className="text-xs text-gray-500">张卡牌</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">平均法力消耗</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {deckStats.avgCost.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">法力值</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">稀有度分布</span>
          </div>
          <div className="text-sm text-gray-300">
            {Object.entries(deckStats.rarityDistribution).map(([rarity, count]) => (
              <span key={rarity} className="mr-2">
                {rarity === 'common' ? '普通' :
                 rarity === 'rare' ? '稀有' :
                 rarity === 'epic' ? '史诗' : '传说'}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mana Curve */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">法力曲线</h4>
        <div className="flex items-end gap-1 h-20 bg-slate-700/30 rounded-lg p-2">
          {manaCurve.slice(0, 8).map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">{item.count}</span>
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t"
                  style={{ height: `${Math.max(item.percentage * 0.6, 5)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">{item.cost}</span>
            </div>
          ))}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">
                {manaCurve.slice(8).reduce((sum, item) => sum + item.count, 0)}
              </span>
              <div
                className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t"
                style={{ height: `${Math.max((manaCurve.slice(8).reduce((sum, item) => sum + item.percentage, 0) / 3) * 0.6, 5)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 mt-1">7+</span>
          </div>
        </div>
      </div>

      {/* Current Deck Cards */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">当前卡组</h4>
        {deckCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>还没有添加任何卡牌</p>
            <p className="text-sm mt-1">从下方选择卡牌开始构建</p>
          </div>
        ) : (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {deckCards.map(({ card, count }) => (
                <div key={card.id} className="relative group">
                  <CardDisplay
                    card={card}
                    size="small"
                    count={count}
                    showTooltip={true}
                  />
                  <button
                    onClick={() => removeCardFromDeck(card.id, 1)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Selection Interface */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">选择卡牌</h4>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索卡牌..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showFilters
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rarity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">稀有度</label>
                <div className="space-y-1">
                  {['common', 'rare', 'epic', 'legendary'].map(rarity => (
                    <label key={rarity} className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={filters.rarities?.includes(rarity as any) || false}
                        onChange={(e) => {
                          const current = filters.rarities || [];
                          const updated = e.target.checked
                            ? [...current, rarity as any]
                            : current.filter(r => r !== rarity);
                          setFilters({ ...filters, rarities: updated });
                        }}
                        className="mr-2 rounded border-slate-600 bg-slate-600 text-amber-500 focus:ring-amber-500"
                      />
                      {rarity === 'common' ? '普通' :
                       rarity === 'rare' ? '稀有' :
                       rarity === 'epic' ? '史诗' : '传说'}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
                <div className="space-y-1">
                  {['minion', 'spell', 'weapon', 'hero', 'location'].map(type => (
                    <label key={type} className="flex items-center text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={filters.types?.includes(type as any) || false}
                        onChange={(e) => {
                          const current = filters.types || [];
                          const updated = e.target.checked
                            ? [...current, type as any]
                            : current.filter(t => t !== type);
                          setFilters({ ...filters, types: updated });
                        }}
                        className="mr-2 rounded border-slate-600 bg-slate-600 text-amber-500 focus:ring-amber-500"
                      />
                      {type === 'minion' ? '随从' :
                       type === 'spell' ? '法术' :
                       type === 'weapon' ? '武器' :
                       type === 'hero' ? '英雄' : '地点'}
                    </label>
                  ))}
                </div>
              </div>

              {/* Cost Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">法力消耗</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={filters.costs?.min || 0}
                    onChange={(e) => setFilters({
                      ...filters,
                      costs: { min: parseInt(e.target.value) || 0, max: filters.costs?.max || 10 }
                    })}
                    className="w-12 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={filters.costs?.max || 10}
                    onChange={(e) => setFilters({
                      ...filters,
                      costs: { min: filters.costs?.min || 0, max: parseInt(e.target.value) || 10 }
                    })}
                    className="w-12 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({})}
                  className="px-3 py-2 bg-slate-600 text-gray-300 rounded hover:bg-slate-500 transition-colors text-sm"
                >
                  清除筛选
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Available Cards Grid */}
        <div className="bg-slate-700/30 rounded-lg p-4 max-h-96 overflow-y-auto hearthstone-scrollbar">
          {filteredAvailableCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>没有找到匹配的卡牌</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {filteredAvailableCards.map(card => (
                <div key={card.id} className="relative group">
                  <CardDisplay
                    card={card}
                    size="small"
                    showTooltip={true}
                    onClick={() => addCardToDeck(card)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => addCardToDeck(card)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/**
 * Hearthstone API Client
 * Integration with hearthstonejson.com for comprehensive card data
 */

import { Card, HearthstoneClass, FilterOptions, PaginatedResponse } from '@/types/hearthstone';

class HearthstoneAPI {
  private baseURL = 'https://api.hearthstonejson.com/v1/';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 3600000; // 1 hour
  private retryAttempts = 3;
  private retryDelay = 1000;

  // Standard format sets (as of latest expansion)
  private readonly standardSets = [
    'journey_to_ungoro',
    'knights_of_the_frozen_throne',
    'kobolds_and_catacombs',
    'witchwood',
    'the_boomsday_project',
    'rastakhans_rumble',
    'rise_of_shadows',
    'saviors_of_uldum',
    'descent_of_dragons',
    'galakronds_awakening',
    'ashes_of_outland',
    'scholomance_academy',
    'madness_at_the_darkmoon_faire',
    'forged_in_the_barrens',
    'the_untamed',
    'fractured_in_alterac_valley',
    'voyage_to_the_sunken_city',
    'murder_at_castle_nathria',
    'march_of_the_lich_king',
    'festival_of_legends',
    'showdown_in_the_badlands',
    'whizbangs_workshop',
    'perils_in_paradise'
  ];

  // Hearthstone classes with their colors
  private readonly classes: HearthstoneClass[] = [
    { id: 1, name: '战士', slug: 'warrior', color: '#C41E3A', heroClass: true, standard: true, wild: true, classic: true },
    { id: 2, name: '法师', slug: 'mage', color: '#69CCF0', heroClass: true, standard: true, wild: true, classic: true },
    { id: 3, name: '猎人', slug: 'hunter', color: '#ABD473', heroClass: true, standard: true, wild: true, classic: true },
    { id: 4, name: '德鲁伊', slug: 'druid', color: '#FF7D0A', heroClass: true, standard: true, wild: true, classic: true },
    { id: 5, name: '术士', slug: 'warlock', color: '#9482C9', heroClass: true, standard: true, wild: true, classic: true },
    { id: 6, name: '牧师', slug: 'priest', color: '#FFFFFF', heroClass: true, standard: true, wild: true, classic: true },
    { id: 7, name: '潜行者', slug: 'rogue', color: '#FFF569', heroClass: true, standard: true, wild: true, classic: true },
    { id: 8, name: '萨满祭司', slug: 'shaman', color: '#0070DE', heroClass: true, standard: true, wild: true, classic: true },
    { id: 9, name: '圣骑士', slug: 'paladin', color: '#F58CBA', heroClass: true, standard: true, wild: true, classic: true },
    { id: 10, name: '恶魔猎手', slug: 'demonhunter', color: '#A330C9', heroClass: true, standard: true, wild: true, classic: false },
  ];

  async getAllCards(setFilter?: string): Promise<Card[]> {
    const cacheKey = `all-cards-${setFilter || 'all'}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const set = setFilter || 'latest'; // Use latest set
      const url = `${this.baseURL}${set}/zhCN/cards.json`; // Using Chinese cards

      const cards = await this.fetchWithRetry<Card[]>(url);

      // Filter for collectible cards only and transform data
      const collectibleCards = cards
        .filter(card => card.collectible)
        .map(card => this.transformCardData(card));

      // Cache the result
      this.cache.set(cacheKey, {
        data: collectibleCards,
        timestamp: Date.now()
      });

      return collectibleCards;
    } catch (error) {
      console.error('Error fetching Hearthstone cards:', error);
      // Return empty array on error to prevent app crash
      return [];
    }
  }

  async getCardById(cardId: string, set?: string): Promise<Card | null> {
    try {
      const cards = await this.getAllCards(set);
      return cards.find(card => card.id === cardId) || null;
    } catch (error) {
      console.error(`Error fetching card ${cardId}:`, error);
      return null;
    }
  }

  async getCardsByClass(playerClass: string, format: 'standard' | 'wild' | 'classic' | 'twist' = 'standard'): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();

      return allCards.filter(card => {
        // Filter by class (including multi-class cards)
        const classMatch = card.playerClass.slug === playerClass ||
                          (card.multiClassGroup && card.multiClassGroup.includes(playerClass));

        // Filter by format
        const formatMatch = this.isCardInFormat(card, format);

        return classMatch && formatMatch;
      });
    } catch (error) {
      console.error(`Error fetching cards for class ${playerClass}:`, error);
      return [];
    }
  }

  async getCardsByCost(minCost: number, maxCost: number): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return allCards.filter(card => card.cost >= minCost && card.cost <= maxCost);
    } catch (error) {
      console.error(`Error fetching cards by cost ${minCost}-${maxCost}:`, error);
      return [];
    }
  }

  async getCardsByType(cardType: string): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return allCards.filter(card => card.cardType === cardType);
    } catch (error) {
      console.error(`Error fetching cards by type ${cardType}:`, error);
      return [];
    }
  }

  async getCardsByRarity(rarity: string): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return allCards.filter(card => card.rarity === rarity);
    } catch (error) {
      console.error(`Error fetching cards by rarity ${rarity}:`, error);
      return [];
    }
  }

  
  async getCardsWithMechanic(mechanic: string): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return allCards.filter(card =>
        card.mechanics.some(m => m.toLowerCase() === mechanic.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching cards with mechanic ${mechanic}:`, error);
      return [];
    }
  }

  async getLegendaryCards(format: 'standard' | 'wild' = 'standard'): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return allCards.filter(card =>
        card.rarity === 'legendary' && this.isCardInFormat(card, format)
      );
    } catch (error) {
      console.error('Error fetching legendary cards:', error);
      return [];
    }
  }

  async getCardsByIds(cardIds: string[]): Promise<Card[]> {
    try {
      const allCards = await this.getAllCards();
      return cardIds
        .map(id => allCards.find(card => card.id === id))
        .filter(Boolean) as Card[];
    } catch (error) {
      console.error('Error fetching cards by IDs:', error);
      return [];
    }
  }

  async getPaginatedCards(
    page: number = 1,
    pageSize: number = 20,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<Card>> {
    try {
      const allCards = await this.getAllCards();

      // Apply filters
      let filteredCards = filters ? this.applyFilters(allCards, filters) : allCards;

      // Sort by name by default
      filteredCards.sort((a, b) => a.name.localeCompare(b.name));

      // Calculate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCards = filteredCards.slice(startIndex, endIndex);

      return {
        data: paginatedCards,
        totalCount: filteredCards.length,
        currentPage: page,
        totalPages: Math.ceil(filteredCards.length / pageSize),
        hasMore: endIndex < filteredCards.length
      };
    } catch (error) {
      console.error('Error fetching paginated cards:', error);
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasMore: false
      };
    }
  }

  // Utility methods
  getClasses(): HearthstoneClass[] {
    return this.classes;
  }

  getClassBySlug(slug: string): HearthstoneClass | undefined {
    return this.classes.find(cls => cls.slug === slug);
  }

  getStandardSets(): string[] {
    return this.standardSets;
  }

  isCardInFormat(card: Card, format: 'standard' | 'wild' | 'classic' | 'twist'): boolean {
    if (format === 'wild') return true; // Wild includes all cards

    if (format === 'classic') {
      // Classic format logic - only basic and classic sets
      return card.set === 'core' || card.set === 'classic';
    }

    if (format === 'twist') {
      // Twist format changes weekly - for now, use standard sets
      return this.standardSets.includes(card.set.toLowerCase());
    }

    // Standard format
    return this.standardSets.includes(card.set.toLowerCase());
  }

  getRarityColor(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'common': return '#ffffff';
      case 'rare': return '#0070dd';
      case 'epic': return '#a335ee';
      case 'legendary': return '#ff8000';
      default: return '#ffffff';
    }
  }

  getRarityOrder(rarity: string): number {
    switch (rarity.toLowerCase()) {
      case 'common': return 1;
      case 'rare': return 2;
      case 'epic': return 3;
      case 'legendary': return 4;
      default: return 0;
    }
  }

  // Private helper methods
  private applyFilters(cards: Card[], filters: FilterOptions): Card[] {
    return cards.filter(card => {
      // Class filter
      if (filters.classes && filters.classes.length > 0) {
        const classMatch = filters.classes.some(cls =>
          card.playerClass.slug === cls.slug ||
          (card.multiClassGroup && card.multiClassGroup.includes(cls.slug))
        );
        if (!classMatch) return false;
      }

      // Rarity filter
      if (filters.rarities && filters.rarities.length > 0) {
        if (!filters.rarities.includes(card.rarity)) return false;
      }

      // Type filter
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(card.cardType)) return false;
      }

      // Cost filter
      if (filters.costs) {
        if (card.cost < filters.costs.min || card.cost > filters.costs.max) return false;
      }

      // Mechanics filter
      if (filters.mechanics && filters.mechanics.length > 0) {
        const hasMechanic = filters.mechanics.some(mechanic =>
          card.mechanics.some(m => m.toLowerCase() === mechanic.toLowerCase())
        );
        if (!hasMechanic) return false;
      }

      // Sets filter
      if (filters.sets && filters.sets.length > 0) {
        if (!filters.sets.includes(card.set)) return false;
      }

      // Collectible filter
      if (filters.collectible !== undefined) {
        if (card.collectible !== filters.collectible) return false;
      }

      // Format filter
      if (filters.format) {
        if (!this.isCardInFormat(card, filters.format)) return false;
      }

      return true;
    });
  }

  private transformCardData(rawCard: any): Card {
    const playerClass = this.getClassBySlug(rawCard.playerClass) || {
      id: 0,
      name: rawCard.playerClass || 'Neutral',
      slug: rawCard.playerClass || 'neutral',
      color: '#808080',
      heroClass: false
    };

    return {
      id: rawCard.id,
      name: rawCard.name || '',
      text: rawCard.text || '',
      cost: rawCard.cost || 0,
      attack: rawCard.attack,
      health: rawCard.health,
      durability: rawCard.durability,
      rarity: rawCard.rarity || 'common',
      playerClass,
      cardType: rawCard.type || 'minion',
      mechanics: rawCard.mechanics || [],
      image: rawCard.image || '',
      imageGold: rawCard.imageGold,
      flavorText: rawCard.flavorText,
      artist: rawCard.artist,
      attackType: rawCard.attackType,
      race: rawCard.race,
      collectible: rawCard.collectible || false,
      set: rawCard.set || '',
      multiClassGroup: rawCard.multiClassGroup,
      spellSchool: rawCard.spellSchool,
      keywordIds: rawCard.keywordIds,
      overrideClass: rawCard.overrideClass,
      faction: rawCard.faction,
      series: rawCard.series,
      signature: rawCard.signature,
      textRaw: rawCard.textRaw,
      locale: rawCard.locale,
      requires: rawCard.requires,
      howToGet: rawCard.howToGet,
      howToGetGold: rawCard.howToGetGold,
      note: rawCard.note,
      raid: rawCard.raid,
      team: rawCard.team,
      collectibleUnplayable: rawCard.collectibleUnplayable,
      portrait: rawCard.portrait,
      signaturePortrait: rawCard.signaturePortrait
    };
  }

  private async fetchWithRetry<T>(url: string): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Hearthstone-Deck-Discovery/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${url}:`, error);

        if (attempt < this.retryAttempts) {
          // Wait before retrying with exponential backoff
          await new Promise(resolve =>
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1))
          );
        }
      }
    }

    throw lastError;
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Preload popular card data
  async preloadPopularData(): Promise<void> {
    try {
      // Preload all cards
      await this.getAllCards();

      // Preload legendary cards (popular for deck building)
      await this.getLegendaryCards();

      // Preload cards for each class
      const promises = this.classes.map(cls => this.getCardsByClass(cls.slug));
      await Promise.all(promises);

      console.log('Preloaded popular Hearthstone data');
    } catch (error) {
      console.error('Error preloading popular data:', error);
    }
  }

  async getCardPerformance(cardId: number, format: string = 'standard', timeframe: string = '7d') {
    const response = await fetch(`/api/cards/performance?cardId=${cardId}&format=${format}&timeframe=${timeframe}`);
    if (!response.ok) throw new Error('Failed to fetch card performance');
    return response.json();
  }

  async getDeckMatchups(deckId: string, format: string = 'standard', timeframe: string = '7d') {
    const response = await fetch(`/api/decks/${deckId}/matchups?format=${format}&timeframe=${timeframe}`);
    if (!response.ok) throw new Error('Failed to fetch deck matchups');
    return response.json();
  }

  async searchCards(params: {
    query?: string;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.set('q', params.query);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());

    // Add filters
    Object.entries(params.filters || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        searchParams.set(`filter_${key}`, value.join(','));
      } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
        // Handle cost range filters
        searchParams.set(`filter_${key}`, `${value.min},${value.max}`);
      }
    });

    const response = await fetch(`/api/cards/search?${searchParams}`);
    if (!response.ok) throw new Error('Failed to search cards');
    return response.json();
  }

  // Get search suggestions for autocomplete
  async getCardSuggestions(query: string): Promise<{ suggestions: string[] }> {
    try {
      const allCards = await this.getAllCards();
      const lowercaseQuery = query.toLowerCase();

      // Generate suggestions based on card names
      const suggestions = allCards
        .filter(card =>
          card.name.toLowerCase().includes(lowercaseQuery) ||
          card.text.toLowerCase().includes(lowercaseQuery)
        )
        .map(card => card.name)
        .slice(0, 10); // Limit to 10 suggestions

      return { suggestions };
    } catch (error) {
      console.error('Error generating card suggestions:', error);
      return { suggestions: [] };
    }
  }
}

// Export singleton instance
export const hearthstoneAPI = new HearthstoneAPI();

// Export types
export type { HearthstoneAPI };

// Export utility functions
export const cardUtils = {
  getManaCurve: (cards: Array<{ card: Card; count: number }>): Array<{ cost: number; count: number }> => {
    const curve: { [key: number]: number } = {};

    cards.forEach(({ card, count }) => {
      const cost = Math.min(card.cost, 7); // Group 7+ cost cards together
      curve[cost] = (curve[cost] || 0) + count;
    });

    return Array.from({ length: 8 }, (_, i) => ({
      cost: i,
      count: curve[i] || 0
    }));
  },

  getDeckStats: (cards: Array<{ card: Card; count: number }>) => {
    const totalCards = cards.reduce((sum, { count }) => sum + count, 0);
    const totalCost = cards.reduce((sum, { card, count }) => sum + (card.cost * count), 0);
    const avgCost = totalCost / totalCards;

    const rarityCount = cards.reduce((acc, { card, count }) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + count;
      return acc;
    }, {} as Record<string, number>);

    const typeCount = cards.reduce((acc, { card, count }) => {
      acc[card.cardType] = (acc[card.cardType] || 0) + count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards,
      avgCost: Math.round(avgCost * 10) / 10,
      rarityDistribution: rarityCount,
      typeDistribution: typeCount,
      manaCurve: cardUtils.getManaCurve(cards)
    };
  },

  formatDeckCode: (cards: Array<{ card: Card; count: number }>): string => {
    // This would implement Hearthstone deck code format
    // For now, return a simple representation
    return cards.map(({ card, count }) =>
      `${count}x ${card.name}`
    ).join('\n');
  }
};

export default hearthstoneAPI;
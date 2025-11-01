/**
 * Hearthstone Card and Deck Type Definitions
 * Core types for the Hearthstone deck discovery platform
 */

export interface Card {
  id: string;
  name: string;
  text: string;
  cost: number;
  attack?: number;
  health?: number;
  durability?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  playerClass: HearthstoneClass;
  cardType: 'minion' | 'spell' | 'weapon' | 'hero' | 'location';
  mechanics: string[];
  image: string;
  imageGold?: string;
  flavorText?: string;
  artist?: string;
  attackType?: 'ranged' | 'melee';
  race?: string;
  collectible: boolean;
  set: string;
  multiClassGroup?: string[];
  spellSchool?: string;
  keywordIds?: string[];
  overrideClass?: string;
  faction?: string;
  series?: string;
  signature?: string;
  textRaw?: string;
  locale?: string;
  requires?: string[];
  howToGet?: string;
  howToGetGold?: string;
  note?: string;
  raid?: string;
  team?: string;
  collectibleUnplayable?: boolean;
  portrait?: string;
  signaturePortrait?: string;
}

export interface HearthstoneClass {
  id: number;
  name: string;
  slug: string;
  color: string;
  heroClass: boolean;
  heroPower?: string;
  standard?: boolean;
  wild?: boolean;
  classic?: boolean;
  twist?: boolean;
  battlegrounds?: boolean;
  mercenaries?: boolean;
}

// Add to existing HearthstoneCard interface or create new interface
export interface CardPerformance {
  id: string;
  cardId: string;
  format: 'standard' | 'wild' | 'classic' | 'twist';
  timeframe: '24h' | '7d' | '30d';
  deckInclusionRate: number;
  playedWinrate: number;
  mulliganWinrate: number;
  avgCopiesInDeck: number;
  gamesPlayed: number;
  popularityChange: number;
  winrateChange: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HearthstoneCard {
  id: string;
  name: string;
  text?: string;
  cost?: number;
  attack?: number;
  health?: number;
  durability?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cardType: 'minion' | 'spell' | 'weapon' | 'hero' | 'location' | 'hero_power';
  playerClassId?: number;
  mechanics?: string[];
  imageUrl?: string;
  imageGoldUrl?: string;
  flavorText?: string;
  artist?: string;
  attackType?: string;
  race?: string;
  collectible: boolean;
  cardSet: string;
  multiclassGroups?: string[];
  spellSchool?: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
  performance?: CardPerformance[];
}

// HearthstoneJSON API Response types
export interface HearthstoneJSONCard {
  id: string;
  name: string;
  text?: string;
  flavor?: string;
  artist?: string;
  attack?: number;
  health?: number;
  durability?: number;
  cost?: number;
  rarity?: string;
  cardSet?: string;
  playerClass?: string;
  type?: string;
  faction?: string;
  race?: string;
  mechanics?: Array<{ name: string }>;
  collectible?: boolean;
}

export interface HearthstoneJSONSyncResponse {
  success: boolean;
  cardsImported?: number;
  error?: string;
}

export interface HearthstoneCardsTableRow {
  id: string;
  name: string;
  text?: string;
  flavor?: string;
  artist?: string;
  attack?: number;
  health?: number;
  cost?: number;
  rarity?: string;
  cardSet?: string;
  playerClass?: string;
  cardType?: string;
  faction?: string;
  race?: string;
  mechanics?: string[];
  image?: string;
  created_at: string;
}

export interface HearthstoneCardImage {
  id: string;
  cardId: string;
  imageType: 'normal' | 'gold' | 'tile' | 'tile_gold';
  storagePath: string;
  fileSize?: number;
  width?: number;
  height?: number;
  format: string;
  optimizedAt: Date;
  createdAt: Date;
}

export interface CardSyncLog {
  id: string;
  syncType: 'full' | 'incremental' | 'manual';
  status: 'running' | 'completed' | 'failed';
  cardsProcessed: number;
  cardsAdded: number;
  cardsUpdated: number;
  cardsRemoved: number;
  imagesProcessed: number;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
}


export interface Deck {
  id: string;
  name: string;
  description?: string;
  class: HearthstoneClass;
  format: 'standard' | 'wild' | 'classic' | 'twist';
  cards: DeckCard[];
  creator: User;
  stats: DeckStats;
  created: Date;
  updated: Date;
  archetype?: string;
  isPublic: boolean;
  tags: string[];
  deckCode?: string;
  cost?: number;
  attack?: number;
  health?: number;
  durability?: number;
  type?: string;
  matchups?: DeckMatchup[];
}

export interface DeckCard {
  card: Card;
  count: number;
  position?: number;
}

export interface DeckStats {
  gamesPlayed: number;
  winRate: number;
  avgGameDuration: number;
  popularity: number;
  rank: number;
  lastUpdated: Date;
  sampleSize?: number;
  confidenceInterval?: number;
  matchupScores?: MatchupScore[];
  mulliganWinRate?: number;
  turnByTurnWinRate?: { turn: number; winRate: number }[];
}

export interface MatchupScore {
  opponentClass: HearthstoneClass;
  winRate: number;
  gamesPlayed: number;
}

export interface MetaSnapshot {
  id: string;
  timestamp: Date;
  format: string;
  rankings: TierRanking[];
  popularDecks: PopularDeck[];
  risingCards: TrendingCard[];
  fallingCards: TrendingCard[];
  classDistribution: ClassStats[];
  sampleSize: number;
  rankRange: string;
}

export interface TierRanking {
  archetype: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  winRate: number;
  popularity: number;
  gamesPlayed: number;
  sampleDeck: Deck;
  class: HearthstoneClass;
  popularityChange?: number;
  winRateChange?: number;
}

export interface PopularDeck {
  deck: Deck;
  popularity: number;
  winRate: number;
  gamesPlayed: number;
  rank: number;
  archetype: string;
}

export interface TrendingCard {
  card: Card;
  trend: 'rising' | 'falling' | 'stable';
  changePercent: number;
  currentUsage: number;
  previousUsage: number;
  timeframe: '24h' | '7d' | '30d';
  avgPosition?: number;
  avgCopies?: number;
  winRateWithCard?: number;
}

export interface ClassStats {
  class: HearthstoneClass;
  popularity: number;
  winRate: number;
  gamesPlayed: number;
  archetypeDistribution: { archetype: string; percentage: number }[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
  bio?: string;
  region?: string;
  battletag?: string;
  favoriteClass?: HearthstoneClass;
  createdAt: Date;
  lastActiveAt: Date;
  achievements?: Achievement[];
  stats?: UserStats;
  following?: number;
  followers?: number;
}

export interface UserStats {
  decksCreated: number;
  decksShared: number;
  totalGames: number;
  overallWinRate: number;
  favoriteFormat: string;
  mostPlayedClass?: HearthstoneClass;
  achievements: number;
  totalLikesReceived?: number;
  following?: number;
  followers?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'deck-building' | 'social' | 'discovery' | 'mastery';
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SearchResult {
  type: 'card' | 'deck' | 'user' | 'archetype';
  result: Card | Deck | User | string;
  relevance: number;
  highlights?: string[];
}

export interface FilterOptions {
  classes?: HearthstoneClass[];
  rarities?: Card['rarity'][];
  types?: Card['cardType'][];
  costs?: { min: number; max: number };
  mechanics?: string[];
  sets?: string[];
  keywords?: string[];
  format?: 'standard' | 'wild' | 'classic' | 'twist';
  collectible?: boolean;
}

export interface SortOption {
  field: 'name' | 'cost' | 'attack' | 'health' | 'rarity' | 'popularity' | 'winRate' | 'created' | 'playerClass';
  direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CardSynergy {
  primaryCard: Card;
  secondaryCards: {
    card: Card;
    synergyScore: number;
    explanation: string;
    comboType: 'direct' | 'synergistic' | 'anti-synergy';
  }[];
}

export interface DeckSuggestion {
  baseCard: Card;
  suggestions: {
    deck: Deck;
    confidence: number;
    reasoning: string;
    playStyle: 'aggro' | 'control' | 'midrange' | 'combo' | 'ramp';
  }[];
}

export interface MetaReport {
  id: string;
  title: string;
  author: User;
  content: string;
  format: string;
  timestamp: Date;
  tags: string[];
  featuredDecks: Deck[];
  keyCards: Card[];
  readTime: number;
  likes: number;
  views: number;
}

export interface Tournament {
  id: string;
  name: string;
  format: string;
  startDate: Date;
  endDate: Date;
  prizePool?: number;
  region: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  topDecks: Deck[];
  participants: User[];
  coverage?: {
    streamUrl?: string;
    bracketUrl?: string;
    articles?: string[];
  };
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  format: string;
  isActive: boolean;
  cardSets: string[];
  bannedCards?: string[];
  restrictedCards?: string[];
}

// API Response Types
export interface HearthstoneAPIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Utility Types
export type CardId = string;
export type DeckId = string;
export type UserId = string;
export type ArchetypeName = string;
export type SetName = string;
export type MechanicName = string;

// Database Schema Types (for Supabase)
export interface DatabaseCard extends Omit<Card, 'playerClass'> {
  playerClass: string; // Store as string in DB
  createdAt: Date;
  updatedAt: Date;
}

// Updated Database Schema Types matching new structure
export interface DatabaseHearthstoneCard {
  id: string;
  name: string;
  text?: string;
  cost?: number;
  attack?: number;
  health?: number;
  durability?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  card_type: 'minion' | 'spell' | 'weapon' | 'hero' | 'location' | 'hero_power';
  player_class_id?: number;
  mechanics?: string[];
  image_url?: string;
  image_gold_url?: string;
  flavor_text?: string;
  artist?: string;
  attack_type?: string;
  race?: string;
  collectible: boolean;
  card_set: string;
  multiclass_groups?: string[];
  spell_school?: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseHearthstoneCardImage {
  id: string;
  card_id: string;
  image_type: 'normal' | 'gold' | 'tile' | 'tile_gold';
  storage_path: string;
  file_size?: number;
  width?: number;
  height?: number;
  format: string;
  optimized_at: string;
  created_at: string;
}

export interface DatabaseCardSyncLog {
  id: string;
  sync_type: 'full' | 'incremental' | 'manual';
  status: 'running' | 'completed' | 'failed';
  cards_processed: number;
  cards_added: number;
  cards_updated: number;
  cards_removed: number;
  images_processed: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface DatabaseHearthstoneClass {
  id: number;
  name: string;
  slug: string;
  color: string;
  hero_class: boolean;
  standard: boolean;
  wild: boolean;
  classic: boolean;
  twist: boolean;
  battlegrounds: boolean;
  mercenaries: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeckMatchup {
  id: string;
  deckId: string;
  opponentClass: HearthstoneClass;
  gamesPlayed: number;
  winRate: number;
  format: 'standard' | 'wild' | 'classic' | 'twist';
  timeframe: '24h' | '7d' | '30d';
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseDeck extends Omit<Deck, 'class' | 'cards' | 'creator'> {
  class: string; // Store as string in DB
  cards: string; // JSON string
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseUser extends Omit<User, 'favoriteClass' | 'mostPlayedClass'> {
  favoriteClass?: string;
  mostPlayedClass?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Component Props Types
export interface CardDisplayProps {
  card: Card;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onClick?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  count?: number;
  showCost?: boolean;
  showStats?: boolean;
  className?: string;
}

export interface DeckPreviewProps {
  deck: Deck;
  showCreator?: boolean;
  showStats?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onCopy?: () => void;
  onView?: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: Card[];
  loading?: boolean;
  className?: string;
}

export interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    classes: HearthstoneClass[];
    rarities: Card['rarity'][];
    types: Card['cardType'][];
    sets: string[];
    mechanics: string[];
  };
  className?: string;
}

// Configuration Types
export interface AppConfig {
  api: {
    hearthstoneApiBaseUrl: string;
    cacheTimeout: number;
    retryAttempts: number;
  };
  ui: {
    defaultCardSize: 'small' | 'medium' | 'large';
    enableAnimations: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  features: {
    enableAdvancedStats: boolean;
    enableSocialFeatures: boolean;
    enableDeckBuilder: boolean;
    enableMetaAnalysis: boolean;
  };
}

export default {};
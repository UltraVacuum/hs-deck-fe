'use client';

import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CompactCardFiltersProps {
  searchTerm: string;
  filters: {
    class: string;
    rarity: string;
    type: string;
    minCost: number;
    maxCost: number;
  };
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string | number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const CLASS_OPTIONS = [
  { value: '', label: '全部职业', enLabel: 'All Classes' },
  { value: 'neutral', label: '中立', enLabel: 'Neutral' },
  { value: 'warrior', label: '战士', enLabel: 'Warrior' },
  { value: 'mage', label: '法师', enLabel: 'Mage' },
  { value: 'hunter', label: '猎人', enLabel: 'Hunter' },
  { value: 'druid', label: '德鲁伊', enLabel: 'Druid' },
  { value: 'warlock', label: '术士', enLabel: 'Warlock' },
  { value: 'priest', label: '牧师', enLabel: 'Priest' },
  { value: 'rogue', label: '潜行者', enLabel: 'Rogue' },
  { value: 'shaman', label: '萨满', enLabel: 'Shaman' },
  { value: 'paladin', label: '圣骑士', enLabel: 'Paladin' },
  { value: 'demonhunter', label: '恶魔猎手', enLabel: 'Demon Hunter' },
  { value: 'deathknight', label: '死亡骑士', enLabel: 'Death Knight' }
];

const TYPE_OPTIONS = [
  { value: '', label: '全部类型', enLabel: 'All Types' },
  { value: 'minion', label: '随从', enLabel: 'Minion' },
  { value: 'spell', label: '法术', enLabel: 'Spell' },
  { value: 'weapon', label: '武器', enLabel: 'Weapon' },
  { value: 'hero', label: '英雄', enLabel: 'Hero' },
  { value: 'hero_power', label: '英雄技能', enLabel: 'Hero Power' },
  { value: 'location', label: '地点', enLabel: 'Location' }
];

const RARITY_OPTIONS = [
  { value: '', label: '全部稀有度', enLabel: 'All Rarities' },
  { value: 'legendary', label: '传说', enLabel: 'Legendary' },
  { value: 'epic', label: '史诗', enLabel: 'Epic' },
  { value: 'rare', label: '稀有', enLabel: 'Rare' },
  { value: 'common', label: '普通', enLabel: 'Common' }
];

export function CompactCardFilters({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: CompactCardFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showRarityDropdown, setShowRarityDropdown] = useState(false);

  const classDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const rarityDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setShowClassDropdown(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (rarityDropdownRef.current && !rarityDropdownRef.current.contains(event.target as Node)) {
        setShowRarityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentLabel = (options: typeof CLASS_OPTIONS, value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : options[0].label;
  };

  const handleCostChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(10, numValue));
    onFilterChange(type === 'min' ? 'minCost' : 'maxCost', clampedValue);
  };

  return (
    <>
      {/* 桌面端 - 固定顶部过滤器 */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索卡牌... | Search cards..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 分隔线 */}
            <div className="h-8 w-px bg-gray-300"></div>

            {/* 职业选择器 */}
            <div className="relative" ref={classDropdownRef}>
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 min-w-[100px] justify-between"
              >
                <span className="truncate">{getCurrentLabel(CLASS_OPTIONS, filters.class)}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {showClassDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[140px] max-h-64 overflow-y-auto">
                  {CLASS_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange('class', option.value);
                        setShowClassDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors",
                        filters.class === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 类型选择器 */}
            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 min-w-[90px] justify-between"
              >
                <span className="truncate">{getCurrentLabel(TYPE_OPTIONS, filters.type)}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[120px]">
                  {TYPE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange('type', option.value);
                        setShowTypeDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors",
                        filters.type === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 稀有度选择器 */}
            <div className="relative" ref={rarityDropdownRef}>
              <button
                onClick={() => setShowRarityDropdown(!showRarityDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 min-w-[100px] justify-between"
              >
                <span className="truncate">{getCurrentLabel(RARITY_OPTIONS, filters.rarity)}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {showRarityDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[100px]">
                  {RARITY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFilterChange('rarity', option.value);
                        setShowRarityDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors",
                        filters.rarity === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 费用范围 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">费用:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={filters.minCost}
                  onChange={(e) => handleCostChange('min', e.target.value)}
                  className="w-12 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={filters.maxCost}
                  onChange={(e) => handleCostChange('max', e.target.value)}
                  className="w-12 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 清除筛选按钮 */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>清除</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 移动端 - 折叠式过滤器 */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* 移动端搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索卡牌..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 移动端过滤器切换 */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors",
                hasActiveFilters
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>筛选</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                清除
              </button>
            )}
          </div>

          {/* 移动端过滤器面板 */}
          {showMobileFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* 移动端职业选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">职业</label>
                  <select
                    value={filters.class}
                    onChange={(e) => onFilterChange('class', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CLASS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* 移动端类型和稀有度 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                    <select
                      value={filters.type}
                      onChange={(e) => onFilterChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TYPE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">稀有度</label>
                    <select
                      value={filters.rarity}
                      onChange={(e) => onFilterChange('rarity', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {RARITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 移动端费用范围 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">费用范围</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">最小:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={filters.minCost}
                        onChange={(e) => handleCostChange('min', e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">最大:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={filters.maxCost}
                        onChange={(e) => handleCostChange('max', e.target.value)}
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
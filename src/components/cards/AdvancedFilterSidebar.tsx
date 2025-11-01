'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchStore } from '@/stores/search-store';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Settings,
  RotateCcw,
  Save,
  Trash2,
  Copy
} from 'lucide-react';
import FilterBuilder from './FilterBuilder';
import CostRangeSlider from './CostRangeSlider';

// Filter presets
const FILTER_PRESETS = [
  {
    id: 'legendary-cards',
    name: '传说卡牌',
    icon: '⭐',
    filters: { rarity: ['legendary'] },
    description: '所有传说稀有度卡牌'
  },
  {
    id: 'budget-decks',
    name: '平民卡组',
    icon: '💰',
    filters: { rarity: ['common'], cost: [0, 1, 2, 3] },
    description: '低成本卡牌，适合新手'
  },
  {
    id: 'meta-cards',
    name: '主流卡牌',
    icon: '🔥',
    filters: { minWinRate: 52, minGamesPlayed: 1000 },
    description: '高胜率且使用率高的卡牌'
  },
  {
    id: 'aggro-cards',
    name: '快攻卡牌',
    icon: '⚡',
    filters: { cost: [0, 1, 2, 3], minAttack: 3 },
    description: '低费用高攻击卡牌'
  },
  {
    id: 'control-cards',
    name: '控制卡牌',
    icon: '🛡️',
    filters: { cost: [6, 7, 8, 9, 10], minHealth: 6 },
    description: '高费用高血量卡牌'
  },
  {
    id: 'combo-cards',
    name: '连击卡牌',
    icon: '🎯',
    filters: { keywords: ['combo', 'battlecry', 'deathrattle'] },
    description: '具有特效机制的卡牌'
  }
];

interface FilterCategory {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  expanded?: boolean;
}

export default function AdvancedFilterSidebar() {
  const { filters, setFilters, setQuery } = useSearchStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['class', 'cost']));
  const [customPresets, setCustomPresets] = useState<any[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Load custom presets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hearthstone_custom_presets');
      if (saved) {
        setCustomPresets(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load custom presets:', error);
    }
  }, []);

  const filterCategories: FilterCategory[] = [
    { id: 'class', label: '职业', component: FilterBuilder, expanded: true },
    { id: 'cost', label: '费用', component: CostRangeSlider, expanded: true },
    { id: 'rarity', label: '稀有度', component: FilterBuilder },
    { id: 'type', label: '类型', component: FilterBuilder },
    { id: 'keyword', label: '关键词', component: FilterBuilder },
    { id: 'set', label: '扩展包', component: FilterBuilder },
  ];

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Apply preset
  const applyPreset = (preset: any) => {
    setFilters(preset.filters);
    if (preset.query) {
      setQuery(preset.query);
    }
  };

  // Save current filters as preset
  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset = {
      id: `custom_${Date.now()}`,
      name: presetName,
      filters: { ...filters },
      timestamp: new Date().toISOString(),
    };

    const updatedPresets = [...customPresets, newPreset];
    setCustomPresets(updatedPresets);

    try {
      localStorage.setItem('hearthstone_custom_presets', JSON.stringify(updatedPresets));
    } catch (error) {
      console.warn('Failed to save preset:', error);
    }

    setPresetName('');
    setShowSavePreset(false);
  };

  // Delete custom preset
  const deletePreset = (presetId: string) => {
    const updatedPresets = customPresets.filter(p => p.id !== presetId);
    setCustomPresets(updatedPresets);

    try {
      localStorage.setItem('hearthstone_custom_presets', JSON.stringify(updatedPresets));
    } catch (error) {
      console.warn('Failed to delete preset:', error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  // Check if preset is active
  const isPresetActive = (preset: any) => {
    return JSON.stringify(preset.filters) === JSON.stringify(filters);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (typeof value === 'object' && value !== null) {
        count += Object.keys(value).length;
      } else if (value !== undefined && value !== null) {
        count += 1;
      }
    });
    return count;
  }, [filters]);

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">高级筛选</h2>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">筛选预设</h3>
            <Button
              onClick={() => setShowSavePreset(!showSavePreset)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>

          {/* Save Preset Form */}
          {showSavePreset && (
            <div className="p-3 bg-slate-700 rounded-lg space-y-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="预设名称..."
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={savePreset} size="sm" className="flex-1">
                  <BookmarkCheck className="w-4 h-4 mr-1" />
                  保存
                </Button>
                <Button
                  onClick={() => setShowSavePreset(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </div>
          )}

          {/* Preset List */}
          <div className="space-y-2">
            {/* Built-in Presets */}
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                  isPresetActive(preset)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{preset.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs opacity-75">{preset.description}</div>
                    </div>
                  </div>
                  {isPresetActive(preset) && (
                    <BookmarkCheck className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            ))}

            {/* Custom Presets */}
            {customPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
                  isPresetActive(preset)
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      {preset.name}
                    </div>
                    <div className="text-xs opacity-75">
                      {new Date(preset.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filter Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">详细筛选</h3>

          {filterCategories.map((category) => {
            const Component = category.component;
            const isExpanded = expandedCategories.has(category.id);

            return (
              <div key={category.id} className="border border-slate-600 rounded-lg">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-300">{category.label}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-600">
                    <Component
                      filterKey={category.id}
                      value={filters[category.id]}
                      onChange={(value: any) => setFilters({ ...filters, [category.id]: value })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filter Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-700">
          <Button
            onClick={() => {
              const filterString = JSON.stringify(filters, null, 2);
              navigator.clipboard.writeText(filterString);
            }}
            variant="outline"
            size="sm"
            className="w-full text-gray-300 hover:text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            复制筛选配置
          </Button>

          <div className="text-xs text-gray-500 text-center">
            当前筛选条件: {activeFilterCount} 项
          </div>
        </div>
      </div>
    </div>
  );
}
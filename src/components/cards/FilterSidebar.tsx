'use client';

import { useState } from 'react';
import { useSearchStore } from '@/stores/search-store';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import FilterBuilder from './FilterBuilder';
import CostRangeSlider from './CostRangeSlider';

interface FilterCategory {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'class',
    label: '职业',
    component: FilterBuilder,
  },
  {
    id: 'cost',
    label: '费用',
    component: CostRangeSlider,
  },
  {
    id: 'rarity',
    label: '稀有度',
    component: FilterBuilder,
  },
];

export default function FilterSidebar() {
  const { filters, setFilters } = useSearchStore();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['class']));

  const toggleCategory = (categoryId: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(categoryId)) {
      newOpen.delete(categoryId);
    } else {
      newOpen.add(categoryId);
    }
    setOpenCategories(newOpen);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">筛选器</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              清除
            </Button>
          )}
        </div>

        {/* Filter Categories */}
        <div className="space-y-2">
          {FILTER_CATEGORIES.map((category) => {
            const Component = category.component;
            const isOpen = openCategories.has(category.id);

            return (
              <div key={category.id} className="border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  className="w-full p-3 justify-between hover:bg-gray-100"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-gray-900 font-medium">{category.label}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
                {isOpen && (
                  <div className="p-3 pt-0">
                    <Component
                      filterId={category.id}
                      value={filters[category.id]}
                      onChange={(value: any) => {
                        setFilters({
                          ...filters,
                          [category.id]: value,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardGridLayoutProps {
  children: React.ReactNode;
  viewMode?: 'compact' | 'comfortable' | 'spacious';
  className?: string;
}

export function CardGridLayout({
  children,
  viewMode = 'comfortable',
  className
}: CardGridLayoutProps) {
  const gridConfigs = {
    compact: {
      // 紧凑布局：桌面端6列，平板4列，手机2列
      grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
      gap: 'gap-3 md:gap-4'
    },
    comfortable: {
      // 舒适布局：桌面端4列，平板3列，手机2列
      grid: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4',
      gap: 'gap-4 md:gap-6'
    },
    spacious: {
      // 宽敞布局：桌面端3列，平板2列，手机1列
      grid: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3',
      gap: 'gap-6 md:gap-8'
    }
  };

  const config = gridConfigs[viewMode];

  return (
    <div className={cn(
      'w-full',
      config.grid,
      config.gap,
      className
    )}>
      {children}
    </div>
  );
}

// 视图模式切换器组件
interface ViewModeToggleProps {
  viewMode: 'compact' | 'comfortable' | 'spacious';
  onViewModeChange: (mode: 'compact' | 'comfortable' | 'spacious') => void;
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const viewModes = [
    {
      key: 'compact' as const,
      label: '紧凑',
      icon: '☰',
      description: '每页显示更多卡牌'
    },
    {
      key: 'comfortable' as const,
      label: '舒适',
      icon: '▦',
      description: '平衡的信息展示'
    },
    {
      key: 'spacious' as const,
      label: '宽敞',
      icon: '▬',
      description: '大图预览模式'
    }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      {viewModes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onViewModeChange(mode.key)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
            viewMode === mode.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
          title={mode.description}
        >
          <span className="text-lg">{mode.icon}</span>
          <span className="hidden sm:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
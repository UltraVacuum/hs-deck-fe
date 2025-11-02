import React from 'react';
import { CardImage } from './card-image';
import { cn } from '@/lib/utils';

interface CardCardProps {
  id: string;
  name_zh: string;
  cost: number | null;
  attack: number | null;
  health: number | null;
  card_class: string;
  type: string;
  rarity: string;
  text_zh: string | null;
  imageUrls: {
    normal: string;
    large: string;
    render: string;
    renderLarge: string;
  };
  className?: string;
  onClick?: () => void;
}

export function CardCard({
  id,
  name_zh,
  cost,
  attack,
  health,
  card_class,
  type,
  rarity,
  text_zh,
  imageUrls,
  className,
  onClick
}: CardCardProps) {
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'common':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  // Get rarity border color
  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'border-amber-400';
      case 'epic':
        return 'border-purple-400';
      case 'rare':
        return 'border-blue-400';
      case 'common':
        return 'border-gray-400';
      default:
        return 'border-gray-400';
    }
  };

  // Get rarity text in Chinese
  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '传说';
      case 'epic':
        return '史诗';
      case 'rare':
        return '稀有';
      case 'common':
        return '普通';
      default:
        return '普通';
    }
  };

  // Get type text in Chinese
  const getTypeText = (type: string) => {
    switch (type) {
      case 'minion':
        return '随从';
      case 'spell':
        return '法术';
      case 'weapon':
        return '武器';
      case 'hero':
        return '英雄';
      case 'hero_power':
        return '英雄技能';
      case 'location':
        return '地点';
      default:
        return type;
    }
  };

  // Get class color
  const getClassColor = (cardClass: string) => {
    switch (cardClass) {
      case 'mage':
        return 'bg-blue-100 text-blue-800';
      case 'warrior':
        return 'bg-red-100 text-red-800';
      case 'hunter':
        return 'bg-green-100 text-green-800';
      case 'druid':
        return 'bg-amber-100 text-amber-800';
      case 'warlock':
        return 'bg-purple-100 text-purple-800';
      case 'priest':
        return 'bg-gray-100 text-gray-800';
      case 'rogue':
        return 'bg-slate-100 text-slate-800';
      case 'shaman':
        return 'bg-cyan-100 text-cyan-800';
      case 'paladin':
        return 'bg-yellow-100 text-yellow-800';
      case 'demonhunter':
        return 'bg-indigo-100 text-indigo-800';
      case 'deathknight':
        return 'bg-zinc-100 text-zinc-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get class text in Chinese
  const getClassText = (cardClass: string) => {
    switch (cardClass) {
      case 'mage':
        return '法师';
      case 'warrior':
        return '战士';
      case 'hunter':
        return '猎人';
      case 'druid':
        return '德鲁伊';
      case 'warlock':
        return '术士';
      case 'priest':
        return '牧师';
      case 'rogue':
        return '潜行者';
      case 'shaman':
        return '萨满祭司';
      case 'paladin':
        return '圣骑士';
      case 'demonhunter':
        return '恶魔猎手';
      case 'deathknight':
        return '死亡骑士';
      case 'neutral':
        return '中立';
      default:
        return cardClass;
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1',
        getRarityBorderColor(rarity),
        className
      )}
      onClick={onClick}
    >
      {/* Card Image Container - 优化为 256x256 图片展示 */}
      <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <CardImage
          cardId={id}
          cardName={name_zh}
          imageUrl={imageUrls.normal} // 使用256x图片
          renderUrl={imageUrls.render}
          size="xlarge"
          className="mx-auto"
        />

        {/* Cost Badge - 优化样式 */}
        <div className="absolute top-6 left-6 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg border-2 border-white">
          {cost || 0}
        </div>

        {/* Rarity Badge - 优化样式 */}
        <div className={cn(
          'absolute top-6 right-6 px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-white/20',
          getRarityColor(rarity)
        )}>
          {getRarityText(rarity)}
        </div>

        {/* Card Type Badge - 添加类型标识 */}
        <div className="absolute bottom-6 left-6 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded backdrop-blur-sm">
          {getTypeText(type)}
        </div>
      </div>

      {/* Card Info - 紧凑信息展示 */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
        {/* Card Name */}
        <h3 className="font-bold text-gray-900 mb-2 text-base leading-tight line-clamp-2">
          {name_zh}
        </h3>

        {/* Class and Stats in one row */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            'px-2 py-1 text-xs rounded font-medium',
            getClassColor(card_class)
          )}>
            {getClassText(card_class)}
          </span>

          {/* Stats for Minions and Weapons - 紧凑显示 */}
          {(type === 'minion' || type === 'weapon') && (
            <div className="flex items-center gap-3 text-gray-700">
              {type === 'weapon' ? (
                <>
                  <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-orange-700">攻</span>
                    <span className="text-sm font-bold text-orange-800">{attack || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-green-700">耐</span>
                    <span className="text-sm font-bold text-green-800">{health || 0}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-red-700">攻</span>
                    <span className="text-sm font-bold text-red-800">{attack || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-blue-700">血</span>
                    <span className="text-sm font-bold text-blue-800">{health || 0}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Card Description - 简化描述 */}
        {text_zh && (
          <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {text_zh.replace(/<[^>]*>/g, '').substring(0, 80)}
            {text_zh.length > 80 && '...'}
          </div>
        )}
      </div>
    </div>
  );
}
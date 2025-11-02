import React from 'react';
import { CardImage } from '@/components/hearthstone/card-image';
import { cn } from '@/lib/utils';
import {
  getCardClassName,
  getRarityName,
  getCardTypeName,
  getCardName,
  getCardText,
  getCardTextForHTML
} from '@/lib/card-utils';

interface CardGridItemProps {
  id: string;
  name_zh: string;
  name_en: string | null;
  cost: number | null;
  attack: number | null;
  health: number | null;
  card_class: string;
  type: string;
  rarity: string;
  text_zh: string | null;
  text_en: string | null;
  imageUrls: {
    normal: string;
    tile: string;
    orig?: string;
    render?: string;
    '256x'?: string;
    '512x'?: string;
  };
  className?: string;
  onClick?: () => void;
  language?: 'zh' | 'en';
}

export function CardGridItem({
  id,
  name_zh,
  name_en,
  cost,
  attack,
  health,
  card_class,
  type,
  rarity,
  text_zh,
  text_en,
  imageUrls,
  className,
  onClick,
  language = 'zh'
}: CardGridItemProps) {
  // Get rarity border color and styles
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-amber-400/80 hover:border-amber-500',
          shadow: 'shadow-amber-400/30 hover:shadow-amber-400/50',
          glow: 'from-amber-400/10 via-amber-400/5 to-transparent',
          bg: 'bg-gradient-to-br from-amber-50/50 to-transparent'
        };
      case 'epic':
        return {
          border: 'border-purple-400/80 hover:border-purple-500',
          shadow: 'shadow-purple-400/30 hover:shadow-purple-400/50',
          glow: 'from-purple-400/10 via-purple-400/5 to-transparent',
          bg: 'bg-gradient-to-br from-purple-50/50 to-transparent'
        };
      case 'rare':
        return {
          border: 'border-blue-400/80 hover:border-blue-500',
          shadow: 'shadow-blue-400/30 hover:shadow-blue-400/50',
          glow: 'from-blue-400/10 via-blue-400/5 to-transparent',
          bg: 'bg-gradient-to-br from-blue-50/50 to-transparent'
        };
      case 'common':
        return {
          border: 'border-gray-300/80 hover:border-gray-400',
          shadow: 'shadow-gray-300/20 hover:shadow-gray-400/40',
          glow: 'from-gray-300/10 via-gray-300/5 to-transparent',
          bg: 'bg-gradient-to-br from-gray-50/50 to-transparent'
        };
      default:
        return {
          border: 'border-gray-300/80 hover:border-gray-400',
          shadow: 'shadow-gray-300/20 hover:shadow-gray-400/40',
          glow: 'from-gray-300/10 via-gray-300/5 to-transparent',
          bg: 'bg-gradient-to-br from-gray-50/50 to-transparent'
        };
    }
  };

  // Get class color for cost badge
  const getClassColor = (cardClass: string) => {
    switch (cardClass) {
      case 'mage': return 'bg-blue-500';
      case 'warrior': return 'bg-red-500';
      case 'hunter': return 'bg-green-500';
      case 'druid': return 'bg-amber-600';
      case 'warlock': return 'bg-purple-600';
      case 'priest': return 'bg-gray-700';
      case 'rogue': return 'bg-slate-700';
      case 'shaman': return 'bg-cyan-600';
      case 'paladin': return 'bg-yellow-600';
      case 'demonhunter': return 'bg-indigo-600';
      case 'deathknight': return 'bg-zinc-700';
      default: return 'bg-gray-500';
    }
  };

  const rarityStyles = getRarityStyles(rarity);

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:z-10 w-full',
        className
      )}
      onClick={onClick}
    >
      {/* Main card container with enhanced border */}
      <div className={cn(
        'relative bg-white rounded-lg overflow-hidden',
        'border-1 transition-all duration-300',
        rarityStyles.border,
        'shadow-lg hover:shadow-xl',
        rarityStyles.shadow
      )}
        style={{
          background: `linear-gradient(to bottom, ${rarityStyles.bg})`
        }}
      >
        {/* Rarity glow effect */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'bg-gradient-to-br pointer-events-none z-0',
          rarityStyles.glow
        )} />

        {/* Card image area */}
        <div className="relative aspect-[1/1.14] overflow-hidden">
          <CardImage
            cardId={id}
            cardName={name_zh}
            imageUrl={imageUrls.large || imageUrls.orig}
            size="large"
            className="w-full h-full"
            showLoading={false}
          />

          {/* Cost badge in top-left corner */}
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-lg border-2 border-white/80">
            <div className={cn(
              'w-full h-full rounded-full flex items-center justify-center',
              getClassColor(card_class)
            )}>
              {cost || 0}
            </div>
          </div>

          {/* Card type badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
            {getCardTypeName(type, language)}
          </div>

          {/* Rarity indicator dot */}
          <div className={cn(
            'absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-md',
            rarity === 'legendary' ? 'bg-amber-400' :
              rarity === 'epic' ? 'bg-purple-400' :
                rarity === 'rare' ? 'bg-blue-400' :
                  'bg-gray-400'
          )}></div>
        </div>

        {/* Bottom info section */}
        <div className={cn(
          'p-3 bg-gradient-to-br from-white to-gray-50 border-t border-gray-100',
          rarityStyles.bg
        )}>
          {/* Card name */}
          <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight flex items-center">
            {getCardName(name_zh, name_en, language)}
          </h3>

          {/* Card description (short preview) */}
          {(text_zh || text_en) && (
            <div
              className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed hearthstone-text"
              dangerouslySetInnerHTML={{
                __html: getCardTextForHTML(language, text_zh, text_en) || ''
              }}
            />
          )}

          {/* Stats and info */}
          <div className="flex items-center justify-between text-xs">
            {/* Left side: Card class */}
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-3 h-3 rounded-full',
                getClassColor(card_class)
              )}></div>
              <span className="text-gray-600">
                {getCardClassName(card_class, language)}
              </span>
            </div>

            {/* Right side: Attack/Health or Rarity */}
            <div className="flex items-center gap-2">
              {(type === 'minion' && attack !== null && health !== null) && (
                <div className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded">
                  <span className="text-red-400 font-bold">{attack}</span>
                  <span>/</span>
                  <span className="text-blue-400 font-bold">{health}</span>
                </div>
              )}

              {(type === 'weapon' && attack !== null && health !== null) && (
                <div className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded">
                  <span className="text-orange-400 font-bold">{attack}</span>
                  <span>/</span>
                  <span className="text-green-400 font-bold">{health}</span>
                </div>
              )}

              {!((type === 'minion' || type === 'weapon') && attack !== null && health !== null) && (
                <span className={cn(
                  'text-xs font-medium',
                  rarity === 'legendary' ? 'text-amber-600' :
                    rarity === 'epic' ? 'text-purple-600' :
                      rarity === 'rare' ? 'text-blue-600' :
                        'text-gray-600'
                )}>
                  {getRarityName(rarity, language)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Inner border decoration */}
        <div className={cn(
          'absolute inset-0 border-2 rounded-lg opacity-20 pointer-events-none',
          rarity === 'legendary' ? 'border-amber-400' :
            rarity === 'epic' ? 'border-purple-400' :
              rarity === 'rare' ? 'border-blue-400' :
                'border-gray-400'
        )}></div>
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl max-w-xs">
        <div className="font-medium mb-2 text-center">
          {getCardName(name_zh, name_en, language)}
        </div>

        {/* Card description in tooltip */}
        {(text_zh || text_en) && (
          <div
            className="text-gray-300 text-center mb-2 italic hearthstone-text text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getCardTextForHTML(language, text_zh, text_en) || ''
            }}
          />
        )}

        <div className="text-gray-400 text-center">
          {getRarityName(rarity, language)} • {getCardClassName(card_class, language)}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}

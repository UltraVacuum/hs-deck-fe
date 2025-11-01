'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardDisplayProps, HearthstoneCard } from '@/types/hearthstone';
import CardAnalysis from './CardAnalysis';

export default function CardDisplay({
  card,
  size = 'medium',
  showTooltip = true,
  onClick,
  isSelectable = false,
  isSelected = false,
  count,
  showCost = true,
  showStats = true,
  className = ''
}: CardDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = useMemo(() => ({
    small: 'w-12 h-16',
    medium: 'w-20 h-28',
    large: 'w-32 h-44'
  }), []);

  const rarityClasses = useMemo(() => ({
    common: '',
    rare: 'shadow-blue-400/30 hover:shadow-blue-400/50',
    epic: 'shadow-purple-400/30 hover:shadow-purple-400/50',
    legendary: 'shadow-amber-400/30 hover:shadow-amber-400/50 animate-pulse'
  }), []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const getCardBack = useCallback(() => {
    return `/images/card-backs/${card.playerClass.slug}.png`;
  }, [card.playerClass.slug]);

  const getRarityGlowColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-amber-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const renderCardContent = () => {
    if (imageError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex flex-col items-center justify-center p-2 border border-slate-600">
          <div className="text-center text-white">
            <div className="font-bold text-xs mb-1 truncate">{card.name}</div>
            <div className="text-lg font-bold text-blue-400">{card.cost}</div>
            {card.attack !== undefined && card.health !== undefined && (
              <div className="flex justify-center gap-2 text-xs">
                <span className="text-red-400">{card.attack}</span>
                <span className="text-green-400">{card.health}</span>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1 capitalize">{card.cardType}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {imageLoading && (
          <div className="absolute inset-0 bg-slate-800 rounded-lg animate-pulse" />
        )}

        <Image
          src={card.image}
          alt={card.name}
          fill
          className={`object-contain transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          } ${card.rarity === 'legendary' ? 'animate-subtle-glow' : ''}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={size === 'large'}
          sizes="(max-width: 768px) 80px, 128px"
        />

        {/* Card Count Badge */}
        {count && count > 1 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
            {count}
          </div>
        )}

        {/* Mana Cost Overlay */}
        {showCost && (
          <div className="absolute top-1 left-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs border border-blue-400 shadow-md">
            {card.cost}
          </div>
        )}

        {/* Attack/Health Overlay for Minions */}
        {showStats && card.cardType === 'minion' && card.attack !== undefined && card.health !== undefined && (
          <>
            <div className="absolute bottom-1 left-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-md">
              {card.attack}
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-md">
              {card.health}
            </div>
          </>
        )}

        {/* Weapon Durability */}
        {showStats && card.cardType === 'weapon' && card.attack !== undefined && card.durability !== undefined && (
          <>
            <div className="absolute bottom-1 left-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-md">
              {card.attack}
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-md">
              {card.durability}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderTooltip = () => {
    if (!showTooltip || !isHovered) return null;

    return (
      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-80 p-4 bg-slate-900/95 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {!imageError ? (
              <Image
                src={card.image}
                alt={card.name}
                width={60}
                height={84}
                className="object-contain rounded"
                onError={handleImageError}
              />
            ) : (
              <div className="w-[60px] h-[84px] bg-slate-700 rounded flex items-center justify-center">
                <div className="text-center text-white p-1">
                  <div className="text-xs font-bold truncate">{card.name}</div>
                  <div className="text-lg">{card.cost}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              {card.name}
              <span className={`px-1.5 py-0.5 text-xs rounded bg-gradient-to-r ${getRarityGlowColor(card.rarity)} text-white`}>
                {card.rarity === 'common' ? '普通' :
                 card.rarity === 'rare' ? '稀有' :
                 card.rarity === 'epic' ? '史诗' : '传说'}
              </span>
            </h4>

            <div className="text-xs text-gray-400 mb-2">
              {card.cost} 法力 • {card.playerClass.name} • {
                card.cardType === 'minion' ? '随从' :
                card.cardType === 'spell' ? '法术' :
                card.cardType === 'weapon' ? '武器' :
                card.cardType === 'hero' ? '英雄' : '地点'
              }
            </div>

            <div className="text-xs text-gray-300 leading-relaxed mb-2">
              {card.text.replace(/<[^>]*>/g, '').replace(/\\n/g, ' ')}
            </div>

            {card.flavorText && (
              <div className="text-xs text-gray-500 italic mb-2">
                "{card.flavorText}"
              </div>
            )}

            {card.mechanics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.mechanics.map((mechanic) => (
                  <span
                    key={mechanic}
                    className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded border border-amber-500/30"
                  >
                    {mechanic}
                  </span>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500">
              {card.set} • {card.artist && `插画: ${card.artist}`}
            </div>
          </div>
        </div>

        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="w-2 h-2 bg-amber-500/30 border-r border-b border-amber-500/30 transform rotate-45" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative inline-block ${sizeClasses[size]} ${rarityClasses[card.rarity]} ${
          isSelectable ? 'cursor-pointer' : ''
        } ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900' : ''} ${
          isSelectable ? 'hover:scale-105' : ''
        } transform transition-all duration-300 ${
          isHovered ? '-translate-y-1 scale-110' : ''
        } ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {renderCardContent()}
        {renderTooltip()}

        {/* Selection indicator */}
        {isSelectable && (
          <div className={`absolute inset-0 rounded-lg border-2 transition-colors ${
            isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-transparent hover:border-amber-500/50'
          }`} />
        )}

        {/* Rarity glow effect for legendary cards */}
        {card.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Add CardAnalysis component for large card displays */}
      {size === 'large' && (
        <CardAnalysis
          card={card as unknown as HearthstoneCard}
          className="mt-4 w-full"
        />
      )}
    </>
  );
}

// Card size presets for different contexts
export const CardSizes = {
  DECK_LIST: 'small' as const,
  HAND_VIEW: 'medium' as const,
  DETAILED_VIEW: 'large' as const,
  THUMBNAIL: 'small' as const
};

// Custom hook for card image optimization
export const useCardImage = (card: Card) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return {
    isLoaded,
    hasError,
    handleLoad,
    handleError,
    src: hasError ? null : card.image,
    fallbackSrc: '/images/card-back.png'
  };
};
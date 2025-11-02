import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CardImageProps {
  cardId: string;
  cardName: string;
  imageUrl: string;
  renderUrl?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'card';
  showLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CardImage({
  cardId,
  cardName,
  imageUrl,
  renderUrl,
  size = 'medium',
  showLoading = true,
  className,
  onClick
}: CardImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 预加载图片
  React.useEffect(() => {
    const img = new Image();
    const imageSrc = renderUrl || imageUrl;

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setImageError(true);
      setIsLoading(false);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [renderUrl, imageUrl]);

  const sizeClasses = {
    small: 'w-12 h-16',
    medium: 'w-24 h-32',
    large: 'w-48 h-64',
    xlarge: 'w-64 h-64',
    card: 'w-16 h-16' // 标准 Hearthstone 卡牌缩略图尺寸
  };

  const fallbackImage = () => (
    <div className={cn(
      sizeClasses[size],
      'bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center',
      className
    )}>
      <div className="text-center">
        <div className="text-xs font-bold text-gray-700">卡牌</div>
        <div className="text-xs text-gray-500">图片加载失败</div>
      </div>
    </div>
  );


  if (imageError) {
    return fallbackImage();
  }

  const backgroundImageStyle = {
    backgroundImage: `url(${renderUrl || imageUrl})`,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
    backgroundRepeat: 'no-repeat' as const,
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden shadow-md hover:shadow-xl transition-shadow',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      style={backgroundImageStyle}
      onClick={onClick}
    >
      {isLoading && showLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import MetaDashboard from '@/components/hearthstone/meta/MetaDashboard';

export default function MetaPage() {
  useEffect(() => {
    document.title = '炉石传说元数据分析 | Hearthstone Meta Analysis';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '实时分析炉石传说标准、狂野、经典模式的元数据，包括卡组分级、胜率统计、职业分布等专业数据。');
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
            元数据分析中心
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Hearthstone Meta Analysis Center
          </p>
          <p className="text-lg text-gray-400">
            深入了解当前环境趋势，优化你的卡组策略
          </p>
        </div>

        <MetaDashboard />
      </div>
    </div>
  );
}
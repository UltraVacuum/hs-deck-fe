'use client';

import { useEffect } from 'react';
import Navigation from '@/components/local/navigation';
import DiscoveryLabContent from '@/components/discovery/DiscoveryLabContent';

export default function DiscoveryPage() {
  useEffect(() => {
    document.title = '卡牌发现实验室 | Card Discovery Lab - HsTopDecks';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '探索炉石传说卡牌的无限可能，发现意想不到的组合，创建独特的卡组策略');
    }
  }, []);
  return (
    <div className="relative bg-gray-50 min-h-screen">
      <Navigation />

      <main>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                卡牌发现实验室 | Card Discovery Lab
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                探索卡牌协同作用，发现意想不到的组合，创造独特的制胜策略
              </p>
              <p className="text-lg text-gray-600 mt-2">
                Discover card synergies, find unexpected combinations, and create unique winning strategies
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <DiscoveryLabContent />
      </main>
    </div>
  );
}
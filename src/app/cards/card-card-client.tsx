'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Grid, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CardCard } from '@/components/hearthstone/card-card';
import { useCards, type Card } from '@/hooks/use-cards';

export function CardCardClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    rarity: '',
    type: '',
    minCost: 0,
    maxCost: 10
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { cards, loading, error, pagination } = useCards({
    page: currentPage,
    limit: 8, // 减少每页显示数量以适应更大的卡牌尺寸
    search: searchTerm,
    class: filters.class,
    rarity: filters.rarity,
    type: filters.type,
    minCost: filters.minCost,
    maxCost: filters.maxCost
  });

  const handleCardClick = (card: Card) => {
    // TODO: Implement card detail modal or navigation
    console.log('Card clicked:', card);
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      class: '',
      rarity: '',
      type: '',
      minCost: 0,
      maxCost: 10
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.class || filters.rarity || filters.type || filters.minCost > 0 || filters.maxCost < 10 || searchTerm;
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索卡牌... | Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-8">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  清除筛选
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Lab Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  卡牌发现实验室 | Card Discovery Lab
                </h2>
                <p className="text-blue-100">
                  探索卡牌协同作用，发现意想不到的组合，创造独特的制胜策略
                </p>
              </div>
            </div>
            <Link href="/discovery" className="group">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center gap-2 group-hover:shadow-lg">
                <Sparkles className="w-5 h-5" />
                进入实验室 | Enter Lab
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar - Collapsible */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">筛选条件</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">职业</label>
                    <select
                      value={filters.class}
                      onChange={(e) => handleFilterChange('class', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">全部职业</option>
                      <option value="neutral">中立</option>
                      <option value="warrior">战士</option>
                      <option value="mage">法师</option>
                      <option value="hunter">猎人</option>
                      <option value="druid">德鲁伊</option>
                      <option value="warlock">术士</option>
                      <option value="priest">牧师</option>
                      <option value="rogue">潜行者</option>
                      <option value="shaman">萨满祭司</option>
                      <option value="paladin">圣骑士</option>
                      <option value="demonhunter">恶魔猎手</option>
                      <option value="deathknight">死亡骑士</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">费用范围</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">最小:</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={filters.minCost}
                          onChange={(e) => handleFilterChange('minCost', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">最大:</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={filters.maxCost}
                          onChange={(e) => handleFilterChange('maxCost', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">全部类型</option>
                      <option value="minion">随从</option>
                      <option value="spell">法术</option>
                      <option value="weapon">武器</option>
                      <option value="hero">英雄</option>
                      <option value="hero_power">英雄技能</option>
                      <option value="location">地点</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">稀有度</label>
                    <select
                      value={filters.rarity}
                      onChange={(e) => handleFilterChange('rarity', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">全部稀有度</option>
                      <option value="legendary">传说</option>
                      <option value="epic">史诗</option>
                      <option value="rare">稀有</option>
                      <option value="common">普通</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card Grid */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">加载卡牌中...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-red-600 mb-4">⚠️</div>
                  <p className="text-gray-600 mb-4">加载失败: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    重试
                  </button>
                </div>
              </div>
            )}

            {/* Cards Display */}
            {!loading && !error && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    找到 {pagination.total} 张卡牌
                    {pagination.total > 0 && (
                      <span className="text-sm text-gray-600 ml-2">
                        第 {currentPage} / {pagination.totalPages} 页
                      </span>
                    )}
                  </h2>
                </div>

                {cards.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎴</div>
                      <p className="text-gray-600 text-lg mb-2">没有找到符合条件的卡牌</p>
                      <p className="text-gray-500 text-sm">尝试调整筛选条件或搜索关键词</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-8">
                      {cards.map((card) => (
                        <CardCard
                          key={card.id}
                          {...card}
                          onClick={() => handleCardClick(card)}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>上一页</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (currentPage > 3) {
                              pageNum = currentPage - 2 + i;
                            }
                            if (pageNum > pagination.totalPages) return null;

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-lg border ${
                                  pageNum === currentPage
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                          disabled={currentPage === pagination.totalPages}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>下一页</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
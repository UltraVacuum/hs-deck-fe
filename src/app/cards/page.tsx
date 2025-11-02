import type { Metadata } from 'next'
import { BasicLayout } from '@/components/local/layout';
import Link from 'next/link';
import { Search, Sparkles, Filter, Grid } from 'lucide-react';
import Navigation from '@/components/local/navigation';

// 简化的卡牌数据
const mockCards = [
  {
    id: '1',
    name: '炎爆术',
    cost: 10,
    rarity: 'legendary',
    cardType: 'spell',
    playerClass: '法师',
    text: '造成10点伤害'
  },
  {
    id: '2',
    name: '弗丁',
    cost: 8,
    rarity: 'legendary',
    cardType: 'minion',
    playerClass: '圣骑士',
    text: '嘲讽，亡语：装备一把5/2的灰烬使者'
  },
  {
    id: '3',
    name: '火球术',
    cost: 4,
    rarity: 'common',
    cardType: 'spell',
    playerClass: '法师',
    text: '造成6点伤害'
  },
  {
    id: '4',
    name: '飞刀杂耍',
    cost: 2,
    rarity: 'epic',
    cardType: 'minion',
    playerClass: '潜行者',
    text: '战吼：随机对一个敌人造成1点伤害'
  }
];

export async function generateMetadata(): Promise<Metadata> {
    const title = `炉石传说卡牌数据库 - 高级搜索与性能分析`
    const description = `全面的炉石传说卡牌数据库，支持高级搜索、筛选和性能数据分析。查找最适合的卡牌构筑强力卡组。`
    return {
        title,
        openGraph: {
            title,
            description,
            url: 'https://hstopdecks.com/cards',
            siteName: 'hstopdecks',
            images: [
                '/logo.png',
            ],
        },
    }
}

export default function CardsPage() {
  return (
    <BasicLayout>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="搜索卡牌... | Search cards..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-8">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>筛选</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Grid className="w-4 h-4" />
                  <span>视图</span>
                </button>
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
            {/* Filter Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">筛选条件</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">职业</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>全部职业</option>
                      <option>战士</option>
                      <option>法师</option>
                      <option>猎人</option>
                      <option>德鲁伊</option>
                      <option>术士</option>
                      <option>牧师</option>
                      <option>潜行者</option>
                      <option>萨满祭司</option>
                      <option>圣骑士</option>
                      <option>恶魔猎手</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">费用</label>
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(cost => (
                        <label key={cost} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span>{cost}法力</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>随从</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>法术</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>武器</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>英雄</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>地点</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">稀有度</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>传说</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>史诗</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>稀有</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>普通</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  找到 {mockCards.length} 张卡牌
                </h2>
                <div className="text-sm text-gray-600">
                  按相关性排序
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockCards.map((card) => (
                  <div key={card.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 mb-2">{card.cost}</div>
                        <div className="text-sm text-gray-600">法力值</div>
                      </div>
                      <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${
                        card.rarity === 'legendary' ? 'bg-amber-500' :
                        card.rarity === 'epic' ? 'bg-purple-500' :
                        card.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{card.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <div>{card.playerClass} • {
                          card.cardType === 'minion' ? '随从' :
                          card.cardType === 'spell' ? '法术' :
                          card.cardType === 'weapon' ? '武器' :
                          card.cardType === 'hero' ? '英雄' : '地点'
                        }</div>
                        <div className={`inline-block px-2 py-1 text-xs rounded ${
                          card.rarity === 'legendary' ? 'bg-amber-100 text-amber-800' :
                          card.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                          card.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {card.rarity === 'legendary' ? '传说' :
                           card.rarity === 'epic' ? '史诗' :
                           card.rarity === 'rare' ? '稀有' : '普通'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}

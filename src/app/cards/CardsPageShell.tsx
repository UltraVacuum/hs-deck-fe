import Link from 'next/link';
import { Beaker, Sparkles, ArrowRight, Search, Loader2 } from 'lucide-react';

export default function CardsPageShell() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header Skeleton */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <div className="w-full h-12 bg-gray-200 rounded-lg pl-10 pr-4 animate-pulse"></div>
                    </div>

                    {/* Quick Filters Skeleton */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-400 mr-2">快速筛选:</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-16 h-8 bg-gray-300 rounded animate-pulse"></div>
                            ))}
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
                                <Beaker className="w-8 h-8" />
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
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Filter Sidebar Skeleton */}
                <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">筛选器</h3>
                        </div>

                        {/* Filter Categories Skeleton */}
                        <div className="space-y-2">
                            {['职业', '费用', '稀有度'].map((category) => (
                                <div key={category} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-900 font-medium">{category}</span>
                                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    <div className="mt-3 h-20 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card Grid Skeleton */}
                <div className="flex-1 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            搜索结果
                        </h2>
                        <p className="text-gray-400">
                            正在加载卡牌数据...
                        </p>
                    </div>

                    {/* Cards Grid Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-300 rounded-lg animate-pulse"></div>
                        ))}
                    </div>

                    {/* Load More Button Skeleton */}
                    <div className="flex justify-center">
                        <div className="px-6 py-3 h-10 bg-gray-300 rounded-lg animate-pulse flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            加载中...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
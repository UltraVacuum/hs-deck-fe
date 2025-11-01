'use client';

import Link from 'next/link';
import SearchHeader from '@/components/cards/SearchHeader';
import FilterSidebar from '@/components/cards/FilterSidebar';
import CardGrid from '@/components/cards/CardGrid';
import { useSearchSync } from '@/hooks/useSearchSync';
import { Beaker, Sparkles, ArrowRight } from 'lucide-react';

export default function CardsPageClient() {
    useSearchSync(); // Sync URL with search state

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchHeader />

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
                <FilterSidebar />
                <CardGrid />
            </div>
        </div>
    );
}
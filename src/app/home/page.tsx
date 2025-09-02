import { createClient } from "@/supabase/server";

import Navigation from "@/components/local/navigation";
import { ErrorView } from "@/components/local/layout";

import Hero from './components/hero'
import SubPanels from './components/sub-panels';
import ColorSets from './components/color-sets';
import ThemePanels from './components/theme-panels';
import DecksSection from './components/decks-section';
import NewsSection from './components/news-section';
import UpdatesSection from './components/updates-section';

interface DataItem {
    hex: string;
    color: string;
    count: number;
}

interface GetDataResult {
    data: DataItem[];
    error: Error | null;
}

const getData = async (): Promise<GetDataResult> => {
    try {
        const pg = Math.round(Math.random() * 10 + 1) // page
        const ps = 24 * 12 // page size
        const skip = pg * ps
        const supabase = createClient()
        const result = await supabase
            .from('cards')
            .select('*')
            .range(skip + 1, skip + ps)
        
        // 确保返回的数据格式与 ColorItemBasic 组件兼容
        if (result.data && result.data.length > 0) {
            // 将 supabase 返回的数据转换为所需格式
            const formattedData = result.data.map((item: any) => ({
                hex: item.hex || `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                color: item.color || `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`,
                count: item.count || Math.floor(Math.random()*100) + 1
            }));
            return { data: formattedData, error: result.error };
        }
        
        // 如果没有数据，返回默认的模拟数据
        return {
            data: Array.from({ length: 24 }, (_, i) => ({
                hex: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                color: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`,
                count: Math.floor(Math.random()*100) + 1
            })),
            error: null
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        // 返回默认的模拟数据，但保留错误信息
        const errorObj = error instanceof Error ? error : new Error(String(error));
        return {
            data: Array.from({ length: 24 }, (_, i) => ({
                hex: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                color: `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`,
                count: Math.floor(Math.random()*100) + 1
            })),
            error: errorObj
        };
    }
}

export default async function Home() {
    const { data, error } = await getData()

    if (error) return (
        <ErrorView>
            {error.message || 'Unknown error occurred'}
        </ErrorView>
    )

    return (
        <div className="relative">
            <Navigation />
            <Hero />
            <ThemePanels />
            <div className="min-h-screen md:px-24 px-8 space-y-8">
                {/* Hearthstone Content Sections */}
                <div className="space-y-6">
                    <DecksSection />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <NewsSection />
                        <UpdatesSection />
                    </div>
                </div>
                
                {/* Existing Content */}
                <ColorSets colorSets={data} />
                <SubPanels />
            </div>
        </div>
    )
}

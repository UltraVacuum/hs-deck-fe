import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import CardsPageShell from './CardsPageShell';

// Dynamically import the client component to allow static generation
const CardsPageClient = dynamic(() => import('./CardsPageClient'), {
    ssr: false,
    loading: () => <CardsPageShell />
});

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

export default function Page() {
    return (
        <BasicLayout>
            <Suspense fallback={<CardsPageShell />}>
                <CardsPageClient />
            </Suspense>
        </BasicLayout>
    )
}

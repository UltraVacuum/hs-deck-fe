import type { Metadata } from 'next'
import { BasicLayout } from '@/components/local/layout';
import Navigation from '@/components/local/navigation';
import { CardGridInfinite } from './components/card-grid-infinite';

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
      <CardGridInfinite />
    </BasicLayout>
  );
}

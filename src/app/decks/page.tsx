import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";

export async function generateMetadata(): Promise<Metadata> {
    const title = `发现炉石传说最新卡组套牌信息`
    const description = `发现炉石传说最新标准、狂野、乱斗、竞技场卡组，帮助快速天梯上分。`
    return {
        title,
        openGraph: {
            title,
            description,
            url: 'https://hstopdecks.com',
            siteName: 'hstopdecks',
            images: [
                '/logo.png',
            ],
        },
    }
}

export default async function Page() {
    return (
        <BasicLayout>
            马上上线...
        </BasicLayout>
    )
}

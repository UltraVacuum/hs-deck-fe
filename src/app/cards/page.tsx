import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";
import Flow from './components/flow'

export async function generateMetadata(): Promise<Metadata> {
    const title = `浏览炉石传说最新卡牌信息`
    const description = `发现炉石传说最新版本卡牌，构筑顶级卡组。`
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
            <Flow />
        </BasicLayout>
    )
}

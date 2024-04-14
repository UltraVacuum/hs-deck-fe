import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";
import Content from './sections/content'

export async function generateMetadata(): Promise<Metadata> {
    // read route params
    // fetch data
    // optionally access and extend (rather than replace) parent metadata
    const title = `About`
    const description = `Get to know more about hstopdecks.`

    return {
        title,
        openGraph: {
            title,
            description,
            url: 'https://hstopdecks.com',
            siteName: 'Color Stack',
            images: [
                '/logo.png',
            ],
        },
    }
}

export default function About() {
    return (
        <BasicLayout>
            <Content />
        </BasicLayout>
    )
}

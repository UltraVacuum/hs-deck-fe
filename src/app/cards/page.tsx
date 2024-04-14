import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";
import Flow from './components/flow'

export async function generateMetadata(): Promise<Metadata> {
  const title = `Color sets Explore.`
  const description = `Explore popular color sets on color stack.`
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

export default async function Page() {
  return (
    <BasicLayout>
      <Flow />
    </BasicLayout>
  )
}

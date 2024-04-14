import type { Metadata } from 'next'
import { BasicLayout } from "@/components/local/layout";
import ColorFlow from './components/flow';

export async function generateMetadata(): Promise<Metadata> {
  // read route params
  // fetch data
  // optionally access and extend (rather than replace) parent metadata
  const title = `Trending Explore.`
  const description = `Explore trending popular site theme colors on color stack today.`
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

export default function Page() {
  return (
    <BasicLayout>
      <ColorFlow api={`/api/explore`} />
    </BasicLayout>
  )
}

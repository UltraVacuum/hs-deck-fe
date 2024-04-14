import type { Metadata, ResolvingMetadata } from 'next'
import { createClient } from "@/supabase/server";
import { BasicLayout } from "@/components/local/layout";
import Main from './components/main';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function fetchMata(id: string | number) {
  const supabase = createClient()
  return await supabase
    .from('page_colors')
    .select(`*, 
            user:users(
                id,
                avatar:user_meta->avatar_url,
                name:user_meta->full_name
                )
            )`)
    .eq('id', id)
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  // fetch data
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  const { data: [meta], error }: any = await fetchMata(params.id)

  const domain = new URL(meta.page_url).hostname
  const title = `Explore theme colors on ${domain}`
  const description = `Explore theme colors on ${domain}, stacked by ${meta.user.name} at ${meta.updated_at}`

  return {
    title,
    openGraph: {
      title,
      description,
      url: 'https://hstopdecks.com',
      siteName: 'Color Stack',
      images: [
        '/logo.png',
        ...previousImages
      ],
    },
  }
}

export default async function Page({
  params
}: { params: { id: string } }) {
  return (
    <BasicLayout>
      <Main eid={params.id} />
    </BasicLayout>
  )
}

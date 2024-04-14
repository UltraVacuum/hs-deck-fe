'use client';
import useSWR from "swr";
import { fetcher, } from "@/lib/utils";
import {
    ContentLayout,
    ErrorView
} from "@/components/client/layout";
import { LoadingView } from '@/app/explore/components/flow'
import SitePanel from './site-panel';

const PAGE_SIZE = 16

const Layout = ({ children }: any) => {
    return (
        <ContentLayout>
            <h2 className="text-4xl text-center font-mono font-extrabold py-8">
                最新标准卡组.
            </h2>
            {children}
        </ContentLayout>
    )
}

export default function ThemePanels() {
    // const randPage = Math.ceil(Math.random() * 12)

    const { data, error, isLoading } = useSWR(
        `/api/explore?page_size=${PAGE_SIZE}&page=${1}`,
        fetcher
    )

    if (isLoading) {
        return (
            <Layout>
                <LoadingView />
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <ErrorView>
                    {error.message}
                </ErrorView>
            </Layout>
        )
    }

    return (
        <Layout>
            <SitePanel collects={data} />
        </Layout>
    )
}

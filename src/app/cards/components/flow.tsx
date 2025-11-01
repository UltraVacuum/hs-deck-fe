'use client';
import useSWRInfinite from "swr/infinite";
import { fetcher } from '@/lib/utils';
import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton";
import {
    ContentLayout,
    ErrorView
} from "@/components/client/layout";
import ColorCard from './color-card'

import ColorSort from "@/lib/color-sort";
import { SORT_BY_RGB, MODE_LIGHT } from "@/const";

const PAGE_SIZE = 30

const LoadingView = () => {
    const SKELETON_SIZE = 12
    const sks = new Array(SKELETON_SIZE).fill(1).map((a, i) => i)
    return (
        <div className="grid grid-cols-6 gap-2">
            {
                sks.map((a, i) => {
                    return (
                        <Skeleton
                            key={i}
                            className="h-24 w-full"
                        />
                    )
                })
            }
        </div>
    )
}

export default function Flow() {

    const {
        data,
        error,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading
    } = useSWRInfinite(
        (page) =>
            `/api/color-sets?page_size=${PAGE_SIZE}&page=${page + 1}`,
        fetcher
    );

    if (error) return (
        <ContentLayout>
            <ErrorView>
                {error.message}
            </ErrorView>
        </ContentLayout>
    )

    const allRows = data ? [].concat(...data) : [];
    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    const isRefreshing = isValidating && data && data.length === size;

    // const sortedList = ColorSort(allRows, SORT_BY_RGB, MODE_LIGHT)
    // console.log(allRows)

    return (
        <ContentLayout>
            <div className="grid grid-cols-6 gap-2 mb-2">
                {allRows.map((d: any, i: any) => {
                    return (
                        <ColorCard key={i} color={d} />
                    )
                })}
            </div>
            {isLoadingMore ?
                <LoadingView /> :
                <div className="flex align-center justify-center">
                    <Button
                        onClick={() => {
                            setSize(size + 1)
                        }}
                        variant="outline">
                        Load More
                    </Button>
                </div>
            }
        </ContentLayout>
    )
}

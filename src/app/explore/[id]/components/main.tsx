'use client';
import useSWR from "swr";
import {
    useState,
    useEffect
} from "react";
import {
    MinusCircle, PlusCircle
} from 'lucide-react';
import {
    fetcher,
    revelJson
} from "@/lib/utils";
import {
    filterGray,
    filterWhite,
    filterBlack
} from "@/lib/color-filter"

import ColorSort from '@/lib/color-sort';
import {
    ContentLayout,
    ErrorView
} from "@/components/client/layout";
import {
    ToggleGroup,
    ToggleGroupItem
} from "@/components/ui/toggle-group"
import {
    Slider
} from "@/components/ui/slider"

import {
    SORT_BY_RGB,
    SORT_BY_HSV,
    SORT_BY_HSL,
    SORT_BY_HUE,
    SORT_BY_LUM,
    MODE_LIGHT,
    MODE_DARK,
    FILTER_WHITE,
    FILTER_BLACK,
    FILTER_GREY,
} from "@/const";

import PageHead from './head'
import ColorItem from './item'
import Loading from './loading'

import './main.css';

const THRESHOLD_MIN = 0
const THRESHOLD_MAX = 125

type FILTERS = 'white' | 'black' | 'grey'

type THRESHOLD = {
    [FILTER_WHITE]: number,
    [FILTER_BLACK]: number,
    [FILTER_GREY]: number
}

const filterFunc = {
    [FILTER_WHITE]: filterWhite,
    [FILTER_BLACK]: filterBlack,
    [FILTER_GREY]: filterGray
}

const initThreshold = {
    [FILTER_WHITE]: THRESHOLD_MAX,
    [FILTER_BLACK]: THRESHOLD_MAX,
    [FILTER_GREY]: THRESHOLD_MAX
}

export default function Main({ eid }: { eid: string }) {

    const [sort, setSort] = useState(SORT_BY_RGB);
    const [mode, setMode] = useState(MODE_LIGHT);
    const [showColor, setShowColor] = useState([]);
    const [pageData, setPageData] = useState<any>(null);
    const [filter, setFilter] = useState<Array<string>>([]);

    const [threshold, setThreshold] = useState<THRESHOLD>(initThreshold);

    const sortFunc = [
        SORT_BY_RGB,
        SORT_BY_HSV,
        SORT_BY_HSL,
        SORT_BY_HUE,
        SORT_BY_LUM,
    ]

    const sortMode = [MODE_LIGHT, MODE_DARK]
    const filterMode: Array<FILTERS> = [FILTER_BLACK, FILTER_WHITE, FILTER_GREY]

    const minusThreshold = (t: FILTERS) => {
        const v = threshold[t]
        if (v > THRESHOLD_MIN) {
            setThreshold({
                ...threshold,
                [t]: v - 1
            })
        }
    }

    const addThreshold = (t: FILTERS) => {
        const v = threshold[t]
        if (v < THRESHOLD_MAX) {
            setThreshold({
                ...threshold,
                [t]: v + 1
            })
        }
    }

    const { data, error, isLoading } = useSWR(
        `/api/explore/${eid}`,
        fetcher
    )

    // load effect
    useEffect(() => {
        function pageInit() {
            const [item]: any = data
            setPageData(item)
            const prevColor = revelJson(item.page_colors)
            const sc = ColorSort(prevColor, sort, mode)
            setShowColor(sc)
        }
        if (!isLoading) pageInit()
    }, [isLoading, data, sort, mode])

    // sort effect
    useEffect(() => {
        const sc = ColorSort(showColor, sort, mode)
        setShowColor(sc)
    }, [sort, mode])

    // filter effect
    useEffect(() => {
        if (!pageData) return
        let sc = pageData.page_colors
        for (let k of filterMode) {
            if (filter.indexOf(k) > -1) {
                const fn = filterFunc[k]
                const t = threshold[k]
                sc = sc.filter(({ rgb }: any) => fn(rgb, t))
            }
        }
        sc = ColorSort(sc, sort, mode)
        setShowColor(sc)
    }, [filter, threshold])

    if (isLoading || !pageData) return (
        <ContentLayout>
            <Loading />
        </ContentLayout>
    )

    if (error) return (
        <ContentLayout>
            <ErrorView>
                {error.message}
            </ErrorView>
        </ContentLayout>
    )

    return (
        <ContentLayout>
            <PageHead item={pageData} />
            <div className="my-8">
                <div className="flex items-center px-2 mb-2 space-x-2">
                    <span className="flex-none w-18">sort by</span>
                    <ToggleGroup
                        onValueChange={setSort}
                        value={sort}
                        type="single">
                        {
                            sortFunc.map((s: any, i: any) => {
                                return (
                                    <ToggleGroupItem
                                        key={i}
                                        value={s}
                                        aria-label="Toggle italic">
                                        {s}
                                    </ToggleGroupItem>
                                )
                            })
                        }
                    </ToggleGroup>
                    <ToggleGroup
                        onValueChange={setMode}
                        value={mode}
                        type="single">
                        {
                            sortMode.map((s: any, i: any) => {
                                return (
                                    <ToggleGroupItem
                                        key={i}
                                        value={s}
                                        aria-label="Toggle italic">
                                        {s}
                                    </ToggleGroupItem>
                                )
                            })
                        }
                    </ToggleGroup>
                </div>
                <div className="flex items-center px-2 mb-2 space-x-2">
                    <span className="flex-none w-18">filter by</span>
                    <ToggleGroup
                        className="flex flex-col w-full"
                        onValueChange={(v: any) => {
                            // console.log(v)
                            setFilter(v)
                        }}
                        value={filter}
                        type="multiple"
                        orientation='vertical'
                    >
                        {
                            filterMode.map((s: FILTERS, i: number) => {
                                return (
                                    <div
                                        key={i}
                                        className="w-full flex flex-1 items-center"
                                    >
                                        <ToggleGroupItem
                                            value={s}
                                            className="w-24"
                                            aria-label={`filter by ${s}`}>
                                            {s}
                                        </ToggleGroupItem>
                                        <p className="flex-none w-60 text-black mx-2">
                                            current threshold:
                                            <span className="text-green-500 text-bold ml-2">
                                                {threshold[s]}
                                            </span>
                                        </p>
                                        <div className="flex-1 flex items-center space-x-2">
                                            <span>{THRESHOLD_MIN}</span>
                                            <MinusCircle
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    minusThreshold(s)
                                                }} />
                                            <Slider
                                                defaultValue={[threshold[s]]}
                                                value={[threshold[s]]}
                                                max={THRESHOLD_MAX}
                                                step={5}
                                                onValueChange={([v]) => {
                                                    setThreshold({
                                                        ...threshold,
                                                        [s]: v
                                                    })
                                                }}
                                            />
                                            <PlusCircle
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    addThreshold(s)
                                                }} />
                                            <span>{THRESHOLD_MAX}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ToggleGroup>
                </div>
                <div className="flex items-center px-2 mb-2 space-x-4">
                    <p className="flex-none">
                        total colors:
                        <span className="text-green-500 text-bold ml-2">
                            {pageData.page_colors.length}
                        </span>
                    </p>
                    <p className="flex-none">
                        filtered colors:
                        <span className="text-green-500 text-bold ml-2">
                            {pageData.page_colors.length - showColor.length}
                        </span>
                    </p>
                    <p className="flex-none italic text-slate-500">
                        if all the colors are filtered, you can slide the threshold to get the perfect colors.
                    </p>
                </div>
                <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
                    {
                        showColor.map((c: any, idx: any) => {
                            return <ColorItem color={c} key={idx} />
                        })
                    }
                </div>
            </div>
        </ContentLayout>
    )
}

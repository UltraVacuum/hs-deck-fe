import { chunk, slice, shuffle } from "lodash"

import './dy-hero.scss';

const LINE_SIZE = 14
const THEME_SIZE = 5

const genRdx = (n: number) => Math.floor(Math.random() * n)

const reLoop = (arr: Array<any>, start: number) => {
    const left = slice(arr, 0, start)
    const right = slice(arr, start, arr.length)
    return [...right, ...left]
}

const ThemeBlock = ({ theme }: any) => {
    return (
        <div className="flex-none flex items-center border rounded-sm overflow-hidden">
            {
                theme.map((c: any, i: any) => {
                    return (
                        <div
                            className="flex-none w-8 h-8"
                            key={i}
                            style={{
                                background: `https://art.hearthstonejson.com/v1/256x/${c.id}.jpg`
                            }}
                        ></div>
                    )
                })
            }
        </div>
    )
}

const LineBlock = ({ line }: any) => {
    // line block
    const ls = genRdx(line.length)
    const loopLine = reLoop(line, ls)
    const themes = chunk(loopLine, THEME_SIZE)
    return (
        <div className="scroll-line flex flex-nowrap space-x-4">
            {
                themes.map((t: any, ii: any) => {
                    return (
                        <ThemeBlock theme={t} key={ii} />
                    )
                })
            }
        </div>
    )
}

export default function DyHero({ colorSets }: any) {
    // const lines = chunk(colorSets, LINE_SIZE)
    const lines = new Array(LINE_SIZE).fill(1)
    const shLine = shuffle(colorSets)
    return (
        <div className="container w-full md:w-2/5"
        >
            <div className="w-full rounded-2xl overflow-hidden dy-content ">
                <div className="is-animating space-y-4 md:-rotate-6">
                    {
                        lines.map((ln: any, i: any) => {
                            return (
                                <LineBlock line={shLine} key={i} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

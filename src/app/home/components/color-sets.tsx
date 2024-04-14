import ColorItemBasic from '@/components/local/color-item';
import {
    ContentLayout,
    ErrorView
} from "@/components/client/layout";

export default function ColorSets({ colorSets }: any) {
    return (
        <ContentLayout>
            <div className="z-10 w-full mb-8">
                <p className="text-4xl text-center font-mono font-extrabold">
                    狂野卡组收集中....
                </p>
            </div>
            <div className="flex flex-wrap mx-auto">
                {
                    colorSets.map((color: any, idx: number) => {
                        return <ColorItemBasic
                            color={color}
                            key={idx} />
                    })
                }
            </div>
        </ContentLayout>
    )
}

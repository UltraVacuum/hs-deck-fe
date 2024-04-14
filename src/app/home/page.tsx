import { createClient } from "@/supabase/server";

import Navigation from "@/components/local/navigation";
import { ErrorView } from "@/components/local/layout";

import Hero from './components/hero'
import SubPanels from './components/sub-panels';
import ColorSets from './components/color-sets';
import ThemePanels from './components/theme-panels';

const getData = async () => {
    const pg = Math.round(Math.random() * 10 + 1) // page
    const ps = 24 * 12 // page size
    const skip = pg * ps
    const supabase = createClient()
    return await supabase
        .from('cards')
        .select('*')
        .range(skip + 1, skip + ps)
}

export default async function Home() {
    const { data, error } = await getData()

    if (error) return (
        <ErrorView>
            {error.message}
        </ErrorView>
    )

    return (
        <div className="relative">
            <Navigation />
            <Hero />
            <ThemePanels />
            <div className="min-h-screen md:px-24 px-8">
                <ColorSets colorSets={data} />
                <SubPanels />
            </div>
        </div>
    )
}

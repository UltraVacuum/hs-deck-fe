import Link from 'next/link'
import Image from 'next/image'
import {
    Menu,
    Search,
    MoreVertical
} from 'lucide-react';
import { createClient } from "@/supabase/server";
import AuthButton from '@/components/local/auth-btn';

const menus = [{
    path: '/explore',
    title: '最新资讯',
}, {
    path: '/cards',
    title: '卡牌',
}, {
    path: '/decks',
    title: '卡组',
}, {
    path: '/about',
    title: '关于',
}]

const MobileNav = () => {
    return (
        <div className='flex items-center p-4 border-b
            border-slate-900/10 lg:hidden dark:border-slate-50/[0.06]'>
            <button
                type='button'
                className='text-slate-500 hover:text-slate-600 
                    dark:text-slate-400 dark:hover:text-slate-300'
            >
                <Menu />
            </button>
            <ol className='ml-4 flex text-sm leading-6 whitespace-nowrap
                min-w-0'>
                {
                    menus.map((m, i) => {
                        return (
                            <li
                                className='flex items-center mr-1'
                                key={i}
                            >
                                <Link href={`${m.path}`} >
                                    {`${m.title}`}
                                </Link>
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    )
}

const HeadMenus = () => {

    const canInitSupabaseClient = () => {
        // This function is just for the interactive tutorial.
        // Feel free to remove it once you have Supabase connected.
        try {
            createClient();
            return true;
        } catch (e) {
            return false;
        }
    };

    const isSupabaseConnected = canInitSupabaseClient();
    return (
        <nav className='text-sm leading-6 font-semibold
                text-slate-700 dark:text-slate-200'>
            <div className='flex items-center space-x-8'>
                {
                    menus.map((m, i) => {
                        return (
                            <a
                                className='hover:text-sky-500 dark:hover:text-sky-400'
                                href={`${m.path}`}
                                key={i}
                            >
                                {`${m.title}`}
                            </a>
                        )
                    })
                }
                {isSupabaseConnected && <AuthButton />}
            </div>
        </nav>
    )
}


export default function Navigation() {
    // todo: popular\palyground\
    return (
        <div className='sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75'>
            <div className='container mx-auto'>
                <div className='py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0'>
                    <div className='relative flex items-center'>
                        <Link
                            className='mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto'
                            href='/'
                        >
                            <Image
                                src="/icons/logo.png"
                                alt="HsTopDecks Logo"
                                className="dark:invert"
                                width={24}
                                height={24}
                                priority
                            />
                            <span className='sr-only'>HsTopDecks</span>
                        </Link>
                        <div className='relative'>
                            <Link
                                className='text-xs leading-5 font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5'
                                type='button'
                                href="/"
                            >
                                HsTopDecks
                            </Link>
                        </div>

                        <div className='relative hidden lg:flex 
                            items-center ml-auto'>
                            <HeadMenus />
                            <div className='flex items-center border-l
                                border-slate-200 ml-6 pl-6
                                dark:border-slate-800'>
                                <label
                                    className='sr-only'
                                    id='headlessui-listbox-label-:Rpkcr6:'
                                    data-headlessui-state=''
                                >
                                    Cards
                                </label>
                                <button
                                    type='button'
                                    id='headlessui-listbox-button-:R19kcr6:'
                                    aria-haspopup='true'
                                    aria-expanded='false'
                                    data-headlessui-state=''
                                    aria-labelledby='headlessui-listbox-label-:Rpkcr6: headlessui-listbox-button-:R19kcr6:'
                                >
                                    <span className='dark:hidden'>

                                    </span>
                                    <span className='hidden dark:inline'>

                                    </span>
                                </button>
                                <a
                                    href='/'
                                    className='ml-6 block text-slate-400 
                                        hover:text-slate-500 dark:hover:text-slate-300'
                                >
                                    <span className='sr-only'></span>
                                </a>
                            </div>
                        </div>
                        <button
                            type='button'
                            className='ml-auto text-slate-500 
                                w-8 h-8 -my-1 flex items-center 
                                justify-center hover:text-slate-600 
                                lg:hidden dark:text-slate-400 
                                dark:hover:text-slate-300'
                        >
                            <span className='sr-only'>Search</span>
                            <Search />
                        </button>
                        <div className='ml-2 -my-1 lg:hidden'>
                            <button
                                type='button'
                                className='text-slate-500 w-8 h-8 flex 
                                    items-center justify-center 
                                    hover:text-slate-600
                                    dark:text-slate-400 
                                    dark:hover:text-slate-300'
                            >
                                <span className='sr-only'>Navigation</span>
                                <MoreVertical />
                            </button>
                        </div>
                    </div>
                </div>
                <MobileNav />
            </div>
        </div>
    )
}

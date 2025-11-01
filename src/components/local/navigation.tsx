'use client';

import Link from 'next/link'
import Image from 'next/image'
import {
    Menu,
    Search,
    MoreVertical
} from 'lucide-react';
import { createClient } from "@/supabase/client";
import AuthButton from '@/components/local/auth-btn';

const menus = [{
    path: '/news',
    title: '最新资讯',
}, {
    path: '/cards',
    title: '卡牌',
}, {
    path: '/decks',
    title: '卡组',
}, {
    path: '/meta',
    title: '环境分析',
}, {
    path: '/about',
    title: '关于',
}]

const MobileNav = () => {
    return (
        <div className='flex items-center p-4 border-b border-gray-200 lg:hidden bg-white'>
            <button
                type='button'
                className='text-gray-500 hover:text-gray-600'
            >
                <Menu />
            </button>
            <ol className='ml-4 flex text-sm leading-6 whitespace-nowrap min-w-0'>
                {
                    menus.map((m, i) => {
                        return (
                            <li
                                className='flex items-center mr-1'
                                key={i}
                            >
                                <Link href={`${m.path}`} className="text-gray-600 hover:text-gray-900">
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
        <nav className='text-sm leading-6 font-semibold text-gray-700'>
            <div className='flex items-center space-x-8'>
                {
                    menus.map((m, i) => {
                        return (
                            <a
                                className='hover:text-blue-600 transition-colors'
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
        <div className='sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-200 bg-white supports-backdrop-blur:bg-white/95 shadow-sm'>
            <div className='container mx-auto'>
                <div className='py-4 border-b border-gray-200 lg:px-8 lg:border-0 mx-4 lg:mx-0'>
                    <div className='relative flex items-center'>
                        <Link
                            className='mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto'
                            href='/'
                        >
                            <Image
                                src="/icons/logo.png"
                                alt="HsTopDecks Logo"
                                width={24}
                                height={24}
                                priority
                            />
                            <span className='sr-only'>HsTopDecks</span>
                        </Link>
                        <div className='relative'>
                            <Link
                                className='text-xs leading-5 font-semibold bg-blue-50 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-blue-100 text-blue-600'
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
                                border-gray-200 ml-6 pl-6'>
                                <label
                                    className='sr-only'
                                    id='headlessui-listbox-label-:Rpkcr6:'
                                    data-headlessui-state=''
                                >
                                    Cards
                                </label>
                                {/* Theme selector removed for light theme */}
                                <a
                                    href='/'
                                    className='ml-6 block text-gray-400 hover:text-gray-600'
                                >
                                    <span className='sr-only'></span>
                                </a>
                            </div>
                        </div>
                        <button
                            type='button'
                            className='ml-auto text-gray-500 w-8 h-8 -my-1 flex items-center justify-center hover:text-gray-600 lg:hidden'
                        >
                            <span className='sr-only'>Search</span>
                            <Search />
                        </button>
                        <div className='ml-2 -my-1 lg:hidden'>
                            <button
                                type='button'
                                className='text-gray-500 w-8 h-8 flex items-center justify-center hover:text-gray-600'
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

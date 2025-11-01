'use client';

import Link from 'next/link'
import Image from 'next/image'
import {
    Menu,
    Search,
    MoreVertical
} from 'lucide-react';
import AuthButtonClient from '@/components/local/auth-btn-client';

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
    path: '/discovery',
    title: '发现实验室',
}, {
    path: '/meta',
    title: '元分析',
}];

export default function NavigationClient() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/logo.png"
                                alt="HsTopDecks"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="font-bold text-xl">HsTopDecks</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {menus.map((menu) => (
                            <Link
                                key={menu.path}
                                href={menu.path}
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {menu.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        <Search className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />

                        <AuthButtonClient />

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
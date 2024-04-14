import type { Metadata } from 'next'

export const keywords = [
    'heart stone',
    '炉石传说',
    '暴雪炉石传说',
    '炉石卡组',
    '炉石标准卡组',
    '炉石狂野卡组',
    '炉石乱斗卡组',
    '炉石竞技场卡组',
    '炉石套牌',
    '炉石资讯',
].join(',')

export const description = '在炉石传说卡组网站，探索最新的卡牌组合和战术策略！从竞技场到标准模式，我们提供多种强大的卡组，助你在游戏中脱颖而出。浏览数百种卡组，了解每张卡牌的最佳用法，并与全球玩家分享你的战术见解。立即加入我们，成为顶尖玩家'

export const SeoMeta: Metadata = {
    metadataBase: new URL('https://hstopdecks.com'),
    title: {
        template: 'HsTopDecks | %s',
        default: 'HsTopDecks | Home', // a default is required when creating a template
    },
    keywords,
    description,
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon/favicon.ico',
        shortcut: '/favicon/favicon-32x32.png',
        apple: '/favicon/apple-touch-icon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon/apple-touch-icon.png',
        },
    },
    other: {
        'baidu-site-verification': 'codeva-NIe90b7b9C'
    }
    // <meta name="baidu-site-verification" content="codeva-NIe90b7b9C" />
}

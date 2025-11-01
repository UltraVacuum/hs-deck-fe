import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                      process.env.SERVER_URL ||
                      'https://hs-deck-fe.vercel.app'

        // Validate siteUrl
        if (!siteUrl || typeof siteUrl !== 'string') {
            throw new Error('Invalid SITE_URL')
        }

        const currentDate = new Date()

        return [
            {
                url: siteUrl,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 1.0,
            },
            {
                url: `${siteUrl}/home`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${siteUrl}/news`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${siteUrl}/cards`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${siteUrl}/decks`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.6,
            },
            {
                url: `${siteUrl}/meta`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.5,
            },
            {
                url: `${siteUrl}/about`,
                lastModified: currentDate,
                changeFrequency: 'weekly',
                priority: 0.4,
            }
        ]
    } catch (error) {
        console.error('Sitemap generation error:', error)

        // Fallback sitemap with minimal URLs
        const fallbackUrl = 'https://hs-deck-fe.vercel.app'
        return [
            {
                url: fallbackUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            }
        ]
    }
}

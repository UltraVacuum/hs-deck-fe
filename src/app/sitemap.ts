import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.SERVER_URL
    return [
        {
            url: `${siteUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.1,
        },
        {
            url: `${siteUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.2,
        },
        {
            url: `${siteUrl}/cards`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/decks`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.4,
        }
    ]
}

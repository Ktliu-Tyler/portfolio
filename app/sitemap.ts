import type { MetadataRoute } from 'next'
import { publicRecords } from '@/lib/contentStore'
import { siteUrl } from '@/lib/site'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, experiences] = await Promise.all([publicRecords('article'), publicRecords('experience')])
  return [
    ...['/', '/projects', '/experience', '/blog'].map(route => ({ url: siteUrl + route })),
    ...articles.map(item => ({ url: `${siteUrl}/blog/${item.slug}`, lastModified: item.updatedAt })),
    ...experiences.map(item => ({ url: `${siteUrl}/experience/${item.slug}`, lastModified: item.updatedAt })),
  ]
}

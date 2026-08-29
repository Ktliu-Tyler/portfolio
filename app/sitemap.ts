import type { MetadataRoute } from 'next'
import { getGeneratedArticleSlugs } from '@/lib/contentArticles'
import { getExperienceSlugs } from '@/lib/experience'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ['/', '/projects', '/experience', '/blog']
  const experienceRoutes = getExperienceSlugs().map((slug) => `/experience/${slug}`)
  const articleRoutes = getGeneratedArticleSlugs().map((slug) => `/blog/${slug}`)

  return [...staticRoutes, ...experienceRoutes, ...articleRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }))
}

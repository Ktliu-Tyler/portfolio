import 'server-only'
import type { ArticleSummary, TechnicalArticle } from './articles'
import { publicRecord, publicRecords } from './contentStore'
export interface MarkdownArticle extends ArticleSummary {
  content: string
  sources: Array<{ type: string; name?: string; url?: string }>
}
export type ArticleDetail = { kind: 'technical'; article: TechnicalArticle } | { kind: 'markdown'; article: MarkdownArticle }
export async function getAllArticleSummaries(): Promise<ArticleSummary[]> {
  return (await publicRecords('article')).map(record => {
    const { article } = record.data as ArticleDetail
    const { slug, title, excerpt, date, readTime, tags, image, imagePosition, category, sourceType } = article
    return { slug, title, excerpt, date, readTime, tags, image, imagePosition, category, sourceType }
  }).sort((a,b) => b.date.localeCompare(a.date))
}
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const result = await publicRecord('article', slug)
  return result ? result.data as ArticleDetail : null
}

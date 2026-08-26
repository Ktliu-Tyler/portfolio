import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  ArticleSummary,
  TechnicalArticle,
  articleSummaries,
  getTechnicalArticle,
  technicalArticles,
} from '@/lib/articles'

export interface MarkdownArticle extends ArticleSummary {
  content: string
  sources: Array<{
    type: string
    name?: string
    url?: string
  }>
}

export type ArticleDetail =
  | { kind: 'technical'; article: TechnicalArticle }
  | { kind: 'markdown'; article: MarkdownArticle }

const blogContentDir = path.join(process.cwd(), 'content', 'blog')
const contentExtensions = new Set(['.md', '.mdx'])

function contentFilePath(slug: string) {
  const candidates = ['.mdx', '.md'].map((extension) =>
    path.join(blogContentDir, `${slug}${extension}`),
  )

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function readBlogFiles() {
  if (!fs.existsSync(blogContentDir)) {
    return []
  }

  return fs
    .readdirSync(blogContentDir)
    .filter((fileName) => contentExtensions.has(path.extname(fileName)))
    .map((fileName) => path.join(blogContentDir, fileName))
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function asSources(value: unknown): MarkdownArticle['sources'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((source) => source && typeof source === 'object')
    .map((source) => {
      const sourceRecord = source as Record<string, unknown>
      const name = asString(sourceRecord.name)
      const url = asString(sourceRecord.url)

      return {
        type: asString(sourceRecord.type, 'document'),
        name: name || undefined,
        url: url || undefined,
      }
    })
}

function calculateReadTime(content: string) {
  const wordCount = content
    .replace(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter(Boolean).length

  return String(Math.max(3, Math.ceil(wordCount / 220)))
}

function articleFromFile(filePath: string): MarkdownArticle {
  const slug = path.basename(filePath, path.extname(filePath))
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    title: asString(data.title, slug),
    excerpt: asString(data.excerpt, 'A generated portfolio record.'),
    date: asString(data.date, new Date().toISOString().slice(0, 10)),
    readTime: asString(data.readTime, calculateReadTime(content)),
    tags: asStringArray(data.tags),
    image: asString(data.coverImage, asString(data.image, '/images/data.png')),
    imagePosition: asString(data.imagePosition, 'center'),
    category: asString(data.category, 'work-log'),
    sourceType: asString(data.sourceType, 'mixed'),
    sources: asSources(data.sources),
    content: content.trim(),
  }
}

export function getContentArticles() {
  return readBlogFiles().map(articleFromFile)
}

export function getAllArticleSummaries(): ArticleSummary[] {
  return [...getContentArticles(), ...articleSummaries].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

export function getArticleBySlug(slug: string): ArticleDetail | null {
  const technicalArticle = getTechnicalArticle(slug)

  if (technicalArticle) {
    return { kind: 'technical', article: technicalArticle }
  }

  const filePath = contentFilePath(slug)

  if (!filePath) {
    return null
  }

  return { kind: 'markdown', article: articleFromFile(filePath) }
}

export function getGeneratedArticleSlugs() {
  const contentSlugs = getContentArticles().map((article) => article.slug)
  const technicalSlugs = technicalArticles.map((article) => article.slug)

  return [...technicalSlugs, ...contentSlugs]
}

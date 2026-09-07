import { notFound } from 'next/navigation'
import AdminPreview from '@/components/admin/AdminPreview'
import { requireOwner } from '@/lib/adminAuth'
import { adminRecord } from '@/lib/contentStore'
import type { ArticleDetail } from '@/lib/contentArticles'
import type { ExperienceEntry } from '@/lib/experience'
import MarkdownArticleContent from '@/components/MarkdownArticleContent'

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner()
  let id: string
  try { id = decodeURIComponent((await params).id) } catch { notFound() }
  if (!/^(article|experience|project|certificate):[a-z0-9_-]+$/.test(id)) notFound()
  const record = await adminRecord(id)
  if (!record) notFound()
  let content = ''
  let images: Array<{ src: string; alt: string }> = []
  let summary = ''
  let tags: string[] = []
  let sources: Array<{ name: string }> = []
  if (record.kind === 'article') {
    const result = record.data as ArticleDetail
    content = result.kind === 'markdown' ? result.article.content : result.article.sections.map(section => `## ${section.heading}\n\n${section.body?.join('\n\n') || ''}\n\n${section.bullets?.map(item => `- ${item}`).join('\n') || ''}`).join('\n\n')
    images = [{ src: result.article.image, alt: result.article.title }]
    summary = result.article.excerpt
    tags = result.article.tags
    sources = 'sources' in result.article ? result.article.sources.map(source => ({ name: source.name || source.url || source.type })) : []
  } else if (record.kind === 'experience') {
    const entry = record.data as ExperienceEntry
    content = [entry.summary.zh, ...entry.story.map(item => item.zh), '## 重點紀錄', ...entry.highlights.map(item => `- ${item.zh}`)].join('\n\n')
    images = [...entry.images, ...entry.evidence].map(image => ({ src: image.src, alt: image.alt.zh }))
  } else if (record.kind === 'certificate') {
    content = `${record.data.experienceTitle}\n\n${record.data.period}\n\n${record.data.caption.zh}`
    images = [{ src: record.data.src, alt: record.title }]
  } else {
    const label = record.data.labels.zh
    content = `## ${label.subtitle}\n\n${label.description}\n\n${label.tags}\n\n[GitHub 原始碼](${record.data.link})`
    if (record.data.image) images = [{ src: record.data.image, alt: record.title }]
  }
  const editorial = record.data.editorial as { draftType?: string; relatedIds?: string[]; reviewNotes?: string[] } | undefined
  // Draft editorial notes are rendered only in this authenticated page.
  const related = await Promise.all((editorial?.relatedIds || []).map(id => adminRecord(id)))
  return <AdminPreview
    title={record.title}
    visibility={record.visibility}
    summary={summary}
    tags={tags}
    images={images.filter(image => !content.includes(`](${image.src})`))}
    sources={sources}
    editorial={editorial && { draftType: editorial.draftType, reviewNotes: editorial.reviewNotes }}
    related={related.flatMap(item => item ? [{ id: item.id, title: item.title }] : [])}
  ><MarkdownArticleContent content={content} /></AdminPreview>
}

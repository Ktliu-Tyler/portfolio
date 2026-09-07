import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin, privateHeaders } from '@/lib/adminAuth'
import { readyDatabase } from '@/lib/database'
import { stripDraftFrontmatter } from '@/lib/draftSafety'
import { readLimitedJson, requestError } from '@/lib/requestSafety'
export async function POST(request: Request) {
  const denied = await authorizeAdmin(request, true)
  if (denied) return denied
  try {
    const draft = await readLimitedJson(request, 500_000)
    if (typeof draft.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug) || draft.slug.length > 120 || typeof draft.title !== 'string' || !draft.title.trim() || draft.title.length > 300 || typeof draft.mdx !== 'string' || !draft.mdx.trim()) return NextResponse.json({ error: '草稿需有標題、有效網址名稱與文章內容。' }, { status: 400, headers: privateHeaders })
    const id = `article:${draft.slug}`
    const content = stripDraftFrontmatter(draft.mdx)
    if (!content) return NextResponse.json({ error: '草稿需要文章內容。' }, { status: 400, headers: privateHeaders })
    const image = typeof draft.coverImage === 'string' && /^\/images\/[a-z0-9-]+\.png$/.test(draft.coverImage) ? draft.coverImage : '/images/data.png'
    const article = { slug: draft.slug, title: draft.title.trim(), excerpt: typeof draft.excerpt === 'string' ? draft.excerpt.slice(0, 1000) : '', date: typeof draft.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(draft.date) ? draft.date : new Date().toISOString().slice(0, 10), readTime: String(Math.max(1, Math.ceil(content.length / 1000))), tags: Array.isArray(draft.tags) ? draft.tags.filter((item: unknown) => typeof item === 'string' && item.length <= 100).slice(0, 20) : [], category: typeof draft.category === 'string' ? draft.category.slice(0, 80) : 'work-log', image, content, sources: [] }
    const db = await readyDatabase()
    const tx = await db.transaction('write')
    try {
      if ((await tx.execute({ sql: 'SELECT 1 FROM content WHERE id=?', args: [id] })).rows.length) return NextResponse.json({ error: '這個文章網址已存在。請更改草稿網址名稱，避免覆蓋原有文章。' }, { status: 409, headers: privateHeaders })
      const now = new Date().toISOString()
      await tx.execute({ sql: "INSERT INTO content(id,kind,slug,title,data,visibility,updated_at) VALUES(?,'article',?,?,?,'private',?)", args: [id, article.slug, article.title, JSON.stringify({ kind: 'markdown', article }), now] })
      await tx.execute({ sql: 'INSERT INTO audit_log(content_id,title,action,created_at) VALUES(?,?,?,?)', args: [id, article.title, '儲存私密草稿', now] })
      await tx.commit()
    } finally { tx.close() }
    revalidatePath('/admin')
    return NextResponse.json({ id }, { status: 201, headers: privateHeaders })
  } catch (error) { const result = requestError(error, '草稿儲存失敗，請檢查內容後再試。'); return NextResponse.json({ error: result.error }, { status: result.status, headers: privateHeaders }) }
}

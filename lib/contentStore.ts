import 'server-only'
import type { Row } from '@libsql/client'
import { readyDatabase } from './database'
import type { ContentKind, ManagedContent, Visibility } from './contentTypes'
import type { ExperienceEntry } from './experience'
import { requireOwner } from './adminAuth'

function record(row: Row): ManagedContent {
  return { id: String(row.id), kind: row.kind as ContentKind, slug: String(row.slug), title: String(row.title), visibility: row.visibility as Visibility, updatedAt: String(row.updated_at), version: Number(row.version), data: JSON.parse(String(row.data)) }
}
export async function publicRecords(kind: ContentKind) {
  const rows = await (await readyDatabase()).execute({ sql: "SELECT * FROM content WHERE kind=? AND visibility='public' ORDER BY updated_at DESC, id", args: [kind] })
  return rows.rows.map(record)
}
export async function publicRecord(kind: ContentKind, slug: string) {
  const rows = await (await readyDatabase()).execute({ sql: "SELECT * FROM content WHERE kind=? AND slug=? AND visibility='public'", args: [kind, slug] })
  return rows.rows[0] ? record(rows.rows[0]) : null
}
export async function allRecords() {
  await requireOwner()
  return (await (await readyDatabase()).execute('SELECT * FROM content ORDER BY kind, updated_at DESC, id')).rows.map(record)
}
export async function adminRecord(id: string) {
  await requireOwner()
  const rows = await (await readyDatabase()).execute({ sql: 'SELECT * FROM content WHERE id=?', args: [id] })
  return rows.rows[0] ? record(rows.rows[0]) : null
}
export async function setVisibility(id: string, visibility: Visibility, version: number) {
  await requireOwner()
  const db = await readyDatabase()
  const tx = await db.transaction('write')
  try {
    const rows = await tx.execute({ sql: 'SELECT * FROM content WHERE id=?', args: [id] })
    if (!rows.rows[0]) return { status: 404, error: '找不到這筆內容。' }
    const current = record(rows.rows[0])
    if (current.kind === 'certificate') return { status: 403, error: '獎狀與證明永久保留於私人資料庫。' }
    if (current.version !== version) return { status: 409, error: '內容已在其他分頁更新，請重新整理後再試。' }
    if (current.visibility === visibility) return { status: 200 }
    const now = new Date().toISOString()
    await tx.execute({ sql: 'UPDATE content SET visibility=?,updated_at=?,version=version+1 WHERE id=?', args: [visibility, now, id] })
    await tx.execute({ sql: 'INSERT INTO audit_log(content_id,title,action,created_at) VALUES(?,?,?,?)', args: [id, current.title, visibility === 'public' ? '設為公開' : '設為私密', now] })
    await tx.commit()
    return { status: 200 }
  } finally { tx.close() }
}
export async function publicExperiences() {
  const [entries, articles] = await Promise.all([publicRecords('experience'), publicRecords('article')])
  const slugs = new Set(articles.map(item => item.slug))
  return entries.map(item => {
    const entry = item.data as ExperienceEntry
    return { ...entry, articleSlug: entry.articleSlug && slugs.has(entry.articleSlug) ? entry.articleSlug : undefined }
  })
}
export async function auditLog() {
  await requireOwner()
  return (await (await readyDatabase()).execute('SELECT id,title,action,created_at FROM audit_log ORDER BY id DESC LIMIT 30')).rows.map(row => ({ id: Number(row.id), title: String(row.title), action: String(row.action), createdAt: String(row.created_at) }))
}

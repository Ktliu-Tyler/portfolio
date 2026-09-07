'use client'

/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAdminTranslation } from './AdminLanguage'

type Props = {
  title: string
  visibility: 'private' | 'public'
  summary: string
  tags: string[]
  images: Array<{ src: string; alt: string }>
  sources: Array<{ name: string }>
  editorial?: { draftType?: string; reviewNotes?: string[] }
  related: Array<{ id: string; title: string }>
  children: ReactNode
}

export default function AdminPreview({ title, visibility, summary, tags, images, sources, editorial, related, children }: Props) {
  const { a, label } = useAdminTranslation()
  return <article className="mx-auto max-w-3xl">
    <Link className="admin-secondary" href="/admin">{a('← 返回內容管理')}</Link>
    <div className="admin-success my-6">{a('管理員預覽')} · {a(visibility === 'private' ? '此內容目前為私密' : '此內容目前為公開')} · {a('此預覽網址僅限本人存取')}</div>
    {editorial?.draftType && <p className="mb-3 text-sm text-[var(--accent-primary)]">{label(editorial.draftType)} · {a('本地資料整理')}</p>}
    <h1 className="text-3xl font-medium leading-snug sm:text-4xl">{title}</h1>
    {summary && <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">{summary}</p>}
    {tags.length > 0 && <ul className="mt-5 flex flex-wrap gap-2" aria-label={a('文章標籤')}>{tags.map(tag => <li key={tag} className="admin-badge">{tag}</li>)}</ul>}
    <div className="my-8 space-y-5">{images.map(image => <figure key={image.src}><img className="max-h-[900px] w-full rounded-lg object-contain" src={image.src} alt={image.alt} /><figcaption className="mt-2 text-sm text-[var(--text-secondary)]">{image.alt}</figcaption></figure>)}</div>
    <div className="space-y-7">{children}</div>
    {sources.length > 0 && <section className="admin-panel mt-10 p-5"><h2 className="text-lg font-medium">{a('內容來源')}</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-secondary)]">{sources.map((source, index) => <li key={index}>{source.name}</li>)}</ul></section>}
    {related.length > 0 && <section className="mt-8"><h2 className="text-lg font-medium">{a('相關作品與原有紀錄')}</h2><div className="mt-3 flex flex-col items-start gap-3">{related.map(item => <Link className="admin-secondary" key={item.id} href={`/admin/preview/${encodeURIComponent(item.id)}`}>{item.title}</Link>)}</div></section>}
    {editorial?.reviewNotes?.length ? <section className="admin-panel mt-8 p-5"><h2 className="text-lg font-medium">{a('發布前待確認')}</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">{a('這些整理備註僅在管理預覽顯示。')}</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">{editorial.reviewNotes.map(note => <li key={note}>{note}</li>)}</ul></section> : null}
  </article>
}

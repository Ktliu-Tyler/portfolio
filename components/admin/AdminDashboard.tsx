'use client'
import { useAdminTranslation } from './AdminLanguage'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Lock, Globe, FileText, Award, Eye, Download, Loader2, Clock } from 'lucide-react'
import type { ContentKind, ContentSummary, Visibility } from '@/lib/contentTypes'

const kinds: Record<ContentKind, '文章' | '作品' | '經歷' | '獎狀與證明'> = { article: '文章', project: '作品', experience: '經歷', certificate: '獎狀與證明' }
type History = { id: number; title: string; action: string; createdAt: string }
export default function AdminDashboard({ records, history }: { records: ContentSummary[]; history: History[] }) {
  const { a, label, errorText, locale } = useAdminTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<ContentKind | 'all'>('all')
  const [visibility, setVisibility] = useState<Visibility | 'all'>('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [message, setMessage] = useState<{ title: string; visibility: Visibility } | null>(null)
  const [error, setError] = useState('')
  const visible = records.filter(record => (kind === 'all' || record.kind === kind) && (visibility === 'all' || record.visibility === visibility) && `${record.title} ${record.slug} ${record.subtitle}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const stats = [
    { label: a('全部內容'), count: records.length, icon: FileText },
    { label: a('公開中'), count: records.filter(record => record.visibility === 'public').length, icon: Globe },
    { label: a('私密保留'), count: records.filter(record => record.visibility === 'private').length, icon: Lock },
    { label: a('獎狀與證明'), count: records.filter(record => record.kind === 'certificate').length, icon: Award },
  ]
  async function update(record: ContentSummary, next: Visibility) {
    setBusy(record.id); setMessage(null); setError(''); setConfirmation(null)
    try {
      const response = await fetch(`/api/admin/content/${encodeURIComponent(record.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visibility: next, version: record.version }) })
      if (response.status === 401) { window.location.assign('/admin/login'); return }
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '無法儲存。')
      setMessage({ title: record.title, visibility: next })
      startTransition(() => router.refresh())
    } catch (error) { setError(error instanceof Error ? error.message : '連線失敗，請再試一次。') }
    finally { setBusy(null) }
  }
  return <>
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div><p className="text-sm tracking-widest text-[var(--accent-primary)]">{a('私人工作空間')}</p><h1 className="mt-2 text-3xl font-medium sm:text-4xl">{a('我的內容管理')}</h1><p className="mt-3 text-[var(--text-secondary)]">{a('決定哪些作品讓人看見，哪些紀錄留給自己。')}</p></div>
      <a className="admin-secondary" href="/api/admin/backup" download><Download size={17} />{a('下載私人備份')}</a>
    </header>
    <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(({ label, count, icon: Icon }) => <div className="admin-panel p-5" key={label}><div className="flex items-center justify-between gap-2 text-sm text-[var(--text-secondary)]">{label}<Icon size={17} /></div><p className="mt-3 text-3xl font-medium tabular-nums">{count}</p></div>)}</div>
    <div className="admin-panel overflow-hidden">
      <div className="border-b border-[var(--glass-border)] p-5">
        <div className="flex flex-wrap gap-2" aria-label={a('內容類別')}>{(['all', 'article', 'project', 'experience', 'certificate'] as const).map(value => <button key={value} className={kind === value ? 'admin-tab active' : 'admin-tab'} aria-pressed={kind === value} onClick={() => { setKind(value); setConfirmation(null) }}>{value === 'all' ? a('全部內容') : a(kinds[value])}</button>)}</div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3.5 text-[var(--text-secondary)]" size={18} /><span className="sr-only">{a('搜尋內容')}</span><input className="admin-input pl-10" placeholder={a('搜尋標題、年份或文章網址…')} value={query} onChange={event => setQuery(event.target.value)} /></label><label><span className="sr-only">{a('公開狀態')}</span><select className="admin-input sm:w-40" value={visibility} onChange={event => setVisibility(event.target.value as Visibility | 'all')}><option value="all">{a('所有狀態')}</option><option value="public">{a('公開')}</option><option value="private">{a('私密')}</option></select></label></div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{a('顯示 {count} 筆', { count: visible.length })}{kind === 'certificate' && a(' · 獎狀與證明僅供本人查看')}</p>
      </div>
      <div aria-live="polite">{message && <p className="admin-success mx-5 mt-4" role="status">{a(message.visibility === 'public' ? '「{title}」已設為公開。' : '「{title}」已設為私密。', { title: message.title })}</p>}{error && <p className="admin-error mx-5 mt-4" role="alert">{errorText(error)}</p>}</div>
      <ul className="divide-y divide-[var(--glass-border)]">{visible.map(record => <li key={record.id} className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]"><span>{a(kinds[record.kind])}</span>{record.subtitle && <span>{label(record.subtitle)}</span>}<span className={record.visibility === 'public' ? 'admin-badge public' : 'admin-badge'}>{record.visibility === 'public' ? <Globe size={13} /> : <Lock size={13} />}{record.visibility === 'public' ? a('公開') : a('私密')}</span></div><h2 className="break-words text-base font-medium sm:text-lg">{record.title}</h2><p className="mt-1 break-all text-sm text-[var(--text-secondary)]">{record.slug}</p></div>
          <div className="flex shrink-0 items-center gap-2"><Link className="admin-secondary" href={`/admin/preview/${encodeURIComponent(record.id)}`}><Eye size={16} />{a('預覽')}</Link>{record.kind === 'certificate' ? <span className="flex items-center gap-2 px-2 text-sm text-[var(--text-secondary)]"><Lock size={15} />{a('僅限本人')}</span> : <button className="admin-secondary" disabled={Boolean(busy) || pending} onClick={() => record.visibility === 'public' ? update(record, 'private') : setConfirmation(record.id)}>{busy === record.id ? <Loader2 size={16} className="animate-spin" /> : record.visibility === 'public' ? <Lock size={16} /> : <Globe size={16} />}{record.visibility === 'public' ? a('設為私密') : a('設為公開')}</button>}</div>
        </div>
        {confirmation === record.id && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--marker-accent-line)] bg-[var(--marker-accent-soft)] p-4"><p className="text-sm leading-6">{a('公開後，訪客就能在網站上閱讀這筆內容。相關文章與作品的狀態需分別設定。')}</p><div className="flex gap-2"><button className="admin-primary" onClick={() => update(record, 'public')}>{a('確認公開')}</button><button className="admin-secondary" onClick={() => setConfirmation(null)}>{a('取消')}</button></div></div>}
      </li>)}</ul>
      {visible.length === 0 && <div className="p-12 text-center"><Search className="mx-auto mb-4 text-[var(--text-secondary)]" size={28} /><p>{a('沒有符合條件的內容。')}</p><button className="admin-secondary mx-auto mt-5" onClick={() => { setQuery(''); setKind('all'); setVisibility('all') }}>{a('清除篩選')}</button></div>}
    </div>
    <section className="mt-8"><h2 className="flex items-center gap-2 text-lg font-medium"><Clock size={18} />{a('最近操作')}</h2>{history.length ? <ul className="mt-4 space-y-3">{history.map(item => <li key={item.id} className="flex flex-wrap justify-between gap-2 text-sm"><span>{label(item.action)} · {item.title}</span><time className="text-[var(--text-secondary)]" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString(locale === 'zh' ? 'zh-TW' : 'en-US', { timeZone: 'Asia/Taipei', hour12: false })}</time></li>)}</ul> : <p className="mt-3 text-sm text-[var(--text-secondary)]">{a('變更公開狀態後，這裡會保留時間與操作紀錄。')}</p>}</section>
  </>
}

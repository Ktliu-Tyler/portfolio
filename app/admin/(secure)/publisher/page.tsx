'use client'

/* eslint-disable @next/next/no-img-element */
import type { FormEvent } from 'react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  FolderKanban,
  Github,
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Tags,
  UploadCloud,
  X,
} from 'lucide-react'
import type { PublisherDraft, PublisherSource } from '@/lib/publisher'
import { useAdminTranslation } from '@/components/admin/AdminLanguage'
import { publisherCategories } from '@/lib/publisher'

type PreviewTab = 'preview' | 'mdx' | 'assets'

const panelClass =
  'rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl'
const inputClass =
  'w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15'
const labelClass = 'text-xs font-medium uppercase tracking-wide text-slate-400'

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function sourceLabel(source: PublisherSource) {
  if (source.url) {
    return source.url
  }

  if (source.size) {
    return `${source.name} · ${formatBytes(source.size)}`
  }

  return source.name
}

export default function PublisherPage() {
  const { a, label, errorText } = useAdminTranslation()
  const [title, setTitle] = useState('')
  const [repoUrls, setRepoUrls] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('auto')
  const [language, setLanguage] = useState('zh-TW')
  const [tone, setTone] = useState('portfolio')
  const [files, setFiles] = useState<File[]>([])
  const [draft, setDraft] = useState<PublisherDraft | null>(null)
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'copied'>('idle')
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [prUrl, setPrUrl] = useState('')
  const [savedId, setSavedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [useAI, setUseAI] = useState(false)

  const imagePreviews = useMemo(
    () =>
      files
        .filter((file) => file.type.startsWith('image/'))
        .slice(0, 6)
        .map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [imagePreviews])

  const selectedBytes = files.reduce((total, file) => total + file.size, 0)
  const hasSources = notes.trim().length > 0 || repoUrls.trim().length > 0 || files.length > 0

  async function generateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setStatus('loading')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('repoUrls', repoUrls)
    formData.append('notes', notes)
    formData.append('category', category)
    formData.append('language', language)
    formData.append('tone', tone)
    formData.append('useAI', String(useAI))
    files.forEach((file) => formData.append('files', file, file.name))

    try {
      const response = await fetch('/api/publisher/draft', {
        method: 'POST',
        body: formData,
      })
      const payload = (await response.json()) as {
        draft?: PublisherDraft
        error?: string
      }

      if (!response.ok || !payload.draft) {
        throw new Error(payload.error ?? 'Draft generation failed.')
      }

      setDraft(payload.draft)
      setSavedId('')
      setActiveTab('preview')
      setPublishStatus('idle')
      setPrUrl('')
      setStatus('idle')
    } catch (requestError) {
      setStatus('idle')
      setError(requestError instanceof Error ? requestError.message : 'Unknown error')
    }
  }

  async function copyMdx() {
    if (!draft) {
      return
    }

    try {
      await navigator.clipboard.writeText(draft.mdx)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 1800)
    } catch { setError('複製失敗，請下載 MDX 檔案。') }
  }

  function downloadMdx() {
    if (!draft) {
      return
    }

    const blob = new Blob([draft.mdx], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${draft.slug}.mdx`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function createPullRequest() {
    if (!draft) {
      return
    }
    if (!window.confirm(a('這會將草稿與附件匯出到 GitHub。GitHub 的檢視權限不受本站私密設定控制。確定匯出？'))) return

    setError('')
    setPublishStatus('loading')

    const formData = new FormData()
    formData.append('draft', JSON.stringify(draft))
    files.forEach((file) => formData.append('files', file, file.name))

    try {
      const response = await fetch('/api/publisher/github-pr', {
        method: 'POST',
        body: formData,
      })
      const payload = (await response.json()) as { prUrl?: string; error?: string }

      if (!response.ok || !payload.prUrl) {
        throw new Error(payload.error ?? 'Pull request creation failed.')
      }

      setPrUrl(payload.prUrl)
      setPublishStatus('done')
    } catch (requestError) {
      setPublishStatus('idle')
      setError(requestError instanceof Error ? requestError.message : 'Unknown error')
    }
  }

  function resetDraft() {
    setSavedId('')
    setDraft(null)
    setError('')
    setStatus('idle')
    setPublishStatus('idle')
    setPrUrl('')
  }

  async function savePrivateDraft() {
    if (!draft) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/admin/drafts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || '草稿儲存失敗。')
      setSavedId(result.id)
    } catch (error) { setError(error instanceof Error ? error.message : '草稿儲存失敗。') }
    finally { setSaving(false) }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08111f]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <header className="mb-8 flex min-w-0 flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-none">
            <h1 className="break-words font-heading text-3xl font-bold text-white sm:text-4xl">
              {a('文章工作室')}
            </h1>
            <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-400">
              {a('PDF、圖片、GitHub 專案與工作紀錄會被整理成可放進作品集的文章草稿。')}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-medium text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            {a('先草稿，後公開')}
          </div>
        </header>

        <form
          onSubmit={generateDraft}
          className="grid w-full min-w-0 max-w-full gap-6 xl:grid-cols-[420px_1fr]"
        >
          <section
            className={`${panelClass} min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden p-5 sm:max-w-none sm:p-6`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-white">{a('素材來源')}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {a('{count} 個檔案 · {size}', { count: files.length, size: formatBytes(selectedBytes) })}
                </p>
              </div>
              <UploadCloud className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="space-y-5">
              <label className="block space-y-2">
                <span className={labelClass}>{a('標題（選填）')}</span>
                <input
                  className={inputClass}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={a('例如：CAN Decoder 開發紀錄')}
                />
              </label>

              <label className="block space-y-2">
                <span className={labelClass}>{a('GitHub 儲存庫')}</span>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={repoUrls}
                  onChange={(event) => setRepoUrls(event.target.value)}
                  placeholder="https://github.com/Ktliu-Tyler/CANdecoder"
                />
              </label>

              <label className="block space-y-2">
                <span className={labelClass}>{a('工作筆記')}</span>
                <textarea
                  className={`${inputClass} min-h-40 resize-y`}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={a('貼上你的開發紀錄、週報、實驗心得或生活筆記')}
                />
              </label>

              <div className="block space-y-2">
                <label htmlFor="publisher-files" className={labelClass}>{a('檔案')}</label>
                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/45 p-4">
                  <input
                    id="publisher-files"
                    type="file"
                    multiple
                    accept=".pdf,.md,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    className="peer sr-only"
                    onChange={(event) => {
                      const nextFiles = Array.from(event.currentTarget.files ?? [])
                      setFiles((current) => [...current, ...nextFiles])
                      event.currentTarget.value = ''
                    }}
                  />

                  <label htmlFor="publisher-files" className="inline-flex cursor-pointer rounded-lg bg-cyan-300/15 px-3 py-2 text-sm font-medium text-cyan-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cyan-300">{a('選擇檔案')}</label>
                  {files.length === 0 && <p className="mt-2 text-xs text-slate-400">{a('尚未選擇檔案')}</p>}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="h-4 w-4 shrink-0 text-cyan-300" />
                            ) : (
                              <FileText className="h-4 w-4 shrink-0 text-indigo-300" />
                            )}
                            <span className="truncate text-sm text-slate-200">
                              {file.name}
                            </span>
                            <span className="shrink-0 text-xs text-slate-500">
                              {formatBytes(file.size)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFiles((current) =>
                                current.filter((_, fileIndex) => fileIndex !== index),
                              )
                            }
                            className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                            aria-label={a('移除 {name}', { name: file.name })}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview) => (
                    <div
                      key={preview.url}
                      className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                    >
                      <img
                        src={preview.url}
                        alt={preview.file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="space-y-2">
                  <span className={labelClass}>{a('分類')}</span>
                  <select
                    className={inputClass}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="auto">{a('自動判斷')}</option>
                    {publisherCategories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {label(item.value)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>{a('文章語言')}</span>
                  <select
                    className={inputClass}
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    <option value="zh-TW">{a('繁體中文')}</option>
                    <option value="en">{a('英文')}</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>{a('文案風格')}</span>
                  <select
                    className={inputClass}
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                  >
                    <option value="portfolio">{a('作品集')}</option>
                    <option value="technical">{a('技術說明')}</option>
                    <option value="journal">{a('日誌')}</option>
                  </select>
                </label>
              </div>

              <p className="text-sm text-slate-400">{a('已使用管理帳號登入。草稿預設為私密。最多 8 個檔案、每個 3 MB，整份表單最多 4 MB。')}</p>
              <label className="flex items-start gap-3 text-sm leading-6 text-slate-300"><input type="checkbox" checked={useAI} onChange={event => setUseAI(event.target.checked)} className="mt-1" /><span>{a('使用 AI 整理：將筆記、GitHub 內容與附件傳送至 OpenAI。不勾選時，草稿由本機規則整理；GitHub 網址仍會向 GitHub 讀取資料。')}</span></label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === 'loading' || !hasSources}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {status === 'loading' ? a('整理中…') : a('產生草稿')}
                </button>
                <button
                  type="button"
                  onClick={resetDraft}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {a('重設草稿')}
                </button>
              </div>

              {error && (
                <div className="flex gap-2 rounded-xl border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span role="alert">{errorText(error)}</span>
                </div>
              )}
            </div>
          </section>

          <section
            className={`${panelClass} min-h-[720px] min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-none`}
          >
            {!draft ? (
              <div className="flex min-h-[720px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <FolderKanban className="h-8 w-8" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-white">
                  {a('尚無草稿')}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                  {a('新草稿會在這裡預覽。儲存到私人資料庫後，可到內容管理決定是否公開。')}
                </p>
              </div>
            ) : (
              <div className="flex min-h-[720px] flex-col">
                <div className="border-b border-white/10 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                          <FolderKanban className="h-3.5 w-3.5" />
                          {label(draft.category)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {label(draft.generatedBy)}
                        </span>
                      </div>
                      <h2 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                        {draft.title}
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                        {draft.excerpt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={savePrivateDraft} disabled={saving || Boolean(savedId)} className="admin-primary">{saving ? a('儲存中…') : savedId ? a('已儲存為私密') : a('儲存私密草稿')}</button>
                      {savedId && <Link className="admin-secondary" href={`/admin/preview/${encodeURIComponent(savedId)}`}>{a('查看已儲存文章')}</Link>}
                      <button
                        type="button"
                        onClick={copyMdx}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                        {status === 'copied' ? a('已複製') : a('複製 MDX')}
                      </button>
                      <button
                        type="button"
                        onClick={downloadMdx}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                      >
                        <Download className="h-4 w-4" />
                        {a('下載')}
                      </button>
                      <button
                        type="button"
                        onClick={createPullRequest}
                        disabled={publishStatus === 'loading'}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {publishStatus === 'loading' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Github className="h-4 w-4" />
                        )}
                        {publishStatus === 'loading' ? a('匯出中…') : a('匯出到 GitHub PR')}
                      </button>
                    </div>
                  </div>

                  {prUrl && (
                    <a
                      href={prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-300/15"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {a('已建立 Pull request')}
                    </a>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {draft.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-2.5 py-1 text-xs font-medium text-indigo-200"
                      >
                        <Tags className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 border-b border-white/10 px-5 py-3 sm:px-6">
                  {(['preview', 'mdx', 'assets'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      aria-pressed={activeTab === tab}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        activeTab === tab
                          ? 'bg-white text-slate-950'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {label(tab)}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-auto p-5 sm:p-6">
                  {activeTab === 'preview' && (
                    <article className="space-y-8">
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                        <div className="aspect-[21/9] bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_28%),linear-gradient(135deg,#111827,#0f172a_45%,#164e63)]" />
                        <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-500">
                          {draft.coverImage}
                        </div>
                      </div>

                      {draft.sections.map((section) => (
                        <section key={section.heading} className="space-y-3">
                          <h3 className="font-heading text-xl font-semibold text-white">
                            {section.heading}
                          </h3>
                          {section.body.map((paragraph) => (
                            <p key={paragraph} className="text-sm leading-7 text-slate-300">
                              {paragraph}
                            </p>
                          ))}
                          {section.bullets && (
                            <ul className="space-y-2 pt-1">
                              {section.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="flex gap-3 text-sm leading-7 text-slate-300"
                                >
                                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </section>
                      ))}
                    </article>
                  )}

                  {activeTab === 'mdx' && (
                    <textarea
                      readOnly
                      aria-label={a('MDX 原始碼')}
                      value={draft.mdx}
                      className="min-h-[560px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs leading-6 text-slate-200 outline-none"
                    />
                  )}

                  {activeTab === 'assets' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {a('素材來源')}
                        </h3>
                        <div className="mt-3 grid gap-2">
                          {draft.sources.map((source) => (
                            <div
                              key={`${label(source.type)}-${sourceLabel(source)}`}
                              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
                            >
                              <span className="mr-2 text-xs font-medium uppercase tracking-wide text-cyan-300">
                                {label(source.type)}
                              </span>
                              {sourceLabel(source)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {a('圖片配置')}
                        </h3>
                        <div className="mt-3 grid gap-2">
                          {draft.assetPlan.length > 0 ? (
                            draft.assetPlan.map((asset) => (
                              <div
                                key={asset.targetPath}
                                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
                              >
                                <span className="mr-2 text-xs font-medium uppercase tracking-wide text-indigo-300">
                                  {label(asset.role)}
                                </span>
                                {asset.publicPath}
                              </div>
                            ))
                          ) : (
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-500">
                              {a('這份草稿尚未上傳圖片。')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {a('圖片提示詞')}
                        </h3>
                        <div className="mt-3 grid gap-2">
                          {draft.imagePrompts.map((prompt) => (
                            <div
                              key={prompt}
                              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm leading-6 text-slate-300"
                            >
                              {prompt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {a('內容核對備註')}
                        </h3>
                        <div className="mt-3 grid gap-2">
                          {draft.confidenceNotes.map((note) => (
                            <div
                              key={label(note)}
                              className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm leading-6 text-amber-100"
                            >
                              {label(note)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </form>
      </div>
    </main>
  )
}

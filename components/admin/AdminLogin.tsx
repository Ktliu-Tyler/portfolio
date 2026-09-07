'use client'
import { useState, type FormEvent } from 'react'
import AdminLanguage, { useAdminTranslation } from './AdminLanguage'
import { Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const { a, errorText } = useAdminTranslation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      window.location.assign('/admin')
    } catch (error) { setError(error instanceof Error ? error.message : '登入失敗，請再試一次。'); setBusy(false) }
  }
  return <section className="admin-surface mx-auto max-w-md px-5 pb-16 pt-36">
    <div className="mb-5 flex justify-end"><AdminLanguage /></div>
    <div className="admin-panel p-7 sm:p-9">
      <span className="admin-emblem"><Lock size={23} /></span>
      <p className="mt-7 text-sm tracking-widest text-[var(--accent-primary)]">TYLER LIU / PRIVATE</p>
      <h1 className="mt-3 text-3xl font-medium">{a('私人管理介面')}</h1>
      <p className="mt-3 leading-7 text-[var(--text-secondary)]">{a('登入後管理作品、文章與獎狀。')}</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block text-sm">{a('管理密碼')}<input className="admin-input mt-2" type="password" autoComplete="current-password" autoFocus required maxLength={256} value={password} onChange={event => setPassword(event.target.value)} /></label>
        {error && <p role="alert" className="admin-error">{errorText(error)}</p>}
        <button className="admin-primary w-full justify-center" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />} {busy ? a('登入中…') : a('登入管理介面')}</button>
      </form>
      <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">{a('僅限網站擁有者使用，沒有公開註冊入口。')}</p>
    </div>
  </section>
}

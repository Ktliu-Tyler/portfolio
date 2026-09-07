'use client'
import { useAdminTranslation } from './AdminLanguage'
import { useState, type FormEvent } from 'react'
export default function AdminPassword() {
  const { a, errorText } = useAdminTranslation()
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNew] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    if (newPassword !== confirmation) { setError('兩次新密碼不一致。'); return }
    setBusy(true)
    try {
      const response = await fetch('/api/admin/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      window.location.replace('/admin/login')
    } catch (error) { setError(error instanceof Error ? error.message : '更新失敗。'); setBusy(false) }
  }
  return <section className="max-w-lg"><h1 className="text-3xl font-medium">{a('帳號設定')}</h1><p className="my-4 leading-7 text-[var(--text-secondary)]">{a('更新密碼後，所有裝置都會登出。請使用新密碼重新登入。')}</p><form onSubmit={submit} className="admin-panel mt-6 space-y-5 p-6"><label className="block text-sm">{a('目前密碼')}<input className="admin-input mt-2" type="password" autoComplete="current-password" required maxLength={256} value={currentPassword} onChange={event => setCurrent(event.target.value)} /></label><label className="block text-sm">{a('新密碼（至少 16 個字元）')}<input className="admin-input mt-2" type="password" autoComplete="new-password" required minLength={16} maxLength={256} value={newPassword} onChange={event => setNew(event.target.value)} /></label><label className="block text-sm">{a('再次輸入新密碼')}<input className="admin-input mt-2" type="password" autoComplete="new-password" required minLength={16} maxLength={256} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>{error && <p className="admin-error" role="alert">{errorText(error)}</p>}<button className="admin-primary" disabled={busy}>{busy ? a('更新中…') : a('更新密碼並登出所有裝置')}</button></form></section>
}

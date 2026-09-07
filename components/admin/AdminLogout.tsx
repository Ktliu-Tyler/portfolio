'use client'
import { useAdminTranslation } from './AdminLanguage'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
export default function AdminLogout() {
  const { a, errorText } = useAdminTranslation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function logout() {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' })
      if (!response.ok) throw new Error()
      window.location.replace('/admin/login')
    } catch { setError('登出失敗，請再試。'); setBusy(false) }
  }
  return <div><button className="admin-secondary" onClick={logout} disabled={busy}><LogOut size={16} />{busy ? a('登出中…') : a('登出')}</button>{error && <p role="alert" className="admin-error">{errorText(error)}</p>}</div>
}

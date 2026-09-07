'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminLogout from './AdminLogout'
import AdminLanguage, { useAdminTranslation } from './AdminLanguage'

export default function AdminNavigation() {
  const { a } = useAdminTranslation()
  const pathname = usePathname()
  const items = [['/admin', '內容管理'], ['/admin/publisher', '文章草稿'], ['/admin/settings', '帳號設定']] as const
  return <nav aria-label={a('管理導覽')} className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-5">
    <div className="flex flex-wrap items-center gap-5 text-sm">{items.map(([href, text]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={pathname === href ? 'font-medium text-[var(--accent-primary)]' : ''}>{a(text)}</Link>)}</div>
    <div className="flex flex-wrap items-center gap-3"><AdminLanguage /><AdminLogout /></div>
  </nav>
}

import { requireOwner } from '@/lib/adminAuth'
import AdminNavigation from '@/components/admin/AdminNavigation'
export const dynamic = 'force-dynamic'
export default async function SecureLayout({ children }: { children: React.ReactNode }) {
  await requireOwner()
  return <div className="admin-surface mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
    <AdminNavigation />
    {children}
  </div>
}

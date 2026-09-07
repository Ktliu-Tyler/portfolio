import { requireOwner } from '@/lib/adminAuth'
import { allRecords, auditLog } from '@/lib/contentStore'
import AdminDashboard from '@/components/admin/AdminDashboard'
export default async function AdminPage() {
  await requireOwner()
  const [records, history] = await Promise.all([allRecords(), auditLog()])
  const summaries = records.map(({ data, ...record }) => ({ ...record, subtitle: String(data.article?.category || data.period || data.yearKey?.replace('y','') || data.experienceTitle || '') }))
  return <AdminDashboard records={summaries} history={history} />
}

import { requireOwner } from '@/lib/adminAuth'
import AdminPassword from '@/components/admin/AdminPassword'
export default async function SettingsPage() { await requireOwner(); return <AdminPassword /> }

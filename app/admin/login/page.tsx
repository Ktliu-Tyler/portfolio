import { redirect } from 'next/navigation'
import { isOwner } from '@/lib/adminAuth'
import AdminLogin from '@/components/admin/AdminLogin'
export const dynamic = 'force-dynamic'
export default async function LoginPage() {
  if (await isOwner()) redirect('/admin')
  return <AdminLogin />
}

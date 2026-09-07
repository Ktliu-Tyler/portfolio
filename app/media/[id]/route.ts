import { readyDatabase } from '@/lib/database'
import { isOwner, privateHeaders } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[a-f0-9]{32}$/.test(id)) return new Response(null, { status: 404, headers: privateHeaders })
  const db = await readyDatabase()
  const owner = await isOwner()
  const result = await db.execute({ sql: `SELECT a.mime,a.bytes FROM assets a WHERE a.id=? AND (?=1 OR (a.private_only=0 AND EXISTS (SELECT 1 FROM content_assets ca JOIN content c ON c.id=ca.content_id WHERE ca.asset_id=a.id AND c.visibility='public')))`, args: [id, owner ? 1 : 0] })
  if (!result.rows[0]) return new Response(null, { status: 404, headers: privateHeaders })
  const row = result.rows[0]
  return new Response(row.bytes as ArrayBuffer, { headers: { ...privateHeaders, 'Content-Type': String(row.mime), 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cross-Origin-Resource-Policy': 'same-origin' } })
}

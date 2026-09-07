import { authorizeAdmin, privateHeaders } from '@/lib/adminAuth'
import { readyDatabase } from '@/lib/database'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const denied = await authorizeAdmin(request)
  if (denied) return denied
  const db = await readyDatabase()
  const tx = await db.transaction('read')
  try {
    const content = (await tx.execute('SELECT * FROM content')).rows
    const assets = (await tx.execute('SELECT * FROM assets')).rows.map(row => ({ ...row, bytes: Buffer.from(row.bytes as ArrayBuffer).toString('base64') }))
    const references = (await tx.execute('SELECT * FROM content_assets')).rows
    const history = (await tx.execute('SELECT * FROM audit_log')).rows
    return new Response(JSON.stringify({ format: 'portfolio-private-v1', exportedAt: new Date().toISOString(), content, assets, references, history }, null, 2), { headers: { ...privateHeaders, 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="portfolio-private-${new Date().toISOString().slice(0,10)}.json"` } })
  } finally { tx.close() }
}

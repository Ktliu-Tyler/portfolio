import { NextResponse } from 'next/server'
import { authorizeAdmin, privateHeaders, SESSION_COOKIE } from '@/lib/adminAuth'
import { readyDatabase } from '@/lib/database'
import { hashPassword, verifyPassword } from '@/lib/password'
import { readLimitedJson, requestError } from '@/lib/requestSafety'
export async function POST(request: Request) {
  const denied = await authorizeAdmin(request, true)
  if (denied) return denied
  try {
    const { currentPassword, newPassword } = await readLimitedJson(request, 4096)
    if (typeof currentPassword !== 'string' || currentPassword.length > 256 || typeof newPassword !== 'string' || newPassword.length < 16 || newPassword.length > 256) return NextResponse.json({ error: '新密碼需為 16–256 個字元。' }, { status: 400, headers: privateHeaders })
    const db = await readyDatabase()
    const current = (await db.execute('SELECT password_hash,version FROM owner WHERE id=1')).rows[0]
    if (!current || !await verifyPassword(currentPassword, String(current.password_hash))) return NextResponse.json({ error: '目前密碼不正確。' }, { status: 400, headers: privateHeaders })
    const nextHash = await hashPassword(newPassword)
    const tx = await db.transaction('write')
    try {
      const changed = await tx.execute({ sql: 'UPDATE owner SET password_hash=?,version=version+1 WHERE id=1 AND version=?', args: [nextHash,current.version] })
      if (!changed.rowsAffected) return NextResponse.json({ error: '密碼已在另一個請求更新，請重新登入。' }, { status: 409, headers: privateHeaders })
      await tx.execute('DELETE FROM sessions')
      await tx.commit()
    } finally { tx.close() }
    const response = NextResponse.json({ ok: true }, { headers: privateHeaders })
    response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
    return response
  } catch (error) { const result = requestError(error, '密碼更新失敗。'); return NextResponse.json({ error: result.error }, { status: result.status, headers: privateHeaders }) }
}

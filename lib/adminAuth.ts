import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { readyDatabase } from './database'
import { hashPassword, verifyPassword } from './password'

export const SESSION_COOKIE = 'portfolio_owner'
export const SESSION_SECONDS = 60 * 60 * 8
export const privateHeaders = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Vary': 'Cookie' }
const digest = (token: string) => createHash('sha256').update(token).digest('hex')

export async function isOwner() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false
  const db = await readyDatabase()
  const result = await db.execute({ sql: 'SELECT 1 FROM sessions s JOIN owner o ON o.id=1 AND o.version=s.owner_version WHERE s.token_hash=? AND s.expires_at>?', args: [digest(token), Date.now()] })
  return result.rows.length === 1
}
export async function requireOwner() { if (!await isOwner()) redirect('/admin/login') }

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host') || ''
  const loopback = /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)
  // Next's local runtime can normalize request.url to localhost even when the
  // browser uses 127.0.0.1. Only the explicit loopback hosts use this fallback.
  const expected = process.env.ADMIN_ORIGIN || (!process.env.VERCEL && loopback ? `${new URL(request.url).protocol}//${host}` : new URL(request.url).origin)
  return origin === expected && request.headers.get('sec-fetch-site') !== 'cross-site'
}
export async function authorizeAdmin(request: Request, mutation = false) {
  if (!await isOwner()) return NextResponse.json({ error: '請先登入管理介面。' }, { status: 401, headers: privateHeaders })
  if (mutation && !sameOrigin(request)) return NextResponse.json({ error: '請從本站管理介面操作。' }, { status: 403, headers: privateHeaders })
  return null
}

export async function login(password: string) {
  const db = await readyDatabase()
  const owner = await db.execute('SELECT password_hash,version FROM owner WHERE id=1')
  if (!owner.rows.length) return { status: 503, error: '管理帳號尚未設定，請先完成本站擁有者設定。' }
  const now = Date.now()
  // The single-owner limit lives in the database and is atomic across server instances.
  const attempts = await db.batch([
    { sql: 'DELETE FROM login_attempts WHERE attempted_at<?', args: [now - 15 * 60 * 1000] },
    { sql: 'INSERT INTO login_attempts(attempted_at) SELECT ? WHERE (SELECT COUNT(*) FROM login_attempts)<10', args: [now] },
  ], 'write')
  if (!attempts[1].rowsAffected) return { status: 429, error: '登入嘗試次數過多，請在 15 分鐘後再試。' }
  const previousHash = String(owner.rows[0].password_hash)
  if (!await verifyPassword(password, previousHash)) return { status: 401, error: '密碼不正確。' }
  const upgradedHash = previousHash.startsWith('scrypt:') ? await hashPassword(password) : null
  const token = randomBytes(32).toString('hex')
  const tx = await db.transaction('write')
  try {
    // Recheck after the asynchronous password calculation. An old-password login
    // cannot create a usable session after another request changes the password.
    const current = (await tx.execute('SELECT version FROM owner WHERE id=1')).rows[0]
    if (!current || Number(current.version) !== Number(owner.rows[0].version)) return { status: 401, error: '登入資訊已更新，請重新登入。' }
    let version = Number(current.version)
    if (upgradedHash) {
      version++
      await tx.execute({ sql: 'UPDATE owner SET password_hash=?,version=? WHERE id=1', args: [upgradedHash, version] })
    }
    await tx.execute('DELETE FROM login_attempts')
    await tx.execute({ sql: 'DELETE FROM sessions WHERE expires_at<? OR owner_version!=?', args: [now,version] })
    await tx.execute({ sql: 'INSERT INTO sessions(token_hash,expires_at,owner_version) VALUES(?,?,?)', args: [digest(token), Date.now() + SESSION_SECONDS * 1000, version] })
    await tx.commit()
    return { status: 200, token }
  } finally { tx.close() }
}
export async function logout() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token) await (await readyDatabase()).execute({ sql: 'DELETE FROM sessions WHERE token_hash=?', args: [digest(token)] })
}

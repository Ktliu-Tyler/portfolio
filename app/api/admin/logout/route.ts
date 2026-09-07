import { NextResponse } from 'next/server'
import { logout, sameOrigin, privateHeaders, SESSION_COOKIE } from '@/lib/adminAuth'
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '來源不符。' }, { status: 403, headers: privateHeaders })
  await logout()
  const response = NextResponse.json({ ok: true }, { headers: privateHeaders })
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}

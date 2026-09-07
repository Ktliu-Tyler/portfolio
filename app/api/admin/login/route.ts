import { NextResponse } from 'next/server'
import { login, privateHeaders, sameOrigin, SESSION_COOKIE, SESSION_SECONDS } from '@/lib/adminAuth'
import { readLimitedJson, requestError } from '@/lib/requestSafety'
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '請從本站登入。' }, { status: 403, headers: privateHeaders })
  try {
    const { password } = await readLimitedJson(request, 2048)
    if (typeof password !== 'string' || password.length < 1 || password.length > 256) return NextResponse.json({ error: '請輸入密碼。' }, { status: 400, headers: privateHeaders })
    const result = await login(password)
    const response = NextResponse.json(result.token ? { ok: true } : { error: result.error }, { status: result.status, headers: privateHeaders })
    if (result.status === 429) response.headers.set('Retry-After', '900')
    if (result.token) response.cookies.set(SESSION_COOKIE, result.token, { httpOnly: true, secure: Boolean(process.env.VERCEL) || new URL(request.url).protocol === 'https:', sameSite: 'strict', path: '/', maxAge: SESSION_SECONDS })
    return response
  } catch (error) { const result = requestError(error, '目前無法登入，請稍後再試。'); return NextResponse.json({ error: result.error }, { status: result.status, headers: privateHeaders }) }
}

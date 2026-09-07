import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authorizeAdmin, privateHeaders } from '@/lib/adminAuth'
import { setVisibility } from '@/lib/contentStore'
import { readLimitedJson, requestError } from '@/lib/requestSafety'
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorizeAdmin(request, true)
  if (denied) return denied
  try {
    const { visibility, version } = await readLimitedJson(request, 1024)
    if ((visibility !== 'public' && visibility !== 'private') || typeof version !== 'number' || !Number.isSafeInteger(version) || version < 1) return NextResponse.json({ error: '狀態格式不正確。' }, { status: 400, headers: privateHeaders })
    const { id } = await params
    const result = await setVisibility(id, visibility, version)
    if (result.status === 200) revalidatePath('/', 'layout')
    return NextResponse.json(result, { status: result.status, headers: privateHeaders })
  } catch (error) { const result = requestError(error, '儲存失敗，請重新整理後再試。'); return NextResponse.json({ error: result.error }, { status: result.status, headers: privateHeaders }) }
}

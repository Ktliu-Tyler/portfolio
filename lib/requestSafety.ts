export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export async function readLimitedBytes(request: Request, maximum: number): Promise<Uint8Array> {
  const size = request.headers.get('content-length')
  if (size && (!/^\d+$/.test(size) || Number(size) > maximum)) throw new RequestError('資料超過允許大小。', 413)
  if (request.headers.get('content-encoding') && request.headers.get('content-encoding') !== 'identity') throw new RequestError('不支援壓縮的請求內容。', 415)
  const reader = request.body?.getReader()
  if (!reader) return new Uint8Array()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maximum) { await reader.cancel(); throw new RequestError('資料超過允許大小。', 413) }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  const output = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength }
  return output
}

export async function readLimitedJson(request: Request, maximum: number) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new RequestError('請使用 JSON 格式。', 415)
  try {
    const bytes = await readLimitedBytes(request, maximum)
    const result = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new RequestError('資料格式不正確。')
    return result as Record<string, unknown>
  } catch (error) {
    if (error instanceof RequestError) throw error
    throw new RequestError('JSON 格式不正確。')
  }
}

export async function readLimitedForm(request: Request, maximum = 4 * 1024 * 1024) {
  const type = request.headers.get('content-type') || ''
  if (!/^multipart\/form-data;\s*boundary=/i.test(type)) throw new RequestError('請使用 multipart 表單。', 415)
  const bytes = await readLimitedBytes(request, maximum)
  try { return await new Response(bytes as BodyInit, { headers: { 'Content-Type': type } }).formData() }
  catch { throw new RequestError('表單格式不正確。') }
}

export function requestError(error: unknown, fallback: string) {
  return { error: error instanceof RequestError ? error.message : fallback, status: error instanceof RequestError ? error.status : 500 }
}

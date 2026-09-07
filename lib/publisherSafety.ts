import { RequestError, readLimitedBytes } from './requestSafety'

export function parseGitHubRepository(value: string) {
  let owner: string, repo: string
  const clean = value.trim().replace(/\.git$/, '')
  if (/^[\w.-]+\/[\w.-]+$/.test(clean)) [owner, repo] = clean.split('/')
  else {
    let url: URL
    try { url = new URL(clean) } catch { throw new RequestError('請輸入 GitHub 儲存庫網址或 owner/repo。') }
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.search || url.hash || !/^\/[^/]+\/[^/]+\/?$/.test(url.pathname)) throw new RequestError('僅接受 https://github.com/owner/repo 格式。')
    ;[owner, repo] = url.pathname.split('/').filter(Boolean)
  }
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(owner) || !/^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,99}$/.test(repo) || repo.includes('..')) throw new RequestError('GitHub 儲存庫名稱不正確。')
  return { owner, repo, url: `https://github.com/${owner}/${repo}` }
}

export async function validateUploads(files: File[]) {
  if (files.length > 8) throw new RequestError('一次最多上傳 8 個檔案。')
  const names = new Set<string>()
  for (const file of files) {
    if (file.size > 3 * 1024 * 1024) throw new RequestError('單一檔案最多 3 MB。', 413)
    if (!file.name || file.name.length > 180 || /[\\/\u0000-\u001f]/.test(file.name) || names.has(file.name)) throw new RequestError('檔名不能包含路徑，也不能重複。')
    names.add(file.name)
    const ext = file.name.toLowerCase().split('.').pop()
    const head = Buffer.from(await file.slice(0, 16).arrayBuffer())
    const type = file.type.toLowerCase()
    const valid =
      (ext === 'png' && type === 'image/png' && head.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
      (['jpg','jpeg'].includes(ext || '') && type === 'image/jpeg' && head[0] === 255 && head[1] === 216 && head[2] === 255) ||
      (ext === 'webp' && type === 'image/webp' && head.toString('ascii',0,4) === 'RIFF' && head.toString('ascii',8,12) === 'WEBP') ||
      (ext === 'pdf' && ['','application/pdf'].includes(type) && head.toString('ascii',0,5) === '%PDF-') ||
      (ext === 'docx' && ['','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type) && head[0] === 80 && head[1] === 75 && head[2] === 3 && head[3] === 4) ||
      (ext === 'doc' && ['','application/msword'].includes(type) && head.subarray(0,8).equals(Buffer.from([208,207,17,224,161,177,26,225]))) ||
      (['md','txt'].includes(ext || '') && ['','text/plain','text/markdown'].includes(type) && !Buffer.from(await file.arrayBuffer()).includes(0))
    if (!valid) throw new RequestError('檔案內容與類型不符；支援 PNG、JPEG、WebP、PDF、Word 及文字檔。', 415)
  }
}

export async function providerFetch(url: string, init: RequestInit = {}, timeout = 20_000) {
  const target = new URL(url)
  if (target.protocol !== 'https:' || !['api.github.com','api.openai.com'].includes(target.hostname) || target.port || target.username || target.password) throw new Error('Provider destination rejected.')
  return fetch(target, { ...init, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(timeout) })
}

export async function providerJson<T>(response: Response, maximum = 2 * 1024 * 1024): Promise<T> {
  const request = new Request('https://provider.invalid', { method: 'POST', body: response.body, duplex: 'half' } as RequestInit)
  return JSON.parse(new TextDecoder().decode(await readLimitedBytes(request, maximum))) as T
}

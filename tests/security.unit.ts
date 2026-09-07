import assert from 'node:assert/strict'
import { test } from 'node:test'
import { RequestError, readLimitedBytes, readLimitedJson, readLimitedForm } from '../lib/requestSafety'
import { parseGitHubRepository, providerFetch, providerJson, validateUploads } from '../lib/publisherSafety'
import { stripDraftFrontmatter, validateExportDraft } from '../lib/draftSafety'
import { safeContentUrl } from '../lib/safeUrl'
import { hashPassword, verifyPassword } from '../lib/password'
import { scryptSync } from 'node:crypto'

const request = (body: string, headers: Record<string,string> = { 'Content-Type': 'application/json' }) => new Request('https://portfolio.test', { method: 'POST', body, headers })
test('request size is bounded for chunked streams without Content-Length', async () => {
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(8)); controller.enqueue(new Uint8Array(8)); controller.close() } })
  await assert.rejects(readLimitedBytes(new Request('https://portfolio.test', { method: 'POST', body, duplex: 'half' } as RequestInit), 10), error => error instanceof RequestError && error.status === 413)
})
test('invalid JSON and arrays are rejected', async () => {
  for (const value of ['{', 'null', '[]', '"text"']) await assert.rejects(readLimitedJson(request(value), 100), RequestError)
  assert.deepEqual(await readLimitedJson(request('{"ok":true}'),100), { ok:true })
})
test('content type, compressed body and advertised oversized input are rejected', async () => {
  await assert.rejects(readLimitedJson(request('{}', { 'Content-Type':'text/plain' }),100), RequestError)
  await assert.rejects(readLimitedBytes(request('{}', { 'Content-Type':'application/json','Content-Encoding':'gzip' }),100), RequestError)
  await assert.rejects(readLimitedBytes(request('{}', { 'Content-Type':'application/json','Content-Length':'1000' }),100), RequestError)
  await assert.rejects(readLimitedForm(request('{}')), RequestError)
})
test('frontmatter is stripped without evaluating executable languages or YAML tags', () => {
  assert.equal(stripDraftFrontmatter('---\ntitle: ordinary\n---\n\nBody'),'Body')
  assert.equal(stripDraftFrontmatter('---\nvalue: !!js/function function () {}\n---\nBody'),'Body')
  for (const text of ['---javascript\n({title: 1+1})\n---\nBody','---js\n({title: 1})\n---\nBody','---\nunterminated']) assert.throws(() => stripDraftFrontmatter(text),RequestError)
})
test('export draft cannot write outside its own article asset directory', () => {
  const draft = { slug:'safe-article', title:'Safe', mdx:'Body', tags:[], confidenceNotes:[], category:'work-log', assetPlan:[] }
  assert.equal(validateExportDraft(draft).slug,'safe-article')
  for (const slug of ['../danger','a/b','a?b','a%2Fb']) assert.throws(() => validateExportDraft({ ...draft,slug }),RequestError)
  for (const targetPath of ['.github/workflows/run.yml','public/images/articles/safe-article/../../file.png','public/images/articles/safe-article/cover-payload.svg','public/images/articles/someone-else/cover-a.png']) assert.throws(() => validateExportDraft({ ...draft, assetPlan:[{ originalName:'file.png',targetPath,publicPath:'/'+targetPath.slice(7) }] }),RequestError)
})
test('GitHub targets reject userinfo, query injection, redirects and other hosts', () => {
  assert.deepEqual(parseGitHubRepository('https://github.com/owner/repo.git'), { owner:'owner',repo:'repo',url:'https://github.com/owner/repo' })
  for (const value of ['http://github.com/owner/repo','https://attacker.invalid/owner/repo','https://github.com@attacker.invalid/owner/repo','https://github.com/owner/repo?redirect=x','https://github.com/owner/..','https://github.com:444/owner/repo','https://github.com/owner/repo/tree/main']) assert.throws(() => parseGitHubRepository(value),RequestError)
})
test('outbound requests use approved hosts, reject redirects and have a timeout', async () => {
  const original = globalThis.fetch
  let calls=0
  globalThis.fetch = async (_input,init) => { calls++; assert.equal(init?.redirect,'error'); assert.ok(init?.signal); assert.equal(init?.cache,'no-store'); return new Response('{}') }
  try {
    for (const value of ['http://127.0.0.1/','https://attacker.invalid/','https://api.github.com@attacker.invalid/']) await assert.rejects(providerFetch(value))
    assert.equal(calls,0)
    await providerFetch('https://api.github.com/repos/owner/repo')
    assert.equal(calls,1)
  } finally { globalThis.fetch=original }
})
test('upstream response bodies have an independent maximum size', async () => {
  await assert.rejects(providerJson(new Response('x'.repeat(30)),10),RequestError)
})
test('uploads reject spoofed signatures, executable formats and path filenames', async () => {
  for (const file of [new File(['<script/>'],'cover.png',{type:'image/png'}),new File(['<svg/>'],'x.svg',{type:'image/svg+xml'}),new File(['text'],'../note.txt',{type:'text/plain'}),new File([new Uint8Array(3*1024*1024+1)],'big.txt',{type:'text/plain'})]) await assert.rejects(validateUploads([file]),RequestError)
  await validateUploads([new File(['ordinary notes'],'note.txt',{type:'text/plain'})])
})
test('rendered links reject script schemes, protocol-relative URLs and control bytes', () => {
  for (const url of ['javascript:alert(1)','data:text/html,<script/>','//evil.invalid','/\\evil.invalid','java\nscript:alert(1)']) assert.equal(safeContentUrl(url),'#')
  assert.equal(safeContentUrl('/blog/example'),'/blog/example')
  assert.equal(safeContentUrl('https://github.com/owner/repo'),'https://github.com/owner/repo')
})
test('stronger scrypt hash verifies passwords and supports legacy migration', async () => {
  const password='unit-test-password-16'
  const hash=await hashPassword(password)
  assert.ok(hash.startsWith('scrypt-v2:'))
  assert.ok(await verifyPassword(password,hash))
  assert.equal(await verifyPassword('wrong',hash),false)
  const salt='a'.repeat(32)
  const legacy=`scrypt:${salt}:${scryptSync(password,salt,64).toString('hex')}`
  assert.ok(await verifyPassword(password,legacy))
})

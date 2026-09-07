import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import fs from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import { createClient } from '@libsql/client'
import { readyDatabase } from '../lib/database'
import { hashPassword } from '../lib/password'

async function main() {
  fs.mkdirSync('.private', { recursive: true })
  const databaseUrl = `file:.private/privacy-test-${Date.now()}.db`
  const source = createClient({ url: 'file:.private/portfolio.db' })
  process.env.DATABASE_URL = databaseUrl
  const db = await readyDatabase()
  for (const table of ['content', 'assets', 'content_assets']) {
    const rows = (await source.execute(`SELECT * FROM ${table}`)).rows
    for (const row of rows) {
      const columns = Object.keys(row)
      await db.execute({ sql: `INSERT INTO ${table}(${columns.join(',')}) VALUES(${columns.map(() => '?').join(',')})`, args: columns.map(column => row[column]) })
    }
  }
  source.close()
  const password = randomBytes(24).toString('base64url')
  await db.execute({ sql: 'INSERT INTO owner(id,password_hash) VALUES(1,?)', args: [await hashPassword(password)] })
  const base = 'http://127.0.0.1:3101'
  const output = fs.openSync('.private/privacy-test-server.log', 'w')
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'], { env: { ...process.env, DATABASE_URL: databaseUrl, ADMIN_ORIGIN: base, NEXT_DIST_DIR: '.next', OPENAI_API_KEY: '', GITHUB_TOKEN: '' }, stdio: ['ignore', output, output], windowsHide: true })
  let count = 0
  function check(condition: unknown, name: string) { assert.ok(condition, name); count++; console.log(`PASS ${name}`) }
  let cookie = ''
  async function call(path: string, method = 'GET', body?: unknown, authenticated = false, origin = base) {
    return fetch(base + path, { method, redirect: 'manual', headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(authenticated ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined })
  }
  async function signIn() {
    const response = await call('/api/admin/login', 'POST', { password })
    check(response.status === 200, 'owner can sign in')
    const header = response.headers.get('set-cookie') || ''
    check(header.includes('HttpOnly') && /SameSite=strict/i.test(header), 'session cookie is HttpOnly and SameSite Strict')
    cookie = header.split(';')[0]
  }
  try {
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error('Test server exited; see private server log.')
      try { if ((await call('/admin/login')).status === 200) { ready = true; break } } catch {}
      await delay(400)
    }
    check(ready, 'production server starts')
    const loginPage = await call('/admin/login')
    const policy = loginPage.headers.get('content-security-policy') || ''
    const nonce = /'nonce-([^']+)'/.exec(policy)?.[1]
    const loginHtml = await loginPage.text()
    check(Boolean(nonce) && policy.includes("'strict-dynamic'") && !policy.includes("'unsafe-eval'"), 'production admin uses nonce-based CSP without unsafe-eval')
    check(loginHtml.includes(`nonce="${nonce}"`), 'Next scripts receive the same nonce as the policy')
    check(loginPage.headers.get('x-frame-options') === 'DENY', 'admin cannot be embedded in another site')
    for (const path of ['/.private/portfolio.db','/.private/owner-access.txt','/.env.local','/.git/config']) check((await call(path)).status === 404, `${path} is not a public file`)
    for (const path of ['/admin','/admin/publisher','/admin/settings','/admin/preview/article%3Avehicle-telemetry-stack']) {
      const response = await call(path)
      check(response.status === 307 && response.headers.get('location') === '/admin/login', `${path} requires login`)
    }
    for (const path of ['/api/admin/backup','/api/publisher/draft','/api/publisher/github-pr','/api/admin/drafts']) {
      check((await call(path, path.endsWith('backup') ? 'GET' : 'POST', path.endsWith('backup') ? undefined : {})).status === 401, `${path} rejects anonymous access`)
    }
    check((await call('/api/admin/login','POST',{ password },false,'https://attacker.invalid')).status === 403, 'login rejects cross-origin requests')
    check((await call('/api/admin/login','POST',{ password: 'wrong' })).status === 401, 'wrong password rejected')
    await signIn()
    check((await call('/api/admin/login','POST',{ password:'x'.repeat(3000) })).status === 413, 'login body is bounded before JSON parsing')
    const malformed = await fetch(base+'/api/admin/login', { method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:'{' })
    check(malformed.status === 400, 'malformed login JSON returns a controlled client error')
    const wrongType = await fetch(base+'/api/admin/login', { method:'POST',headers:{Origin:base,'Content-Type':'text/plain'},body:'{}' })
    check(wrongType.status === 415, 'login rejects unexpected content types')
    const dashboard = await call('/admin','GET',undefined,true)
    check(dashboard.status === 200 && (await dashboard.text()).includes('My content'), 'owner sees content management')
    const articleId = 'article:vehicle-telemetry-stack'
    const articlePath = '/api/admin/content/' + encodeURIComponent(articleId)
    const current = (await db.execute({ sql: 'SELECT * FROM content WHERE id=?', args: [articleId] })).rows[0]
    check((await call(articlePath,'PATCH',{ visibility: 'private', version: current.version })).status === 401, 'anonymous visibility mutation rejected')
    check((await call(articlePath,'PATCH',{ visibility: 'private', version: current.version },true,'https://attacker.invalid')).status === 403, 'cross-origin mutation rejected')
    check((await call(articlePath,'PATCH',{ visibility: 'private', version: current.version },true)).status === 200, 'owner can make public article private')
    check((await call('/blog/vehicle-telemetry-stack')).status === 404, 'private article URL returns 404')
    check((await call('/blog/vehicle-telemetry-stack','GET',undefined,true)).status === 404, 'public article route remains private even for owner; use private preview')
    check(!(await (await call('/blog')).text()).includes(String(current.title)), 'private article title excluded from list and RSC payload')
    check(!(await (await call('/sitemap.xml')).text()).includes('/blog/vehicle-telemetry-stack'), 'private article excluded from sitemap')
    const preview = await call('/admin/preview/'+encodeURIComponent(articleId),'GET',undefined,true)
    check(preview.status === 200, `owner can preview a private article (HTTP ${preview.status}, location ${preview.headers.get('location')})`)
    check((await call(articlePath,'PATCH',{ visibility: 'public', version: current.version },true)).status === 409, 'stale write rejected instead of overwriting newer state')
    check((await call(articlePath,'PATCH',{ visibility: 'public', version: Number(current.version)+1 },true)).status === 200, 'owner can republish article')
    check((await call('/blog/vehicle-telemetry-stack')).status === 200, 'republished article is immediately readable')

    const certificates = (await db.execute("SELECT * FROM content WHERE kind='certificate'")).rows
    check(certificates.length === 5, 'all five award and certificate images migrated')
    for (const certificate of certificates) {
      const data = JSON.parse(String(certificate.data))
      check((await call(data.src)).status === 404, `${certificate.slug}: anonymous asset blocked`)
      const image = await call(data.src,'GET',undefined,true)
      check(image.status === 200 && image.headers.get('cache-control')?.includes('no-store'), `${certificate.slug}: owner-only media bypasses caches`)
    }
    check((await call('/api/admin/content/'+encodeURIComponent(String(certificates[0].id)),'PATCH',{ visibility: 'public', version: 1 },true)).status === 403, 'certificate cannot be made public through API')
    check((await call('/experience/deans-list-confirmed')).status === 404, 'award detail record is private by default')
    check((await call('/images/experience/dean-list-113-2-redacted.jpg')).status === 404, 'legacy public certificate image removed')
    check((await call('/_next/image?url=%2Fimages%2Fexperience%2Fdean-list-113-2-redacted.jpg&w=640&q=75')).status !== 200, 'image optimizer cannot expose legacy certificate')
    check((await call('/_next/image?url='+encodeURIComponent(JSON.parse(String(certificates[0].data)).src)+'&w=640&q=75')).status !== 200, 'image optimizer cannot expose private database media')
    const publicAsset = (await db.execute('SELECT a.id FROM assets a WHERE a.private_only=0 AND EXISTS (SELECT 1 FROM content_assets ca JOIN content c ON c.id=ca.content_id WHERE ca.asset_id=a.id AND c.visibility=\'public\') LIMIT 1')).rows[0]
    check((await call('/media/'+publicAsset.id)).status === 200, 'image attached to public content is accessible')
    await db.execute({ sql: "UPDATE content SET visibility='private' WHERE id IN (SELECT content_id FROM content_assets WHERE asset_id=?)", args: [publicAsset.id] })
    check((await call('/media/'+publicAsset.id)).status === 404, 'image access is revoked when all referencing content becomes private')
    check((await call('/media/'+publicAsset.id,'GET',undefined,true)).status === 200, 'owner retains access to image after revocation')

    const project = (await db.execute("SELECT * FROM content WHERE kind='project' LIMIT 1")).rows[0]
    check((await call('/api/admin/content/'+encodeURIComponent(String(project.id)),'PATCH',{ visibility: 'private', version: project.version },true)).status === 200, 'project supports privacy changes')
    check(!(await (await call('/projects')).text()).includes(JSON.parse(String(project.data)).link), 'hidden project repository URL excluded from browser payload')
    const experience = (await db.execute("SELECT * FROM content WHERE kind='experience' AND slug='ntu-racing-electrical-systems'")).rows[0] || (await db.execute("SELECT * FROM content WHERE kind='experience' AND visibility='public' LIMIT 1")).rows[0]
    check((await call('/api/admin/content/'+encodeURIComponent(String(experience.id)),'PATCH',{ visibility: 'private', version: experience.version },true)).status === 200, 'experience supports privacy changes')
    check((await call('/experience/'+experience.slug)).status === 404, 'hidden experience direct link blocked')
    check(!(await (await call('/')).text()).includes(`/experience/${experience.slug}`), 'hidden experience removed from homepage links')

    const draft = { slug: 'private-test-draft', title: 'PRIVATE_SENTINEL_DRAFT', mdx: '---\ntitle: Test\n---\n## Private note\n\nConfidential test body.', tags: ['test'], date: '2026-09-07' }
    check((await call('/api/admin/drafts','POST',{ ...draft,slug:'bad-frontmatter',mdx:'---javascript\n({title: 1 + 1})\n---\nUntrusted body' },true)).status === 400, 'draft API rejects executable document frontmatter')
    check((await call('/api/admin/drafts','POST',{ ...draft,slug:'../outside' },true)).status === 400, 'draft API rejects traversal slugs')
    check((await call('/api/admin/drafts','POST',{ ...draft,mdx:'a'.repeat(500001) },true)).status === 413, 'draft API bounds large input before parsing')
    const uploadHeaders={Origin:base,Cookie:cookie}
    const maliciousRepo=new FormData();maliciousRepo.set('repoUrls','https://github.com/owner/repo?redirect=1')
    check((await fetch(base+'/api/publisher/draft',{method:'POST',headers:uploadHeaders,body:maliciousRepo})).status===400, 'publisher rejects malformed repository URLs before fetching')
    const spoofed=new FormData();spoofed.set('notes','test');spoofed.append('files',new File(['<script/>'],'image.png',{type:'image/png'}))
    check((await fetch(base+'/api/publisher/draft',{method:'POST',headers:uploadHeaders,body:spoofed})).status===415, 'publisher rejects fake image uploads')
    const localDraft=new FormData();localDraft.set('notes','Local-only security test notes.');localDraft.set('title','Local draft')
    const generated=await fetch(base+'/api/publisher/draft',{method:'POST',headers:uploadHeaders,body:localDraft})
    check(generated.status===200 && (await generated.json()).draft.generatedBy==='heuristic', 'publisher generates a local draft without sending notes to AI')
    const exportForm=new FormData();exportForm.set('draft',JSON.stringify({ ...draft,slug:'../../.github/workflows/bad',category:'work-log',confidenceNotes:[],assetPlan:[] }))
    check((await fetch(base+'/api/publisher/github-pr',{method:'POST',headers:uploadHeaders,body:exportForm})).status===400, 'GitHub export rejects path injection before any provider write')
    check((await call('/api/admin/drafts','POST',draft,true)).status === 201, 'new draft saves to database')
    check((await call('/blog/private-test-draft')).status === 404, 'new draft is private by default')
    check((await call('/api/admin/drafts','POST',draft,true)).status === 409, 'duplicate draft never overwrites existing content')
    check((await db.execute('SELECT COUNT(*) AS n FROM audit_log')).rows[0].n as number >= 4, 'publication changes recorded in audit log')
    const backupResponse = await call('/api/admin/backup','GET',undefined,true)
    const backup = await backupResponse.json()
    check(backup.format === 'portfolio-private-v1' && backup.assets.length > 0 && !JSON.stringify(backup).includes('password_hash'), 'private backup contains content and media without account credentials')
    const originalAsset = (await db.execute('SELECT * FROM assets LIMIT 1')).rows[0]
    check(Buffer.from(backup.assets.find((item: { id: string }) => item.id === originalAsset.id).bytes,'base64').equals(Buffer.from(originalAsset.bytes as ArrayBuffer)), 'backup preserves media bytes exactly')
    fs.writeFileSync('.private/test-backup.json',JSON.stringify(backup))
    const restoreUrl = `file:.private/restore-test-${Date.now()}.db`
    const restoreArgs = ['node_modules/tsx/dist/cli.mjs','scripts/restore-backup.ts','.private/test-backup.json']
    const restored = spawnSync(process.execPath, restoreArgs, { env: { ...process.env, DATABASE_URL: restoreUrl }, encoding: 'utf8', windowsHide: true })
    check(restored.status === 0, 'backup restores into a separate empty database')
    const restoredDb = createClient({ url: restoreUrl })
    check(Number((await restoredDb.execute('SELECT COUNT(*) AS n FROM content')).rows[0].n) === backup.content.length, 'restore preserves every content record')
    check((await restoredDb.execute('SELECT 1 FROM owner')).rows.length === 0, 'restore does not copy owner credentials')
    restoredDb.close()
    check(spawnSync(process.execPath, restoreArgs, { env: { ...process.env, DATABASE_URL: restoreUrl }, windowsHide: true }).status === 1, 'restore refuses to overwrite a populated database')

    const priorCookie = cookie
    check((await call('/api/admin/logout','POST',undefined,true)).status === 200, 'owner can log out')
    cookie = priorCookie
    check((await call('/api/admin/backup','GET',undefined,true)).status === 401, 'replayed cookie fails after logout')
    await signIn()
    await db.execute('UPDATE owner SET version=version+1 WHERE id=1')
    check((await call('/api/admin/backup','GET',undefined,true)).status === 401, 'credential version change rejects an old session even before session rows are removed')
    await signIn()
    const token = cookie.slice(cookie.indexOf('=')+1)
    await db.execute({ sql:'UPDATE sessions SET expires_at=? WHERE token_hash=?',args:[Date.now()-1000,createHash('sha256').update(token).digest('hex')] })
    check((await call('/api/admin/backup','GET',undefined,true)).status === 401, 'expired session rejected')
    await signIn()
    const firstPassword = randomBytes(24).toString('base64url')
    const secondPassword = randomBytes(24).toString('base64url')
    const changes = await Promise.all([call('/api/admin/password','POST',{ currentPassword:password,newPassword:firstPassword },true),call('/api/admin/password','POST',{ currentPassword:password,newPassword:secondPassword },true)])
    check(changes.filter(response=>response.status===200).length===1 && changes.every(response=>[200,401,409].includes(response.status)), 'concurrent password changes cannot both overwrite credentials')
    const newPassword=changes[0].status===200 ? firstPassword : secondPassword
    check((await call('/api/admin/backup','GET',undefined,true)).status === 401, 'password change revokes all existing sessions')
    check((await call('/api/admin/login','POST',{ password })).status === 401, 'old password no longer works')
    check((await call('/api/admin/login','POST',{ password: newPassword })).status === 200, 'new password works')
    for (let i=0;i<10;i++) await call('/api/admin/login','POST',{ password:'wrong' })
    check((await call('/api/admin/login','POST',{ password:'wrong' })).status === 429, 'database-backed login rate limit enforced')
    console.log(`\n${count} privacy and authentication checks passed against the production server.`)
  } finally { server.kill(); fs.closeSync(output); db.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })

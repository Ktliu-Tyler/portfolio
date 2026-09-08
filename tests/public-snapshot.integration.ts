import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import { createClient } from '@libsql/client'

async function main() {
  const snapshot = JSON.parse(fs.readFileSync('data/public-snapshot.json', 'utf8'))
  const db = createClient({ url: 'file:.private/portfolio.db' })
  const privateRecords = (await db.execute("SELECT kind,slug,id FROM content WHERE visibility='private'")).rows
  const privateAssets = (await db.execute('SELECT id FROM assets WHERE private_only=1')).rows
  db.close()
  assert(snapshot.records.length > 0)
  assert(snapshot.records.every((row: any) => row.visibility === 'public' && row.kind !== 'certificate'))
  for (const row of privateRecords) assert(!snapshot.records.some((item: any) => item.id === row.id))
  for (const row of privateAssets) assert(!snapshot.assets.some((item: any) => item.id === row.id))
  const base = 'http://127.0.0.1:3104'
  const log = fs.openSync('.private/snapshot-test-server.log', 'w')
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3104'], {
    env: { ...process.env, VERCEL: '1', DATABASE_URL: '', DATABASE_AUTH_TOKEN: '', ADMIN_ORIGIN: base },
    windowsHide: true, stdio: ['ignore', log, log],
  })
  try {
    let ready = false
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw new Error('Snapshot test server exited')
      try { if ((await fetch(base + '/admin/login')).status === 200) { ready = true; break } } catch {}
      await delay(300)
    }
    assert(ready)
    for (const path of ['/', '/blog', '/experience', '/projects', '/sitemap.xml']) {
      const response = await fetch(base + path)
      assert.equal(response.status, 200, path)
      const body = await response.text()
      for (const row of privateRecords) if (row.kind === 'article') assert(!body.includes('/blog/' + row.slug))
      console.log('PASS public page without cloud database:', path)
    }
    const asset = snapshot.assets[0]
    const image = await fetch(base + '/media/' + asset.id)
    assert.equal(image.status, 200)
    assert.deepEqual(Buffer.from(await image.arrayBuffer()), Buffer.from(asset.bytes, 'base64'))
    for (const row of privateAssets) assert.equal((await fetch(base + '/media/' + row.id)).status, 404)
    for (const row of privateRecords) if (row.kind === 'article') assert.equal((await fetch(base + '/blog/' + row.slug)).status, 404)
    for (const path of ['/.private/portfolio.db', '/.private/owner-access.txt', '/data/public-snapshot.json', '/images/experience/dean-list-113-2-redacted.jpg']) assert.equal((await fetch(base + path)).status, 404)
    const admin = await fetch(base + '/admin', { redirect: 'manual' })
    assert.equal(admin.status, 307)
    assert.equal(admin.headers.get('location'), '/admin/login')
    console.log('PASS public image bytes, private articles/assets, internal files, and admin access boundary')
  } finally {
    server.kill()
    fs.closeSync(log)
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
function derive(password: string, salt: string, parallelization: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, { N: 16384, r: 8, p: parallelization, maxmem: 32 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key))
  })
}
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await derive(password, salt, 5)
  return `scrypt-v2:${salt}:${key.toString('hex')}`
}
export async function verifyPassword(password: string, hash: string) {
  const [scheme, salt, encoded] = hash.split(':')
  if (!['scrypt','scrypt-v2'].includes(scheme) || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(encoded || '')) return false
  const actual = await derive(password, salt, scheme === 'scrypt-v2' ? 5 : 1)
  return timingSafeEqual(actual, Buffer.from(encoded, 'hex'))
}

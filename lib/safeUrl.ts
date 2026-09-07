export function safeContentUrl(value: string) {
  if (/^[\s\S]*[\u0000-\u001f\u007f\\]/.test(value)) return '#'
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (value.startsWith('#')) return value
  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : '#'
  } catch { return '#' }
}

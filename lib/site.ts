const fallbackSiteUrl = 'https://portfolio-5wie.vercel.app'

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return fallbackSiteUrl
  }

  try {
    return new URL(value).origin
  } catch {
    return fallbackSiteUrl
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const siteTitle =
  'Tyler Liu | Embedded Systems, Vehicle Telemetry & Haptics'

export const siteDescription =
  'Technical portfolio and experience records for Tyler Liu, an NTU Mechanical Engineering student focused on embedded systems, vehicle telemetry, haptics, IoT, and intelligent mechatronics.'

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

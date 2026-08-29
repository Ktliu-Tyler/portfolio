import { NextResponse } from 'next/server'

export function validatePublisherRequest(req: Request) {
  const expectedToken = process.env.PUBLISHER_AUTH_TOKEN

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Publisher is not configured for this deployment.' },
      { status: 403 },
    )
  }

  if (req.headers.get('x-publisher-token') !== expectedToken) {
    return NextResponse.json(
      { error: 'Publisher token is required.' },
      { status: 401 },
    )
  }

  return null
}

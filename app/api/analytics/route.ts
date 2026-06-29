import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/dynamo/analytics'

export async function POST(req: NextRequest) {
  const { siteId, event, meta } = await req.json()
  if (!siteId || !event) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  await trackEvent(siteId, event, meta)
  return NextResponse.json({ success: true })
}

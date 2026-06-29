import { NextRequest, NextResponse } from 'next/server'
import { saveContact } from '@/lib/dynamo/contacts'
import { trackEvent } from '@/lib/dynamo/analytics'
import { generateId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { siteId, name, email, message } = await req.json()

  if (!siteId || !name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const submission = {
    id: generateId(),
    siteId,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  }

  await saveContact(submission)

  // Track the event (non-blocking failure ok)
  trackEvent(siteId, 'contact_submit').catch(() => {})

  return NextResponse.json({ success: true })
}

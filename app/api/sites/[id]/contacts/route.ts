import { NextRequest, NextResponse } from 'next/server'
import { getSiteById } from '@/lib/dynamo/sites'
import { getContactsBySite } from '@/lib/dynamo/contacts'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const contacts = await getContactsBySite(id)
  return NextResponse.json({ contacts })
}

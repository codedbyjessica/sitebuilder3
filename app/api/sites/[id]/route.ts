import { NextRequest, NextResponse } from 'next/server'
import { getSiteById, updateSite, deleteSite } from '@/lib/dynamo/sites'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ site })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updates = await req.json()
  // Prevent overwriting protected fields
  delete updates.id
  delete updates.userId
  delete updates.createdAt

  await updateSite(id, updates)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await deleteSite(id)
  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getSiteById } from '@/lib/dynamo/sites'
import { getImagesBySite, deleteImage } from '@/lib/dynamo/images'
import { deleteObject } from '@/lib/s3/upload'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const images = await getImagesBySite(id)
  return NextResponse.json({ images })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const site = await getSiteById(id)
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { imageId, key } = await req.json()
  if (!imageId) return NextResponse.json({ error: 'Missing imageId' }, { status: 400 })

  await Promise.all([
    deleteImage(imageId),
    key ? deleteObject(key).catch(() => {}) : Promise.resolve(),
  ])

  return NextResponse.json({ success: true })
}

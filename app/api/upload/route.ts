import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl, getPublicUrl } from '@/lib/s3/upload'
import { saveImage } from '@/lib/dynamo/images'
import { generateId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { siteId, filename, contentType } = await req.json()
  if (!siteId || !filename || !contentType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
  }

  const id = generateId()
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const key = `sites/${siteId}/${id}.${ext}`

  const uploadUrl = await getUploadUrl(key, contentType)
  const publicUrl = getPublicUrl(key)

  await saveImage({
    id,
    siteId,
    url: publicUrl,
    key,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ uploadUrl, publicUrl, id })
}

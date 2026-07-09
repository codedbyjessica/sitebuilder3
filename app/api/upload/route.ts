import { NextRequest, NextResponse } from 'next/server'
import { generateId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    // TODO(security): Once auth is wired up, verify that userId owns siteId before accepting the
    // upload. Until then any caller with a valid siteId can attach images to any site (IDOR).
    const userId = req.headers.get('x-user-id') // reserved for ownership check

    const { siteId, filename, contentType, base64 } = await req.json()
    if (!siteId || !filename || !contentType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    if (!base64) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
    }

    const id = generateId()
    const publicUrl = base64

    // Try to save to DynamoDB, but don't fail if it's not available (dev mode without AWS)
    try {
      const { saveImage } = await import('@/lib/dynamo/images')
      await saveImage({
        id,
        siteId,
        url: publicUrl,
        key: '', // No S3 key for base64
        createdAt: new Date().toISOString(),
      })
    } catch (dbErr) {
      console.warn('Could not save image to database (dev mode?):', dbErr)
    }

    return NextResponse.json({ publicUrl, id })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

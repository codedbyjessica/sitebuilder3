import { NextRequest, NextResponse } from 'next/server'
import { checkSlugAvailable } from '@/lib/dynamo/sites'

// TODO(db): This endpoint checks slug availability against the DynamoDB SITES table.
// Currently, DynamoDB isn't set up in development, so this will always return "available: true".
// Once the database is properly configured with AWS credentials (.env.local), this will
// query the database to ensure each slug is unique across all published sites.

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const siteId = req.nextUrl.searchParams.get('siteId')

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 })
  }

  try {
    const available = await checkSlugAvailable(slug)
    // TODO(db): When the DB supports ownership queries, also allow the slug when it belongs to `siteId`.
    const isAvailable = available

    return NextResponse.json({ available: isAvailable, slug })
  } catch (err) {
    console.error('Slug check error:', err)
    // In development without DB, gracefully assume slug is available
    console.warn('Could not check slug availability (DB not configured)', slug)
    return NextResponse.json({ available: true, slug })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createSite, getSitesByUser, checkSlugAvailable } from '@/lib/dynamo/sites'
import { slugify, generateId } from '@/lib/utils'
import type { BusinessData } from '@/lib/types'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sites = await getSitesByUser(userId)
  return NextResponse.json({ sites })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { businessName } = body

  if (!businessName) {
    return NextResponse.json({ error: 'Business name required' }, { status: 400 })
  }

  let slug = slugify(businessName)
  const available = await checkSlugAvailable(slug)
  if (!available) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const site: BusinessData = {
    id: generateId(),
    userId,
    slug,
    businessName,
    category: body.category || '',
    description: body.description || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    city: body.city || '',
    services: body.services || [],
    hours: body.hours || {},
    template: body.template || 'modern',
    published: false,
    createdAt: new Date().toISOString(),
  }

  await createSite(site)
  return NextResponse.json({ site }, { status: 201 })
}

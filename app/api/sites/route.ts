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

  // TODO(db): body.id is accepted so images uploaded during the create wizard stay linked to
  // the site record. Once real auth (JWT/session) is in place, validate that body.id either
  // doesn't exist yet (add ConditionExpression: 'attribute_not_exists(id)' to the PutCommand)
  // or belongs to the authenticated user — otherwise any user can overwrite any site by UUID.
  const site: BusinessData = {
    id: body.id || generateId(),
    userId,
    slug,
    businessName,
    category: body.category || '',
    description: body.description || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    city: body.city || '',
    layout: body.layout || 'minimal',
    fontId: body.fontId || 'classic',
    navCtas: body.navCtas || [],
    heroCtas: body.heroCtas || [],
    heroImage: body.heroImage || '',
    contactTitle: body.contactTitle || '',
    hideContact: body.hideContact ?? false,
    hideContactForm: body.hideContactForm ?? false,
    footerCopy: body.footerCopy || '',
    sections: body.sections || [],
    hours: body.hours || {},
    template: body.template || 'cloud',
    // TODO(db): Accept body.published so handlePublish's first-time POST creates the site as
    // published. Currently hardcoded false means the first publish saves a draft record —
    // visitors get 404 even though the editor UI shows "Live".
    published: false,
    createdAt: new Date().toISOString(),
  }

  await createSite(site)
  return NextResponse.json({ site }, { status: 201 })
}

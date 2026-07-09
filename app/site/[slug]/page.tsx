import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteBySlug } from '@/lib/dynamo/sites'
import { getImagesBySite } from '@/lib/dynamo/images'
import { normalizeSite } from '@/lib/legacyAdapter'
import TemplateRenderer from '@/templates'
import PageViewTracker from '@/components/site/PageViewTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getSiteBySlug(slug)
  if (!site) return {}

  const title = `${site.businessName} — ${site.category}${site.city ? ` in ${site.city}` : ''}`
  const description =
    site.description || `${site.businessName} — ${site.category} in ${site.city}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    other: {
      'og:locale': 'en_US',
    },
  }
}

function buildJsonLd(site: Awaited<ReturnType<typeof getSiteBySlug>>) {
  if (!site) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.businessName,
    description: site.description,
    telephone: site.phone,
    email: site.email,
    address: site.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressLocality: site.city,
        }
      : undefined,
    hasOfferCatalog: site.sections?.length ? {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: site.sections.flatMap(sec =>
        sec.type === 'list' ? sec.items.filter(Boolean).map((item, i) => ({
          '@type': 'Offer',
          position: i + 1,
          name: item,
        })) : []
      ),
    } : undefined,
  }
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params
  const site = await getSiteBySlug(slug)

  if (!site) notFound()

  const imageRecords = await getImagesBySite(site.id)
  const images = imageRecords.map((img) => img.url)

  const normalized = normalizeSite(site)

  const jsonLd = buildJsonLd(site)

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PageViewTracker siteId={site.id} />
      <TemplateRenderer site={normalized} images={images} />
    </>
  )
}

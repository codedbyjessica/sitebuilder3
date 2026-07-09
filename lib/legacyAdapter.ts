// TEMPORARY bridge between the legacy flat shape (BusinessData / localStorage drafts)
// and the canonical Site model in ./schema. Delete this file once every consumer
// (editor, templates, DDB layer) speaks Site natively (migration Phase 4).
//
//   normalizeSite(raw)          legacy flat OR current Site  -> canonical Site  (hydration/migration)
//   siteToBusinessData(site)    canonical Site               -> flat DDB record (publish path)

import type { BusinessData, TemplateData, SiteSection } from './types'
import {
  CURRENT_SCHEMA_VERSION,
  homePage,
  type Site,
  type Page,
  type Block,
  type HeroBlock,
  type ContactBlock,
  type RichTextBlock,
  type ListBlock,
} from './schema'

// Deterministic so re-migrating the same legacy draft yields STABLE ids.
// Unstable ids would break React keys and `#section-<id>` nav anchors on every load.
function derivedId(siteId: string, suffix: string): string {
  return `${siteId || 'site'}-${suffix}`
}

/** Accepts a legacy flat draft/record or an already-current Site; always returns a Site. */
export function normalizeSite(raw: unknown): Site {
  const d = (raw ?? {}) as Record<string, unknown>
  if (d.schemaVersion === CURRENT_SCHEMA_VERSION && Array.isArray(d.pages)) {
    return d as unknown as Site
  }
  return migrateV0(d as Partial<BusinessData>)
}

function migrateV0(d: Partial<BusinessData>): Site {
  const id = d.id || 'site'
  const legacySections: SiteSection[] = Array.isArray(d.sections) ? d.sections : []
  const blocks: Block[] = []

  // Hero always exists (businessName has always doubled as the hero heading).
  // CTA / title defaults live here so every entry point hydrates identically
  // (previously duplicated in the editor's applyDefaults and the preview mapper).
  blocks.push({
    id: derivedId(id, 'hero'),
    type: 'hero',
    heading: d.businessName || '',
    subheading: d.description || '',
    eyebrow: d.category || '',
    image: d.heroImage || undefined,
    ctas: Array.isArray(d.heroCtas) ? d.heroCtas : [{ label: 'Get started', href: '#contact' }],
  })

  for (const s of legacySections) {
    const shared = {
      id: s.id,
      navTitle: s.navTitle,
      hideFromNav: s.hideFromNav,
      subtitle: s.subtitle,
      photo: s.photo,
      photoLayout: s.photoLayout,
    }
    if (s.type === 'list') {
      blocks.push({ ...shared, type: 'list', title: s.title, items: s.items ?? [] })
    } else {
      blocks.push({
        ...shared,
        type: 'richtext',
        title: s.title,
        body: (s.items ?? []).join('\n\n'),
      })
    }
  }

  // Contact was hideable — a hidden contact simply becomes "no contact block".
  if (!d.hideContact) {
    const hasHours = !!d.hours && Object.keys(d.hours).length > 0
    blocks.push({
      id: derivedId(id, 'contact'),
      type: 'contact',
      title: d.contactTitle !== undefined ? d.contactTitle : 'Contact us',
      phone: d.phone || undefined,
      email: d.email || undefined,
      address: d.address || undefined,
      city: d.city || undefined,
      hours: hasHours ? d.hours : undefined,
      showForm: !d.hideContactForm,
    })
  }

  const home: Page = {
    id: derivedId(id, 'page-home'),
    slug: '',
    title: 'Home',
    isHome: true,
    blocks,
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id,
    userId: d.userId || '',
    slug: d.slug || '',
    businessName: d.businessName || '',
    category: d.category || undefined,
    description: d.description || undefined,
    layout: d.layout || 'minimal',
    themeId: d.template || 'cloud', // legacy field was `template`
    fontId: d.fontId || 'classic',
    nav: { ctas: Array.isArray(d.navCtas) ? d.navCtas : [{ label: 'Book now →', href: '#contact' }] },
    footer: { copy: d.footerCopy || undefined },
    pages: [home],
    published: !!d.published,
    createdAt: d.createdAt || new Date().toISOString(),
    updatedAt: d.updatedAt,
  }
}

function blockToSection(b: RichTextBlock | ListBlock): SiteSection {
  const shared = {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    navTitle: b.navTitle,
    hideFromNav: b.hideFromNav,
    photo: b.photo,
    photoLayout: b.photoLayout,
  }
  return b.type === 'list'
    ? { ...shared, type: 'list', items: b.items }
    : { ...shared, type: 'paragraph', items: b.body ? b.body.split('\n\n') : [] }
}

/**
 * Flattens a Site back into the legacy BusinessData record shape the API/DDB layer still
 * expects on the write path. Used by publish until the backend is migrated to store Site.
 */
export function siteToBusinessData(site: Site): BusinessData {
  const td = siteToTemplateData(site)
  return {
    id: site.id,
    userId: site.userId,
    slug: site.slug,
    businessName: site.businessName,
    category: td.category,
    description: td.description,
    phone: td.phone,
    email: td.email,
    address: td.address,
    city: td.city,
    layout: site.layout,
    fontId: site.fontId,
    navCtas: td.navCtas,
    heroCtas: td.heroCtas,
    heroImage: td.heroImage,
    contactTitle: td.contactTitle,
    hideContact: td.hideContact,
    hideContactForm: td.hideContactForm,
    footerCopy: td.footerCopy,
    sections: td.sections,
    hours: td.hours,
    template: site.themeId,
    published: site.published,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  }
}

/**
 * Flattens one page of a Site into the legacy TemplateData shape. Now internal-only — the
 * templates render from Site directly (Phase 4). Kept solely so siteToBusinessData can reuse
 * the field-flattening logic for the publish path until the backend also moves to Site.
 */
function siteToTemplateData(site: Site, page: Page = homePage(site)): TemplateData {
  const hero = page.blocks.find((b): b is HeroBlock => b.type === 'hero')
  const contact = page.blocks.find((b): b is ContactBlock => b.type === 'contact')
  const sections = page.blocks
    .filter((b): b is RichTextBlock | ListBlock => b.type === 'richtext' || b.type === 'list')
    .map(blockToSection)

  return {
    // Templates render a single title (nav brand + hero H1). The hero block's heading is the
    // display title and overrides the site identity; falls back to businessName.
    // TODO(phase4): when templates become block renderers, render hero.heading in the hero and
    // site.businessName in the nav/SEO separately instead of collapsing them here.
    businessName: hero?.heading?.trim() || site.businessName,
    category: hero?.eyebrow ?? site.category ?? '',
    description: hero?.subheading ?? site.description ?? '',
    phone: contact?.phone ?? '',
    email: contact?.email ?? '',
    address: contact?.address ?? '',
    city: contact?.city ?? '',
    layout: site.layout,
    fontId: site.fontId,
    navCtas: site.nav.ctas,
    heroCtas: hero?.ctas ?? [],
    heroImage: hero?.image ?? '',
    contactTitle: contact?.title ?? 'Contact',
    hideContact: !contact,
    hideContactForm: contact ? !contact.showForm : true,
    footerCopy: site.footer.copy,
    sections,
    hours: contact?.hours ?? {},
    images: [],
    slug: site.slug,
  }
}

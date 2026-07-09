// Canonical site data model (v1).
//
// Design invariants (do not break):
//  - LAYOUT-AGNOSTIC: every layout renders the SAME Site. A layout switch may only
//    change presentation (theme/font/layout tokens), never which data is required.
//  - BLOCK-BASED: page content is an ordered list of typed blocks. Hero and Contact
//    are blocks, not privileged fields, so they can be reordered/removed like any other.
//  - MULTI-PAGE: a Site owns one or more Pages. A single-page site is just one Page.
//  - Every block type MUST be renderable by every layout before it ships.
//  - Persisted data holds image REFERENCES (S3 key/URL), never base64 binary.

import type { LayoutId, ThemeId, FontId, CtaLink, SiteHours } from './types'

export const CURRENT_SCHEMA_VERSION = 1

// ---- Blocks -----------------------------------------------------------------

export interface BlockBase {
  id: string
  navTitle?: string // label shown in nav; falls back to the block's own title
  hideFromNav?: boolean
}

export interface HeroBlock extends BlockBase {
  type: 'hero'
  heading?: string // defaults to Site.businessName when empty
  subheading?: string
  eyebrow?: string
  image?: string // S3 key or URL — never base64 in persisted data
  ctas: CtaLink[]
}

export interface RichTextBlock extends BlockBase {
  type: 'richtext' // was SiteSection type 'paragraph'
  title: string
  subtitle?: string
  body: string
  photo?: string
  photoLayout?: 'stacked-below' | 'stacked-above' | 'side-left' | 'side-right'
}

export interface ListBlock extends BlockBase {
  type: 'list' // was SiteSection type 'list'
  title: string
  subtitle?: string
  items: string[]
  photo?: string
  photoLayout?: 'stacked-below' | 'stacked-above' | 'side-left' | 'side-right'
}

export interface ContactBlock extends BlockBase {
  type: 'contact'
  title: string
  phone?: string
  email?: string
  address?: string
  city?: string
  hours?: SiteHours
  showForm: boolean
}

export type Block = HeroBlock | RichTextBlock | ListBlock | ContactBlock
export type BlockType = Block['type']

const BLOCK_TYPES: readonly BlockType[] = ['hero', 'richtext', 'list', 'contact']

export function isBlockType(t: string): t is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(t)
}

// ---- Page & Site ------------------------------------------------------------

export interface Page {
  id: string
  slug: string // '' for the home page, e.g. 'about' otherwise
  title: string
  isHome?: boolean
  blocks: Block[]
}

export interface Site {
  schemaVersion: number

  id: string
  userId: string
  slug: string // the site's subdomain (my-site.sitelit.ca)

  // identity / SEO — not page content
  businessName: string
  category?: string
  description?: string

  // presentation — the ONLY things a layout switch changes
  layout: LayoutId
  themeId: ThemeId
  fontId: FontId

  // site chrome (rendered on every page)
  nav: { ctas: CtaLink[] }
  footer: { copy?: string }

  // content
  pages: Page[]

  // lifecycle
  published: boolean
  createdAt: string
  updatedAt?: string
  rev?: number // reserved for optimistic concurrency once the backend lands
}

export function homePage(site: Site): Page {
  return site.pages.find((p) => p.isHome) ?? site.pages[0]
}

export function pageBySlug(site: Site, slug: string): Page | undefined {
  return site.pages.find((p) => p.slug === slug)
}

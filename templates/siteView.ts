// Derives the presentation pieces a template needs from a canonical Site's home page.
// Every layout renders these SAME pieces in its own markup — this is the shared data
// contract that keeps layouts interchangeable (layout-agnostic invariant).

import { THEMES, FONT_PAIRS, type ColorTheme, type FontPair, type FontId, type CtaLink } from '@/lib/types'
import {
  homePage,
  type Site,
  type HeroBlock,
  type ContactBlock,
  type ListBlock,
  type RichTextBlock,
} from '@/lib/schema'

export type ContentBlock = ListBlock | RichTextBlock

export interface SiteView {
  t: ColorTheme
  f: FontPair
  title: string
  category?: string
  description?: string
  heroImage?: string
  heroCtas: CtaLink[]
  navCtas: CtaLink[]
  contact?: ContactBlock
  hideContact: boolean
  hideContactForm: boolean
  contentBlocks: ContentBlock[]
  navSections: { id: string; title: string; navTitle?: string; hideFromNav?: boolean }[]
  footerCopy?: string
}

export function siteView(site: Site): SiteView {
  const t = THEMES[site.themeId] || THEMES.cloud
  const f = FONT_PAIRS[(site.fontId as FontId) || 'classic'] || FONT_PAIRS.classic
  const page = homePage(site)

  const hero = page.blocks.find((b): b is HeroBlock => b.type === 'hero')
  const contact = page.blocks.find((b): b is ContactBlock => b.type === 'contact')
  const contentBlocks = page.blocks.filter(
    (b): b is ContentBlock => (b.type === 'list' || b.type === 'richtext') && b.title.trim().length > 0
  )

  return {
    t,
    f,
    title: hero?.heading?.trim() || site.businessName,
    category: hero?.eyebrow || undefined,
    description: hero?.subheading || undefined,
    heroImage: hero?.image || undefined,
    heroCtas: hero?.ctas || [],
    navCtas: site.nav.ctas || [],
    contact,
    hideContact: !contact,
    hideContactForm: contact ? !contact.showForm : true,
    contentBlocks,
    navSections: contentBlocks.map((b) => ({
      id: b.id,
      title: b.title,
      navTitle: b.navTitle,
      hideFromNav: b.hideFromNav,
    })),
    footerCopy: site.footer.copy || undefined,
  }
}

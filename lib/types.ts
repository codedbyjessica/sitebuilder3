export type ThemeId = 'cloud' | 'ocean' | 'evergreen' | 'sage' | 'bloom' | 'poppy' | 'dusk' | 'ember' | 'midnight'
export type TemplateId = ThemeId

export type FontId = 'classic' | 'organic' | 'avant' | 'gentle' | 'refined' | 'modern'

export interface FontPair {
  id: FontId
  name: string
  description: string
  headingFamily: string
  bodyFamily: string
  googleUrl: string
}

export const FONT_PAIRS: Record<FontId, FontPair> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Playfair Display + Inter',
    headingFamily: "'Playfair Display', Georgia, serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap",
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    description: 'DM Serif Display + DM Sans',
    headingFamily: "'DM Serif Display', Georgia, serif",
    bodyFamily: "'DM Sans', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Serif+Display:ital@0;1&display=swap",
  },
  avant: {
    id: 'avant',
    name: 'Avant',
    description: 'Fraunces + Plus Jakarta Sans',
    headingFamily: "'Fraunces', Georgia, serif",
    bodyFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,600&display=swap",
  },
  gentle: {
    id: 'gentle',
    name: 'Gentle',
    description: 'Lora + Karla',
    headingFamily: "'Lora', Georgia, serif",
    bodyFamily: "'Karla', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,400;0,500;0,700;1,400&family=Lora:ital,wght@0,500;0,600;0,700;1,500&display=swap",
  },
  refined: {
    id: 'refined',
    name: 'Refined',
    description: 'Cormorant Garamond + Outfit',
    headingFamily: "'Cormorant Garamond', Georgia, serif",
    bodyFamily: "'Outfit', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap",
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Space Grotesk + Inter',
    headingFamily: "'Space Grotesk', system-ui, sans-serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    googleUrl: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap",
  },
}

export const FONT_LIST: FontPair[] = Object.values(FONT_PAIRS)

export type LayoutId = 'minimal' | 'bold' | 'folio' | 'serene' | 'studio' | 'harvest'

export interface LayoutDefinition {
  id: LayoutId
  name: string
  description: string
}

export const LAYOUTS: Record<LayoutId, LayoutDefinition> = {
  minimal: { id: 'minimal', name: 'Minimal', description: 'Clean and editorial' },
  bold: { id: 'bold', name: 'Bold', description: 'High-impact colour hero' },
  folio: { id: 'folio', name: 'Folio', description: 'Bookish typography' },
  serene: { id: 'serene', name: 'Serene', description: 'Calm and centered' },
  studio: { id: 'studio', name: 'Studio', description: 'Sidebar profile' },
  harvest: { id: 'harvest', name: 'Harvest', description: 'Warm rounded cards' },
}

export const LAYOUT_LIST: LayoutDefinition[] = Object.values(LAYOUTS)

export interface SiteSection {
  id: string
  title: string
  subtitle?: string
  navTitle?: string
  hideFromNav?: boolean
  type: 'list' | 'paragraph'
  items: string[]
  photo?: string
  photoLayout?: 'stacked' | 'side'
}

export interface SiteHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface CtaLink {
  label: string
  href: string
}

export interface BusinessData {
  id: string
  userId: string
  slug: string
  businessName: string
  category: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  layout?: LayoutId
  fontId?: FontId
  navCtas?: CtaLink[]
  heroCtas?: CtaLink[]
  heroImage?: string
  contactTitle?: string
  hideContact?: boolean
  hideContactForm?: boolean
  footerCopy?: string
  sections: SiteSection[]
  hours: SiteHours
  template: TemplateId
  published: boolean
  createdAt: string
  updatedAt?: string
}

export interface ImageRecord {
  id: string
  siteId: string
  url: string
  key: string
  createdAt: string
}

export interface ContactSubmission {
  id: string
  siteId: string
  name: string
  email: string
  message: string
  createdAt: string
}

export interface DomainRecord {
  domain: string
  siteId: string
  verified: boolean
  createdAt: string
}

export interface TemplateData {
  businessName: string
  category: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  layout?: LayoutId
  fontId?: FontId
  navCtas?: CtaLink[]
  heroCtas?: CtaLink[]
  heroImage?: string
  contactTitle?: string
  hideContact?: boolean
  hideContactForm?: boolean
  footerCopy?: string
  sections: SiteSection[]
  hours: SiteHours
  images: string[]
  slug: string
}

export interface ColorTheme {
  id: ThemeId
  name: string
  primary: string
  primaryLight: string
  secondary: string
  secondaryLight: string
  bg: string
  text: string
  textMuted: string
  border: string
  heroOverlay: string
  isDark?: boolean
}

export const THEMES: Record<ThemeId, ColorTheme> = {
  cloud: {
    id: 'cloud',
    name: 'Cloud',
    primary: '#18181b',
    primaryLight: '#f4f4f5',
    secondary: '#6366f1',
    secondaryLight: '#eef2ff',
    bg: '#ffffff',
    text: '#09090b',
    textMuted: '#71717a',
    border: '#e4e4e7',
    heroOverlay: 'rgba(9,9,11,0.55)',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0369a1',
    primaryLight: '#e3f1f8',
    secondary: '#0d9488',
    secondaryLight: '#d7f2ee',
    bg: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    heroOverlay: 'rgba(2,50,90,0.65)',
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    primary: '#45705c',
    primaryLight: '#ecf2ee',
    secondary: '#b08968',
    secondaryLight: '#f5ece2',
    bg: '#f8faf8',
    text: '#22302a',
    textMuted: '#66756d',
    border: '#e2e9e4',
    heroOverlay: 'rgba(20,45,30,0.62)',
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom',
    primary: '#c2185b',
    primaryLight: '#fce4ec',
    secondary: '#7b61d4',
    secondaryLight: '#ede8fc',
    bg: '#fffafc',
    text: '#2d1422',
    textMuted: '#8a6272',
    border: '#f5d6e5',
    heroOverlay: 'rgba(90,5,45,0.65)',
  },
  poppy: {
    id: 'poppy',
    name: 'Poppy',
    primary: '#e11d48',
    primaryLight: '#fdecef',
    secondary: '#0891b2',
    secondaryLight: '#daf3f8',
    bg: '#fffcfb',
    text: '#3b1f2b',
    textMuted: '#87707c',
    border: '#f6dfe4',
    heroOverlay: 'rgba(110,5,25,0.65)',
  },
  dusk: {
    id: 'dusk',
    name: 'Dusk',
    primary: '#7c3aed',
    primaryLight: '#f2eefc',
    secondary: '#db2777',
    secondaryLight: '#fbe7f0',
    bg: '#fefefe',
    text: '#221e50',
    textMuted: '#6f6b93',
    border: '#e9e4f6',
    heroOverlay: 'rgba(50,10,140,0.70)',
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    primary: '#c2410c',
    primaryLight: '#f9ede1',
    secondary: '#4d7c0f',
    secondaryLight: '#ecf3d9',
    bg: '#fffdf9',
    text: '#431407',
    textMuted: '#7d7268',
    border: '#f2e4d4',
    heroOverlay: 'rgba(80,20,5,0.68)',
  },
  evergreen: {
    id: 'evergreen',
    name: 'Evergreen',
    primary: '#059669',
    primaryLight: '#15231c',
    secondary: '#d4a24c',
    secondaryLight: '#2b2312',
    bg: '#223c31',
    text: '#edf4ee',
    textMuted: '#8fa397',
    border: '#223029',
    heroOverlay: 'rgba(5,35,18,0.72)',
    isDark: true,
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366f1',
    primaryLight: '#1c1a40',
    secondary: '#a78bfa',
    secondaryLight: '#2e1065',
    bg: '#0a0a0a',
    text: '#f4f4f5',
    textMuted: '#a1a1aa',
    border: '#26262b',
    heroOverlay: 'rgba(5,5,28,0.78)',
    isDark: true,
  },
}

export const THEME_LIST: ColorTheme[] = Object.values(THEMES)

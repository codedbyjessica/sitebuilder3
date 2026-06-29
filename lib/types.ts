export type TemplateId = 'modern' | 'minimal' | 'bold' | 'elegant' | 'friendly' | 'classic'

export interface SiteHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
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
  services: string[]
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
  services: string[]
  hours: SiteHours
  images: string[]
  slug: string
}

export interface TemplateDefinition {
  id: TemplateId
  name: string
  description: string
  previewColor: string
  accentColor: string
  thumbnail: string
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines, bold typography, dark accents',
    previewColor: '#0f172a',
    accentColor: '#6366f1',
    thumbnail: '/templates/modern-preview.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'White space, subtle tones, refined feel',
    previewColor: '#fafafa',
    accentColor: '#374151',
    thumbnail: '/templates/minimal-preview.png',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant colors, strong contrast, high energy',
    previewColor: '#1e1b4b',
    accentColor: '#f59e0b',
    thumbnail: '/templates/bold-preview.png',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Serif fonts, gold accents, luxury aesthetic',
    previewColor: '#1c1917',
    accentColor: '#d4af37',
    thumbnail: '/templates/elegant-preview.png',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm colors, rounded shapes, approachable',
    previewColor: '#fef3c7',
    accentColor: '#f97316',
    thumbnail: '/templates/friendly-preview.png',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout, navy blue, timeless',
    previewColor: '#1e3a5f',
    accentColor: '#c8a96e',
    thumbnail: '/templates/classic-preview.png',
  },
]

import type { ComponentType } from 'react'
import type { LayoutId } from '@/lib/types'
import type { Site } from '@/lib/schema'
import type { TemplateProps } from './types'
import MinimalTemplate from './minimal'
import BoldTemplate from './bold'
import FolioTemplate from './folio'
import SereneTemplate from './serene'
import StudioTemplate from './studio'
import HarvestTemplate from './harvest'

const LAYOUT_MAP: Record<LayoutId, ComponentType<TemplateProps>> = {
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  folio: FolioTemplate,
  serene: SereneTemplate,
  studio: StudioTemplate,
  harvest: HarvestTemplate,
}

interface TemplateRendererProps {
  site: Site
  images?: string[]
  preview?: boolean
}

export default function TemplateRenderer({ site, images, preview }: TemplateRendererProps) {
  const Layout = LAYOUT_MAP[site.layout] || MinimalTemplate
  return <Layout site={site} images={images} preview={preview} />
}

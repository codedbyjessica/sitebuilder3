import type { Site } from '@/lib/schema'

export type TemplateProps = {
  // All templates render directly from the canonical Site (block-based).
  site: Site
  images?: string[]
  preview?: boolean
}

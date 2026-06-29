import type { TemplateId, TemplateData } from '@/lib/types'
import ModernTemplate from './modern'
import MinimalTemplate from './minimal'
import BoldTemplate from './bold'
import ElegantTemplate from './elegant'
import FriendlyTemplate from './friendly'
import ClassicTemplate from './classic'

interface TemplateRendererProps {
  template: TemplateId
  data: TemplateData
  preview?: boolean
}

export default function TemplateRenderer({ template, data, preview }: TemplateRendererProps) {
  const props = { data, preview }

  switch (template) {
    case 'modern':
      return <ModernTemplate {...props} />
    case 'minimal':
      return <MinimalTemplate {...props} />
    case 'bold':
      return <BoldTemplate {...props} />
    case 'elegant':
      return <ElegantTemplate {...props} />
    case 'friendly':
      return <FriendlyTemplate {...props} />
    case 'classic':
      return <ClassicTemplate {...props} />
    default:
      return <ModernTemplate {...props} />
  }
}

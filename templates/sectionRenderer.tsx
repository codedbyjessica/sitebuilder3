import Image from 'next/image'
import type { SiteSection } from '@/lib/types'

interface SectionRendererProps {
  section: SiteSection
  content: React.ReactNode
  stackedPhotoSizes: string
  sidePhotoSizes: string
}

export function renderSectionWithPhoto({
  section,
  content,
  stackedPhotoSizes,
  sidePhotoSizes,
}: SectionRendererProps) {
  const photoLayout = section.photoLayout || 'stacked-below'
  const isSideLayout = photoLayout.startsWith('side-')
  const isPhotoAbove = photoLayout === 'stacked-above'
  const isPhotoLeft = photoLayout === 'side-left'

  if (!section.photo) {
    return content
  }

  if (!isSideLayout) {
    // Stacked layouts
    return (
      <>
        {isPhotoAbove && (
          <div className="relative h-64 rounded-xl overflow-hidden my-4">
            <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={stackedPhotoSizes} />
          </div>
        )}
        {content}
        {!isPhotoAbove && (
          <div className="relative h-64 rounded-xl overflow-hidden my-4">
            <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={stackedPhotoSizes} />
          </div>
        )}
      </>
    )
  }

  // Side-by-side layouts
  return (
    <div className="flex gap-8 items-start mt-4">
      {isPhotoLeft && (
        <div className="relative w-56 h-56 rounded-xl overflow-hidden shrink-0">
          <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={sidePhotoSizes} />
        </div>
      )}
      <div className="flex-1">{content}</div>
      {!isPhotoLeft && (
        <div className="relative w-56 h-56 rounded-xl overflow-hidden shrink-0">
          <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={sidePhotoSizes} />
        </div>
      )}
    </div>
  )
}

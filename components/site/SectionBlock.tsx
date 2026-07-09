import Image from 'next/image'
import type { SiteSection } from '@/lib/types'

interface Props {
  section: SiteSection
  titleClass: string
  subtitleClass: string
  textClass: string
  listItemClass: string
  accentClass?: string
  photoContainerClass?: string
  photoClass?: string
}

export default function SectionBlock({
  section,
  titleClass,
  subtitleClass,
  textClass,
  listItemClass,
  accentClass,
  photoContainerClass = 'relative h-64 rounded-xl overflow-hidden my-4',
  photoClass = '900px',
}: Props) {
  const hasContent =
    section.type === 'paragraph'
      ? !!section.items[0]?.trim()
      : section.items.some((i) => i.trim())

  if (!section.title.trim() && !hasContent) return null

  const photoLayout = section.photoLayout || 'stacked-below'
  const isSideLayout = photoLayout.startsWith('side-')
  const isPhotoAbove = photoLayout === 'stacked-above'
  const isPhotoLeft = photoLayout === 'side-left'

  const content = (
    <>
      {section.title && <h3 className={titleClass}>{section.title}</h3>}
      {section.subtitle && <p className={subtitleClass}>{section.subtitle}</p>}
      {section.type === 'paragraph' ? (
        <p className={textClass}>{section.items[0]}</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {section.items.filter((i) => i.trim()).map((item, idx) => (
            <li key={idx} className={`flex items-start gap-2 ${listItemClass}`}>
              {accentClass && <span className={`mt-1 text-xs ${accentClass}`}>&#10003;</span>}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )

  if (!section.photo) return content

  // Stacked layouts (above or below)
  if (!isSideLayout) {
    return (
      <div>
        {isPhotoAbove && (
          <div className={photoContainerClass}>
            <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={photoClass} />
          </div>
        )}
        {content}
        {!isPhotoAbove && (
          <div className={photoContainerClass}>
            <Image src={section.photo} alt={section.title} fill className="object-cover" sizes={photoClass} />
          </div>
        )}
      </div>
    )
  }

  // Side-by-side layouts (left or right)
  return (
    <div className="flex gap-8 items-start mt-4">
      {isPhotoLeft && (
        <div className="relative w-56 h-56 rounded-xl overflow-hidden shrink-0">
          <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="224px" />
        </div>
      )}
      <div className="flex-1">{content}</div>
      {!isPhotoLeft && (
        <div className="relative w-56 h-56 rounded-xl overflow-hidden shrink-0">
          <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="224px" />
        </div>
      )}
    </div>
  )
}

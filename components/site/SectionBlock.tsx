import type { SiteSection } from '@/lib/types'

interface Props {
  section: SiteSection
  titleClass: string
  subtitleClass: string
  textClass: string
  listItemClass: string
  accentClass?: string
}

export default function SectionBlock({ section, titleClass, subtitleClass, textClass, listItemClass, accentClass }: Props) {
  const hasContent =
    section.type === 'paragraph'
      ? !!section.items[0]?.trim()
      : section.items.some((i) => i.trim())

  if (!section.title.trim() && !hasContent) return null

  return (
    <div>
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
    </div>
  )
}

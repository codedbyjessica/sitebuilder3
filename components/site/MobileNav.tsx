'use client'

import { useState } from 'react'
import type { ColorTheme, FontPair, CtaLink } from '@/lib/types'

// Only the nav-relevant fields — satisfied by both legacy SiteSection[] and canonical content blocks.
type NavItem = { id: string; title: string; navTitle?: string; hideFromNav?: boolean }

interface MobileNavProps {
  businessName: string
  sections: NavItem[]
  navCtas: CtaLink[]
  hideContact?: boolean
  t: ColorTheme
  f: FontPair
  /** For Bold template — inverted (white text on primary bg) */
  inverted?: boolean
}

export default function MobileNav({ businessName, sections, navCtas, hideContact, t, f, inverted }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const fg = inverted ? '#fff' : t.text
  const fgMuted = inverted ? 'rgba(255,255,255,0.75)' : t.textMuted
  const bg = inverted ? t.primary : t.bg
  const borderColor = inverted ? 'rgba(255,255,255,0.15)' : t.border

  const visibleSections = (sections || []).filter(s => s.title.trim() && !s.hideFromNav)

  function close() { setOpen(false) }

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(o => !o)}
        style={{ color: fg }}
        className="flex flex-col justify-center items-center w-9 h-9 gap-[5px] shrink-0"
      >
        <span
          style={{ backgroundColor: fg }}
          className={`block h-0.5 w-5 rounded-full transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
        />
        <span
          style={{ backgroundColor: fg }}
          className={`block h-0.5 w-5 rounded-full transition-all duration-200 ${open ? 'opacity-0' : ''}`}
        />
        <span
          style={{ backgroundColor: fg }}
          className={`block h-0.5 w-5 rounded-full transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
        />
      </button>

      {/* Drawer */}
      {open && (
        <div
          style={{ backgroundColor: bg, borderTopColor: borderColor }}
          className="absolute left-0 right-0 top-full border-t z-50 shadow-lg"
        >
          <nav className="px-6 py-5 flex flex-col gap-5">
            {visibleSections.map(s => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                style={{ color: fgMuted }}
                className="text-base"
                onClick={close}
              >
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && (
              <a href="#contact" style={{ color: fgMuted }} className="text-base" onClick={close}>
                Contact
              </a>
            )}
            <div style={{ borderTopColor: borderColor }} className="border-t pt-4 flex flex-col gap-3">
              {(navCtas && navCtas.length > 0) ? navCtas.map((cta, i) => (
                <a
                  key={i}
                  href={cta.href}
                  style={i === 0
                    ? { backgroundColor: t.primary, color: '#fff' }
                    : { color: t.primary }}
                  className={`text-sm font-medium text-center px-5 py-2.5 rounded-full ${i > 0 ? 'underline underline-offset-4' : ''}`}
                  onClick={close}
                >
                  {cta.label}
                </a>
              )) : (
                <a
                  href="#contact"
                  style={{ backgroundColor: t.primary, color: '#fff' }}
                  className="text-sm font-medium text-center px-5 py-2.5 rounded-full"
                  onClick={close}
                >
                  Book now
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

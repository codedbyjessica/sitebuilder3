'use client'

import type { CtaLink } from '@/lib/types'

function ctaIsExternal(href: string) {
  return !href.startsWith('#')
}

interface CtaEditorProps {
  value: CtaLink[]
  onChange: (v: CtaLink[]) => void
  anchors: { href: string; label: string }[]
  noun?: string
}

export default function CtaEditor({ value, onChange, anchors, noun = 'button' }: CtaEditorProps) {
  function add() {
    if (value.length >= 2) return
    onChange([...value, { label: '', href: anchors[0]?.href || '#contact' }])
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }
  function patch(i: number, changes: Partial<CtaLink>) {
    onChange(value.map((c, idx) => (idx === i ? { ...c, ...changes } : c)))
  }

  return (
    <div className="space-y-3">
      {value.map((cta, i) => {
        const isExternal = ctaIsExternal(cta.href)
        const selectVal = isExternal ? '__external__' : cta.href
        return (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-ink/40 mb-1">Button text</p>
                  <input
                    type="text"
                    value={cta.label}
                    onChange={(e) => patch(i, { label: e.target.value })}
                    className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maple focus:border-transparent"
                  />
                </div>
                <div>
                  <p className="text-xs text-ink/40 mb-1">Button link</p>
                  <select
                    value={selectVal}
                    onChange={(e) => {
                      const v = e.target.value
                      patch(i, { href: v === '__external__' ? 'https://' : v })
                    }}
                    className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maple"
                  >
                    {anchors.map((a) => (
                      <option key={a.href} value={a.href}>
                        {a.label}
                      </option>
                    ))}
                    <option value="__external__">External link…</option>
                  </select>
                </div>
              </div>
              {isExternal && (
                <input
                  type="url"
                  value={cta.href}
                  onChange={(e) => patch(i, { href: e.target.value })}
                  placeholder="https://"
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maple focus:border-transparent"
                />
              )}
            </div>
            <button
              onClick={() => remove(i)}
              className="mt-2.5 text-ink/25 hover:text-ink/50 transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        )
      })}
      {value.length < 2 && (
        <button onClick={add} className="text-sm text-maple hover:text-maple-deep font-medium">
          + Add {noun}
        </button>
      )}
    </div>
  )
}

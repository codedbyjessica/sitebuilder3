'use client'

import { THEME_LIST, LAYOUT_LIST, FONT_LIST, THEMES, type TemplateId, type LayoutId, type FontId, type ColorTheme } from '@/lib/types'
import { cn } from '@/lib/utils'

const ALL_PREVIEW_FONTS_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&family=DM+Sans:wght@400;700&family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;700&family=Fraunces:opsz,wght@9..144,700&family=Karla:wght@400;700&family=Lora:wght@700&family=Outfit:wght@400;700&family=Cormorant+Garamond:wght@700&family=Space+Grotesk:wght@700&display=swap"

interface TemplateSelectorProps {
  layout: LayoutId
  theme: TemplateId
  font: FontId
  onLayoutChange: (id: LayoutId) => void
  onThemeChange: (id: TemplateId) => void
  onFontChange: (id: FontId) => void
}

function LayoutWireframe({ id, t }: { id: LayoutId; t: ColorTheme }) {
  const bar = <div style={{ backgroundColor: t.border }} className="h-px w-full mb-1.5" />
  const dot = (w: string) => <div style={{ backgroundColor: t.textMuted }} className={`h-1 ${w} rounded-sm`} />
  const rule = (accent: string) => (
    <div className="flex items-center gap-1 w-full">
      <div style={{ backgroundColor: t.border }} className="h-px flex-1" />
      <div style={{ backgroundColor: accent }} className="h-1 w-4 rounded-sm shrink-0" />
      <div style={{ backgroundColor: t.border }} className="h-px flex-1" />
    </div>
  )

  if (id === 'minimal') return (
    <div className="p-2 flex flex-col gap-1">
      {bar}
      <div className="flex items-center gap-1 mb-1">{dot('w-10')}{dot('w-5')}</div>
      {dot('w-8')}{dot('w-16')}{dot('w-12')}
      <div className="flex flex-col gap-0.5 mt-1">{dot('w-full')}{dot('w-full')}{dot('w-3/4')}</div>
    </div>
  )
  if (id === 'bold') return (
    <div className="flex flex-col h-full">
      <div style={{ backgroundColor: t.primary }} className="h-14 p-1.5 flex flex-col">
        <div className="flex justify-between items-center">
          <div style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} className="h-1 w-5 rounded-sm" />
          <div style={{ backgroundColor: '#fff' }} className="h-2 w-5 rounded-full" />
        </div>
        <div className="mt-auto flex flex-col gap-0.5">
          <div style={{ backgroundColor: '#fff' }} className="h-2 w-16 rounded-sm" />
          <div style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} className="h-1 w-10 rounded-sm" />
        </div>
      </div>
      <div className="p-1.5 flex flex-col gap-1 flex-1">
        <div style={{ backgroundColor: t.text }} className="h-0.5 w-full" />
        <div className="flex items-center gap-1">{dot('w-3')}{dot('w-10')}</div>
        <div className="grid grid-cols-2 gap-1">
          <div style={{ borderColor: t.border }} className="border rounded-sm h-3" />
          <div style={{ borderColor: t.border }} className="border rounded-sm h-3" />
        </div>
      </div>
      <div style={{ backgroundColor: t.primary }} className="h-4" />
    </div>
  )
  if (id === 'serene') return (
    <div className="p-2 flex flex-col items-center gap-1">
      {dot('w-8')}
      <div className="flex gap-1.5">{dot('w-4')}{dot('w-4')}{dot('w-4')}</div>
      <div className="flex flex-col items-center gap-0.5 mt-1.5">{dot('w-14')}{dot('w-10')}</div>
      <div style={{ backgroundColor: t.primary }} className="h-1.5 w-6 rounded-full mt-0.5" />
      <div style={{ backgroundColor: t.primaryLight }} className="w-full h-6 rounded-lg mt-1.5" />
    </div>
  )
  if (id === 'studio') return (
    <div className="flex h-full">
      <div style={{ borderRightColor: t.border }} className="w-1/4 border-r p-1.5 flex flex-col gap-1">
        {dot('w-8')}{dot('w-5')}
        <div className="mt-1 flex flex-col gap-0.5">{dot('w-6')}{dot('w-6')}{dot('w-6')}</div>
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1">
        {dot('w-14')}{dot('w-10')}
        <div className="flex flex-col gap-0.5 mt-1">{dot('w-full')}{dot('w-3/4')}</div>
        <div style={{ backgroundColor: t.primary }} className="h-1.5 w-6 rounded-full mt-0.5" />
      </div>
    </div>
  )
  if (id === 'harvest') return (
    <div className="p-1.5 flex flex-col gap-1">
      <div className="flex items-center justify-between px-0.5">{dot('w-6')}{dot('w-4')}</div>
      <div style={{ backgroundColor: t.primaryLight }} className="rounded-lg p-1.5 flex flex-col gap-0.5">
        {dot('w-10')}{dot('w-14')}
        <div style={{ backgroundColor: t.primary }} className="h-1.5 w-6 rounded-full mt-0.5" />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div style={{ backgroundColor: t.primaryLight }} className="rounded-lg h-5" />
        <div style={{ backgroundColor: t.primaryLight }} className="rounded-lg h-5" />
      </div>
    </div>
  )
  // folio
  return (
    <div className="p-2 flex flex-col items-center gap-1">
      {rule(t.secondary)}
      {dot('w-14')}{dot('w-8')}
      <div style={{ color: t.primary }} className="text-[8px] tracking-[0.4em] leading-none select-none">···</div>
      <div style={{ backgroundColor: t.primary }} className="h-0.5 w-4 rounded-sm" />
      {dot('w-10')}
      <div style={{ borderColor: t.border }} className="w-full border-b border-dotted mt-1" />
      <div style={{ borderColor: t.border }} className="w-full border-b border-dotted mt-1" />
    </div>
  )
}

export default function TemplateSelector({ layout, theme, font, onLayoutChange, onThemeChange, onFontChange }: TemplateSelectorProps) {
  const t = THEMES[theme] || THEMES.cloud

  return (
    <div className="space-y-10">
      <link rel="stylesheet" href={ALL_PREVIEW_FONTS_URL} />
      {/* Layout picker */}
      <div>
        <h3 className="text-sm font-semibold text-ink/70 mb-1">Layout</h3>
        <p className="text-xs text-ink/40 mb-5">Choose the overall structure of your site.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAYOUT_LIST.map((l) => {
            const isSelected = layout === l.id
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLayoutChange(l.id)}
                className={cn(
                  'text-left rounded-xl border-2 overflow-hidden transition-all hover:-translate-y-0.5',
                  isSelected ? 'border-maple shadow-lg shadow-maple-light' : 'border-ink/10 hover:border-ink/25'
                )}
              >
                <div style={{ backgroundColor: t.bg }} className="aspect-video overflow-hidden">
                  <LayoutWireframe id={l.id} t={t} />
                </div>
                <div className="p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-ink text-sm">{l.name}</div>
                    <div className="text-xs text-ink/40">{l.description}</div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-maple rounded-full flex items-center justify-center text-white text-xs shrink-0">✓</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Theme picker */}
      <div>
        <h3 className="text-sm font-semibold text-ink/70 mb-1">Colour theme</h3>
        <p className="text-xs text-ink/40 mb-5">Choose a colour palette for your site.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_LIST.map((th) => {
            const isSelected = theme === th.id
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => onThemeChange(th.id as TemplateId)}
                className={cn(
                  'text-left rounded-xl border-2 overflow-hidden transition-all hover:-translate-y-0.5',
                  isSelected ? 'border-maple shadow-lg shadow-maple-light' : 'border-ink/10 hover:border-ink/25'
                )}
              >
                <div style={{ backgroundColor: th.bg }} className="aspect-video p-3">
                  <div style={{ borderBottomColor: th.border }} className="flex justify-between items-center mb-2 border-b pb-1">
                    <div style={{ color: th.text }} className="text-[8px] font-bold">Business</div>
                  </div>
                  <div style={{ color: th.secondary }} className="text-[6px] font-semibold tracking-widest uppercase mb-0.5">Category</div>
                  <div style={{ color: th.text }} className="text-[10px] font-bold leading-tight mb-0.5">Business Name</div>
                  <div style={{ color: th.textMuted }} className="text-[6px] mb-1.5 leading-tight">A short description of your services.</div>
                  <div style={{ backgroundColor: th.primary, color: '#fff' }} className="inline-block rounded-full px-1.5 py-0.5 text-[6px] font-medium">Get started</div>
                </div>
                <div className="p-3 bg-white flex items-center justify-between">
                  <div className="font-semibold text-ink text-sm">{th.name}</div>
                  <div className="flex gap-1 items-center">
                    {[th.primary, th.secondary, th.primaryLight].map((color, i) => (
                      <div key={i} className="w-3 h-3 rounded-full border border-ink/10 shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                    {isSelected && (
                      <div className="w-5 h-5 bg-maple rounded-full flex items-center justify-center text-white text-xs ml-1">✓</div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Font picker */}
      <div>
        <h3 className="text-sm font-semibold text-ink/70 mb-1">Typography</h3>
        <p className="text-xs text-ink/40 mb-5">Choose a font pairing for your site.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {FONT_LIST.map((fp) => {
            const isSelected = font === fp.id
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => onFontChange(fp.id)}
                className={cn(
                  'text-left rounded-xl border-2 overflow-hidden transition-all hover:-translate-y-0.5',
                  isSelected ? 'border-maple shadow-lg shadow-maple-light' : 'border-ink/10 hover:border-ink/25'
                )}
              >
                <div className="p-4 bg-white min-h-[80px]">
                  <div style={{ fontFamily: fp.headingFamily }} className="text-lg font-bold text-ink leading-tight mb-1">The Quick</div>
                  <div style={{ fontFamily: fp.bodyFamily }} className="text-xs text-ink/50 leading-snug">Body text for readability.</div>
                </div>
                <div className="px-3 py-2.5 bg-paper flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-ink text-sm">{fp.name}</div>
                    <div className="text-[10px] text-ink/40">{fp.description}</div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-maple rounded-full flex items-center justify-center text-white text-xs shrink-0">✓</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

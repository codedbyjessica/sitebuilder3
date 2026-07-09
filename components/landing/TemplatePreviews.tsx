import type { ReactNode } from 'react'
import Link from 'next/link'
import { THEMES, LAYOUT_LIST, type ColorTheme, type LayoutId, type ThemeId } from '@/lib/types'

const LAYOUT_THEME: Record<LayoutId, ThemeId> = {
  minimal: 'cloud',
  bold: 'ocean',
  folio: 'sage',
  serene: 'bloom',
  studio: 'midnight',
  harvest: 'ember',
}

function MinimalMini({ t }: { t: ColorTheme }) {
  return (
    <>
      <div className="border-b px-3 py-2 flex items-center justify-between" style={{ borderColor: t.border }}>
        <span style={{ color: t.text }} className="text-[9px] font-bold">Acme Co.</span>
        <span style={{ color: t.primary }} className="text-[7px] underline">Book now →</span>
      </div>
      <div className="px-3 pt-3">
        <div style={{ color: t.secondary }} className="text-[6px] tracking-widest uppercase font-semibold mb-1">Landscaping</div>
        <div style={{ color: t.text }} className="text-[14px] font-bold leading-tight mb-1">Acme Co.</div>
        <div style={{ color: t.textMuted }} className="text-[6px] mb-2">Services for your neighbourhood</div>
        <div style={{ color: t.primary }} className="text-[7px] underline mb-3">Get in touch →</div>
        <div className="border-t" style={{ borderColor: t.border }}>
          {['Services', 'About'].map((s, i) => (
            <div key={i} className="flex items-center py-1 border-b text-[7px]" style={{ borderColor: t.border, color: t.text }}>
              <span style={{ color: t.textMuted }} className="font-mono mr-1.5 text-[6px]">0{i + 1}</span>
              <span>{s}</span>
              <span style={{ color: t.textMuted }} className="ml-auto">→</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function BoldMini({ t }: { t: ColorTheme }) {
  return (
    <>
      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: t.primary }}>
        <span className="text-[9px] font-black text-white">Acme Co.</span>
        <span className="rounded-full px-2 py-0.5 text-[6px] font-bold" style={{ backgroundColor: '#fff', color: t.primary }}>Book now</span>
      </div>
      <div className="px-3 pt-4 pb-3" style={{ backgroundColor: t.primary }}>
        <span className="rounded-full px-2 py-0.5 text-[6px] font-bold tracking-widest uppercase mb-2 inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>Landscaping</span>
        <div className="text-[14px] font-black text-white leading-tight mb-1">Acme Co.</div>
        <div className="text-[6px] mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Services for your neighbourhood</div>
      </div>
      <div className="px-3 pt-2" style={{ backgroundColor: t.bg }}>
        {['Services', 'About'].map((s, i) => (
          <div key={i} className="flex items-center py-1 border-b text-[7px]" style={{ borderColor: t.border, color: t.text }}>
            <span>{s}</span>
            <span style={{ color: t.textMuted }} className="ml-auto">→</span>
          </div>
        ))}
      </div>
    </>
  )
}

function FolioMini({ t }: { t: ColorTheme }) {
  return (
    <>
      <div className="border-b px-3 py-2 flex items-center justify-between" style={{ borderColor: t.border }}>
        <span style={{ color: t.text }} className="text-[9px] font-bold">Acme Co.</span>
        <span style={{ color: t.textMuted }} className="text-[6px] tracking-widest uppercase">Services</span>
      </div>
      <div className="text-center px-4 pt-4">
        <div style={{ color: t.secondary }} className="text-[6px] tracking-widest uppercase font-semibold mb-2">Est. 2018</div>
        <div style={{ color: t.text }} className="text-[13px] font-bold leading-tight mb-1">Acme Co.</div>
        <div style={{ color: t.primary }} className="text-[10px] tracking-[0.4em] mb-2">· · ·</div>
        <div style={{ color: t.textMuted }} className="text-[6px] leading-relaxed mb-2 max-w-[80px] mx-auto">Services for your community</div>
        <div className="border-t pt-1.5" style={{ borderColor: t.border }}>
          {['Services', 'About'].map((s, i) => (
            <div key={i} style={{ color: t.textMuted }} className="text-[6px] py-0.5 tracking-widest uppercase">{s}</div>
          ))}
        </div>
      </div>
    </>
  )
}

function SereneMini({ t }: { t: ColorTheme }) {
  return (
    <>
      <div className="text-center px-3 pt-3 pb-2 border-b" style={{ borderColor: t.border }}>
        <div style={{ color: t.text }} className="text-[9px] font-bold mb-1.5">Acme Co.</div>
        <div className="flex justify-center gap-3">
          <span style={{ color: t.textMuted }} className="text-[6px]">Services</span>
          <span style={{ color: t.textMuted }} className="text-[6px]">About</span>
          <span style={{ color: t.primary }} className="text-[6px] underline">Book →</span>
        </div>
      </div>
      <div className="text-center px-4 pt-4">
        <div style={{ color: t.secondary }} className="text-[6px] tracking-widest uppercase font-semibold mb-2">Landscaping</div>
        <div style={{ color: t.text }} className="text-[13px] font-bold leading-tight mb-2">Acme Co.</div>
        <div style={{ color: t.textMuted }} className="text-[6px] leading-relaxed mb-3">Serving your community with care</div>
        <span className="rounded-full px-3 py-1 text-[6px] font-medium" style={{ backgroundColor: t.primaryLight, color: t.primary }}>Get in touch</span>
      </div>
    </>
  )
}

function StudioMini({ t }: { t: ColorTheme }) {
  return (
    <div className="flex h-full">
      <div className="w-14 flex-shrink-0 border-r p-2 flex flex-col" style={{ borderColor: t.border, backgroundColor: t.primaryLight }}>
        <div style={{ color: t.text }} className="text-[7px] font-bold leading-tight mb-2">Acme Co.</div>
        <div style={{ color: t.textMuted }} className="text-[6px] mb-1">Services</div>
        <div style={{ color: t.textMuted }} className="text-[6px]">About</div>
        <div className="mt-auto rounded-full py-0.5 text-center text-[5px] font-bold" style={{ backgroundColor: t.primary, color: '#fff' }}>Book</div>
      </div>
      <div className="flex-1 p-2">
        <div style={{ color: t.secondary }} className="text-[6px] tracking-widest uppercase mb-1">Landscaping</div>
        <div style={{ color: t.text }} className="text-[10px] font-bold leading-tight mb-1">Services</div>
        <div style={{ color: t.textMuted }} className="text-[6px] leading-relaxed mb-2">Serving your community</div>
        <div className="space-y-1">
          {['Lawn care', 'Planting'].map((s, i) => (
            <div key={i} className="rounded px-1.5 py-1 text-[6px]" style={{ backgroundColor: t.primaryLight, color: t.text }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HarvestMini({ t }: { t: ColorTheme }) {
  return (
    <>
      <div className="px-3 py-2 flex items-center justify-between">
        <span style={{ color: t.text }} className="text-[9px] font-bold">Acme Co.</span>
        <span className="rounded-full px-2 py-0.5 text-[6px] font-bold" style={{ backgroundColor: t.primary, color: '#fff' }}>Book now</span>
      </div>
      <div className="mx-2 rounded-2xl px-3 py-3 mb-2" style={{ backgroundColor: t.primary }}>
        <div className="text-[12px] font-bold text-white leading-tight mb-0.5">Acme Co.</div>
        <div className="text-[6px]" style={{ color: 'rgba(255,255,255,0.65)' }}>Services for your community</div>
      </div>
      <div className="px-2 grid grid-cols-2 gap-1.5">
        {['Services', 'About'].map((s, i) => (
          <div key={i} className="rounded-xl p-1.5 text-[7px] font-medium" style={{ backgroundColor: t.primaryLight, color: t.text }}>{s}</div>
        ))}
      </div>
    </>
  )
}

const LAYOUT_MINIS: Record<LayoutId, (t: ColorTheme) => ReactNode> = {
  minimal: (t) => <MinimalMini t={t} />,
  bold: (t) => <BoldMini t={t} />,
  folio: (t) => <FolioMini t={t} />,
  serene: (t) => <SereneMini t={t} />,
  studio: (t) => <StudioMini t={t} />,
  harvest: (t) => <HarvestMini t={t} />,
}

function LayoutPreviewCard({ id, name, description }: { id: LayoutId; name: string; description: string }) {
  const t = THEMES[LAYOUT_THEME[id]]
  return (
    <div className="group cursor-pointer">
      <div
        className="rounded-2xl overflow-hidden aspect-[4/3] mb-3 transition-transform group-hover:-translate-y-1 border"
        style={{ backgroundColor: t.bg, borderColor: t.border }}
      >
        {LAYOUT_MINIS[id](t)}
      </div>
      <div className="px-1">
        <div className="font-semibold text-ink">{name}</div>
        <div className="text-sm text-ink/50">{description}</div>
      </div>
    </div>
  )
}

export default function TemplatePreviews() {
  return (
    <section id="themes" className="py-24 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
            Pick a look
          </h2>
          <p className="mt-4 text-lg text-ink/60">
            Six layouts, nine colour themes — mix and match.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {LAYOUT_LIST.map((layout) => (
            <LayoutPreviewCard key={layout.id} id={layout.id} name={layout.name} description={layout.description} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/app"
            className="inline-flex items-center bg-ink text-paper font-medium px-8 py-3.5 rounded-full hover:bg-maple transition-colors"
          >
            Start building
          </Link>
        </div>
      </div>
    </section>
  )
}

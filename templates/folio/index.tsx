import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import type { ColorTheme, FontPair } from '@/lib/types'
import { siteView } from '../siteView'

function SectionRule({ t }: { t: ColorTheme }) {
  return <div style={{ backgroundColor: t.primary }} className="h-0.5 w-10 mx-auto mb-7" />
}

function Ornament({ t }: { t: ColorTheme }) {
  return (
    <div style={{ color: t.primary }} className="text-center tracking-[1em] select-none py-2" aria-hidden>
      ···
    </div>
  )
}

function DropCapParagraph({ text, t, f }: { text: string; t: ColorTheme; f: FontPair }) {
  const trimmed = (text || '').trim()
  if (!trimmed) return null
  const first = trimmed.charAt(0)
  const rest = trimmed.slice(1)
  return (
    <p style={{ color: t.textMuted }} className="leading-loose text-lg text-left">
      <span
        style={{ color: t.primary, fontFamily: f.headingFamily }}
        className="float-left text-6xl leading-[0.75] font-bold mr-3 mt-2 select-none"
      >
        {first}
      </span>
      {rest}
    </p>
  )
}

export default function FolioTemplate({ site }: TemplateProps) {
  if (!site) return null
  const {
    t, f, title, category, description, heroImage, heroCtas, navCtas,
    contact, hideContact, hideContactForm, contentBlocks, navSections, footerCopy,
  } = siteView(site)
  const hi = !!heroImage

  return (
    <>
    <link rel="stylesheet" href={f.googleUrl} />
    <div style={{ backgroundColor: t.bg, color: t.text, fontFamily: f.bodyFamily }} className="min-h-screen">
      {/* Nav */}
      <header style={{ borderBottomColor: t.border, backgroundColor: t.bg }} className="border-b sticky top-0 z-10 relative">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div style={{ color: t.text, fontFamily: f.headingFamily }} className="font-bold text-lg">{title}</div>
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
            {contentBlocks.filter(s => !s.hideFromNav).map(s => (
              <a key={s.id} href={`#section-${s.id}`} style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && <a href="#contact" style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">Contact</a>}
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            {(navCtas.length > 0) ? navCtas.map((cta, i) => (
              <a key={i} href={cta.href} style={{ color: t.primary }} className="text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">
                {cta.label}
              </a>
            )) : (
              <a href="#contact" style={{ color: t.primary }} className="text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">
                Book now →
              </a>
            )}
          </div>
          <MobileNav businessName={title} sections={navSections} navCtas={navCtas} hideContact={hideContact} t={t} f={f} />
        </div>
      </header>

      {/* Hero — title page */}
      <section
        className="relative overflow-hidden"
        style={hi ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {hi && <div className="absolute inset-0" style={{ backgroundColor: t.heroOverlay }} />}
        <div className={`relative max-w-2xl mx-auto px-6 text-center ${hi ? 'pt-36 pb-28' : 'pt-24 pb-16'}`}>
          {category && (
            <div className="flex items-center gap-4 mb-10">
              <div style={{ backgroundColor: hi ? 'rgba(255,255,255,0.3)' : t.border }} className="h-px flex-1" />
              <span style={{ color: hi ? 'rgba(255,255,255,0.75)' : t.secondary }} className="text-xs font-semibold tracking-[0.25em] uppercase shrink-0">{category}</span>
              <div style={{ backgroundColor: hi ? 'rgba(255,255,255,0.3)' : t.border }} className="h-px flex-1" />
            </div>
          )}
          <h1 style={{ color: hi ? '#fff' : t.text, fontFamily: f.headingFamily }} className="text-5xl sm:text-6xl font-bold leading-tight mb-8">{title}</h1>
          {description && <p style={{ color: hi ? 'rgba(255,255,255,0.85)' : t.textMuted }} className="text-xl italic leading-relaxed mb-10">{description}</p>}
          <div className="flex gap-4 flex-wrap items-center justify-center">
            {(heroCtas.length > 0) ? heroCtas.map((cta, i) => (
              <a key={i} href={cta.href}
                style={i === 0
                  ? { backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#fff' }
                  : hi
                    ? { borderColor: 'rgba(255,255,255,0.6)', color: '#fff', borderWidth: '2px', borderStyle: 'solid' }
                    : { borderColor: t.primary, color: t.primary, borderWidth: '2px', borderStyle: 'solid' }}
                className="inline-block px-7 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >{cta.label}</a>
            )) : (
              <a href="#contact"
                style={{ backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#fff' }}
                className="inline-block px-7 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Get started
              </a>
            )}
          </div>
        </div>
      </section>

      <Ornament t={t} />

      {/* Sections */}
      {contentBlocks.map(section => {
        const isSide = !!section.photo && section.photoLayout === 'side'
        const content = section.type === 'richtext' ? (
          <DropCapParagraph text={section.body} t={t} f={f} />
        ) : (
          <ul className="text-left">
            {section.items.filter(i => i.trim()).map((item, i) => (
              <li key={i} className="flex items-baseline gap-3 py-3.5">
                <span style={{ color: t.text }} className="shrink-0">{item}</span>
                <span style={{ borderColor: t.border }} className="flex-1 border-b border-dotted translate-y-[-0.2em]" />
                <span style={{ color: t.primary }} className="text-sm font-semibold tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        )
        return (
          <div key={section.id}>
            <section id={`section-${section.id}`} className="max-w-2xl mx-auto px-6 py-14">
              <SectionRule t={t} />
              <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-3xl sm:text-4xl font-bold mb-3 text-center">{section.title}</h3>
              {section.subtitle && <p style={{ color: t.textMuted }} className="italic text-center mb-8">{section.subtitle}</p>}
              {section.photo && !isSide && (
                <div className="relative h-64 rounded-xl overflow-hidden my-8">
                  <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="700px" />
                </div>
              )}
              <div className="mt-8">
                {isSide ? (
                  <div className="flex gap-8 items-start">
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden shrink-0">
                      <Image src={section.photo!} alt={section.title} fill className="object-cover" sizes="192px" />
                    </div>
                    <div className="flex-1 min-w-0">{content}</div>
                  </div>
                ) : content}
              </div>
            </section>
            <Ornament t={t} />
          </div>
        )
      })}

      {/* Contact */}
      {!hideContact && (
        <section id="contact" className="max-w-2xl mx-auto px-6 py-14">
          <SectionRule t={t} />
          <h2 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-3xl sm:text-4xl font-bold mb-6 text-center">{contact?.title || 'Contact us'}</h2>
          <div className="space-y-2 text-sm text-center mb-10" style={{ color: t.textMuted }}>
            {contact?.phone && <p>{formatPhone(contact.phone)}</p>}
            {contact?.email && <p>{contact.email}</p>}
            {contact?.address && <p>{contact.address}{contact.city ? `, ${contact.city}` : ''}</p>}
          </div>
          {!hideContactForm && <ContactForm siteId={site.id} theme={t.isDark ? 'dark' : 'light'} />}
        </section>
      )}

      <footer style={{ borderTopColor: t.border, color: t.textMuted }} className="border-t py-10 text-center text-xs">
        {footerCopy || `© ${new Date().getFullYear()} ${title}`}
      </footer>
    </div>
    </>
  )
}

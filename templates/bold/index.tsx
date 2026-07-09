import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import { siteView } from '../siteView'

export default function BoldTemplate({ site }: TemplateProps) {
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
      <header className="sticky top-0 z-10 relative" style={{ backgroundColor: t.primary }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div style={{ color: '#fff', fontFamily: f.headingFamily }} className="text-xl font-black tracking-tight">{title}</div>
          <nav className="hidden md:flex gap-8 text-sm">
            {contentBlocks.filter(s => !s.hideFromNav).map(s => (
              <a key={s.id} href={`#section-${s.id}`} style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:opacity-100 transition-opacity">
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && <a href="#contact" style={{ color: 'rgba(255,255,255,0.7)' }} className="hover:opacity-100 transition-opacity">Contact</a>}
          </nav>
          <div className="hidden md:flex gap-3 items-center">
            {(navCtas.length > 0) ? navCtas.map((cta, i) => (
              <a key={i} href={cta.href}
                style={i === 0 ? { backgroundColor: '#fff', color: t.primary } : { color: '#fff' }}
                className={`text-sm font-bold px-5 py-2 rounded-full hover:opacity-85 transition-opacity ${i > 0 ? 'underline underline-offset-4' : ''}`}
              >{cta.label}</a>
            )) : (
              <a href="#contact" style={{ backgroundColor: '#fff', color: t.primary }} className="text-sm font-bold px-5 py-2 rounded-full hover:opacity-85 transition-opacity">
                Book now
              </a>
            )}
          </div>
          <MobileNav businessName={title} sections={navSections} navCtas={navCtas} hideContact={hideContact} t={t} f={f} inverted />
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={hi
          ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundColor: t.primary }}
      >
        {hi && <div className="absolute inset-0" style={{ backgroundColor: t.heroOverlay }} />}
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28">
          {category && (
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }} className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-8">
              {category}
            </span>
          )}
          <h1 style={{ color: '#fff', fontFamily: f.headingFamily }} className="text-6xl sm:text-8xl font-black leading-[0.95] mb-8 tracking-tight">{title}</h1>
          {description && (
            <p style={{ color: 'rgba(255,255,255,0.75)' }} className="text-xl max-w-2xl leading-relaxed mb-10">{description}</p>
          )}
          <div className="flex gap-4 flex-wrap items-center">
            {(heroCtas.length > 0) ? heroCtas.map((cta, i) => (
              <a key={i} href={cta.href}
                style={i === 0
                  ? { backgroundColor: '#fff', color: t.primary }
                  : { borderColor: 'rgba(255,255,255,0.6)', color: '#fff', borderWidth: '2px', borderStyle: 'solid' }}
                className="inline-block px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
              >{cta.label}</a>
            )) : (
              <a href="#contact" style={{ backgroundColor: '#fff', color: t.primary }} className="inline-block px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                Get started
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Sections — editorial thick rules */}
      {contentBlocks.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {contentBlocks.map((section, idx) => {
            const isSide = !!section.photo && section.photoLayout === 'side'
            const content = section.type === 'richtext' ? (
              <p style={{ color: t.textMuted }} className="leading-relaxed text-lg max-w-2xl">{section.body}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {section.items.filter(i => i.trim()).map((item, i) => (
                  <div key={i} style={{ borderColor: t.border }} className="border-2 rounded-xl px-5 py-4 flex items-center gap-4">
                    <span style={{ color: t.primary }} className="font-black text-2xl tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ color: t.text }} className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            )
            return (
              <section key={section.id} id={`section-${section.id}`} style={{ borderTopColor: t.text }} className="border-t-4 py-14">
                <div className="flex items-baseline gap-4 mb-2">
                  <span style={{ color: t.primary }} className="font-black text-lg tabular-nums shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-4xl font-black tracking-tight">{section.title}</h3>
                </div>
                {section.subtitle && <p style={{ color: t.textMuted }} className="mb-4 ml-10">{section.subtitle}</p>}
                {section.photo && !isSide && (
                  <div className="relative h-72 rounded-2xl overflow-hidden my-6">
                    <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="1100px" />
                  </div>
                )}
                <div className="mt-6">
                  {isSide ? (
                    <div className="flex gap-10 items-start">
                      <div className="relative w-64 h-64 rounded-2xl overflow-hidden shrink-0">
                        <Image src={section.photo!} alt={section.title} fill className="object-cover" sizes="256px" />
                      </div>
                      <div className="flex-1 min-w-0">{content}</div>
                    </div>
                  ) : content}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* Contact — primary bookend */}
      {!hideContact && (
        <section id="contact" style={{ backgroundColor: t.primary }} className="px-6 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start">
            <div>
              <h2 style={{ color: '#fff', fontFamily: f.headingFamily }} className="text-5xl font-black mb-6 tracking-tight">{contact?.title || 'Contact us'}</h2>
              <div style={{ color: 'rgba(255,255,255,0.75)' }} className="space-y-2 text-base">
                {contact?.phone && <p>{formatPhone(contact.phone)}</p>}
                {contact?.email && <p>{contact.email}</p>}
                {contact?.address && <p>{contact.address}<br />{contact.city}</p>}
              </div>
            </div>
            {!hideContactForm && (
              <div style={{ backgroundColor: t.bg }} className="rounded-2xl p-6 sm:p-8">
                <ContactForm siteId={site.id} theme={t.isDark ? 'dark' : 'light'} />
              </div>
            )}
          </div>
        </section>
      )}

      <footer style={{ backgroundColor: t.text, color: t.bg }} className="py-6 text-center text-xs font-medium">
        {footerCopy || `© ${new Date().getFullYear()} ${title}`}
      </footer>
    </div>
    </>
  )
}

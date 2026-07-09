import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import { siteView } from '../siteView'

export default function MinimalTemplate({ site }: TemplateProps) {
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
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div style={{ color: t.text }} className="font-bold text-lg">{title}</div>
          <nav className="hidden md:flex gap-8 text-sm">
            {contentBlocks.filter(s => !s.hideFromNav).map(s => (
              <a key={s.id} href={`#section-${s.id}`} style={{ color: t.textMuted }} className="hover:opacity-100 transition-opacity">
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && <a href="#contact" style={{ color: t.textMuted }}>Contact</a>}
          </nav>
          <div className="hidden md:flex gap-5 items-center">
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

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={hi ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {hi && <div className="absolute inset-0" style={{ backgroundColor: t.heroOverlay }} />}
        <div className={`relative max-w-5xl mx-auto px-6 ${hi ? 'py-36' : 'py-24'}`}>
          {category && <p style={{ color: hi ? 'rgba(255,255,255,0.75)' : t.secondary }} className="text-xs font-semibold tracking-widest uppercase mb-6">{category}</p>}
          <h1 style={{ color: hi ? '#fff' : t.text, fontFamily: f.headingFamily }} className="text-5xl sm:text-6xl font-bold leading-tight mb-6">{title}</h1>
          {description && <p style={{ color: hi ? 'rgba(255,255,255,0.85)' : t.textMuted }} className="text-xl max-w-2xl leading-relaxed mb-10">{description}</p>}
          <div className="flex gap-4 flex-wrap items-center">
            {(heroCtas.length > 0) ? heroCtas.map((cta, i) => (
              <a
                key={i}
                href={cta.href}
                style={i === 0
                  ? { backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#ffffff' }
                  : hi
                    ? { borderColor: 'rgba(255,255,255,0.6)', color: '#fff', borderWidth: '2px', borderStyle: 'solid' }
                    : { borderColor: t.primary, color: t.primary, borderWidth: '2px', borderStyle: 'solid' }
                }
                className="inline-block px-7 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                {cta.label}
              </a>
            )) : (
              <a
                href="#contact"
                style={{ backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#ffffff' }}
                className="inline-block px-7 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Get started
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Sections */}
      {contentBlocks.length > 0 && (
        <section id="sections" style={{ borderTopColor: t.border }} className="max-w-5xl mx-auto px-6 py-16 border-t space-y-14">
          {contentBlocks.map(section => {
            const isSide = !!section.photo && section.photoLayout === 'side'
            const content = section.type === 'richtext' ? (
              <p style={{ color: t.textMuted }} className="leading-relaxed mt-2">{section.body}</p>
            ) : (
              <ul style={{ borderTopColor: t.border }} className="mt-3 border-t">
                {section.items.filter(i => i.trim()).map((item, idx) => (
                  <li key={idx} style={{ borderBottomColor: t.border, color: t.text }} className="py-4 flex items-center gap-5 border-b">
                    <span style={{ color: t.border }} className="text-xs font-mono shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                    {item}
                    <span style={{ color: t.border }} className="ml-auto">→</span>
                  </li>
                ))}
              </ul>
            )
            return (
              <div key={section.id} id={`section-${section.id}`}>
                <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-xl font-bold mb-1">{section.title}</h3>
                {section.subtitle && <p style={{ color: t.textMuted }} className="text-sm mb-3">{section.subtitle}</p>}
                {section.photo && !isSide && (
                  <div className="relative h-64 rounded-xl overflow-hidden my-4">
                    <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="900px" />
                  </div>
                )}
                {isSide ? (
                  <div className="flex gap-8 items-start mt-4">
                    <div className="relative w-56 h-56 rounded-xl overflow-hidden shrink-0">
                      <Image src={section.photo!} alt={section.title} fill className="object-cover" sizes="224px" />
                    </div>
                    <div className="flex-1">{content}</div>
                  </div>
                ) : content}
              </div>
            )
          })}
        </section>
      )}

      {/* Contact */}
      {!hideContact && (
        <section id="contact" style={{ borderTopColor: t.border }} className="max-w-5xl mx-auto px-6 py-16 border-t">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-2xl font-bold mb-4">{contact?.title || 'Contact us'}</h2>
              <div className="space-y-3 text-sm" style={{ color: t.textMuted }}>
                {contact?.phone && <p>{formatPhone(contact.phone)}</p>}
                {contact?.email && <p>{contact.email}</p>}
                {contact?.address && <p>{contact.address}<br />{contact.city}</p>}
              </div>
            </div>
            {!hideContactForm && <ContactForm siteId={site.id} theme={t.isDark ? 'dark' : 'light'} />}
          </div>
        </section>
      )}

      <footer style={{ borderTopColor: t.border, backgroundColor: t.primaryLight, color: t.textMuted }} className="border-t py-8 text-center text-xs">
        {footerCopy || `© ${new Date().getFullYear()} ${title}`}
      </footer>
    </div>
    </>
  )
}

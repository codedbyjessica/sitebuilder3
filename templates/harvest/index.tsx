import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import { siteView } from '../siteView'

export default function HarvestTemplate({ site }: TemplateProps) {
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
      <header style={{ backgroundColor: t.bg }} className="sticky top-0 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div style={{ color: t.text, fontFamily: f.headingFamily }} className="font-bold text-lg">{title}</div>
          <nav className="hidden md:flex gap-7 text-sm">
            {contentBlocks.filter(s => !s.hideFromNav).map(s => (
              <a key={s.id} href={`#section-${s.id}`} style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && <a href="#contact" style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">Contact</a>}
          </nav>
          <div className="hidden md:flex gap-3 items-center">
            {(navCtas.length > 0) ? navCtas.map((cta, i) => (
              <a key={i} href={cta.href}
                style={i === 0 ? { backgroundColor: t.primary, color: '#fff' } : { color: t.primary }}
                className={`text-sm font-medium px-5 py-2 rounded-full hover:opacity-80 transition-opacity ${i > 0 ? 'underline underline-offset-4' : ''}`}
              >{cta.label}</a>
            )) : (
              <a href="#contact" style={{ backgroundColor: t.primary, color: '#fff' }} className="text-sm font-medium px-5 py-2 rounded-full hover:opacity-80 transition-opacity">
                Book now
              </a>
            )}
          </div>
          <MobileNav businessName={title} sections={navSections} navCtas={navCtas} hideContact={hideContact} t={t} f={f} />
        </div>
      </header>

      {/* Hero — soft rounded band */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-[2.5rem] px-8 sm:px-14 py-20 sm:py-24 relative overflow-hidden"
          style={hi
            ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: t.primaryLight }}
        >
          {hi && <div className="absolute inset-0 rounded-[2.5rem]" style={{ backgroundColor: t.heroOverlay }} />}
          <div className="relative">
            {category && (
              <span
                style={hi
                  ? { backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff' }
                  : { backgroundColor: t.secondaryLight, color: t.secondary }}
                className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 mb-6"
              >
                {category}
              </span>
            )}
            <h1 style={{ color: hi ? '#fff' : t.text, fontFamily: f.headingFamily }} className="text-5xl sm:text-6xl font-bold leading-tight mb-6 max-w-3xl">{title}</h1>
            {description && <p style={{ color: hi ? 'rgba(255,255,255,0.85)' : t.textMuted }} className="text-xl max-w-2xl leading-relaxed mb-10">{description}</p>}
            <div className="flex gap-4 flex-wrap items-center">
              {(heroCtas.length > 0) ? heroCtas.map((cta, i) => (
                <a key={i} href={cta.href}
                  style={i === 0
                    ? { backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#fff' }
                    : hi
                      ? { borderColor: 'rgba(255,255,255,0.6)', color: '#fff', borderWidth: '2px', borderStyle: 'solid' }
                      : { backgroundColor: t.bg, color: t.primary }}
                  className="inline-block px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                >{cta.label}</a>
              )) : (
                <a href="#contact"
                  style={{ backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#fff' }}
                  className="inline-block px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Get started
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sections — rounded card panels */}
      {contentBlocks.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
          {contentBlocks.map(section => {
            const isSide = !!section.photo && section.photoLayout === 'side'
            const content = section.type === 'richtext' ? (
              <p style={{ color: t.textMuted }} className="leading-relaxed text-lg mt-3 max-w-2xl">{section.body}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {section.items.filter(i => i.trim()).map((item, i) => (
                  <div key={i} style={{ backgroundColor: t.bg, color: t.text }} className="rounded-2xl px-5 py-4 text-sm font-medium flex items-center gap-3">
                    <span style={{ backgroundColor: t.primary }} className="w-2 h-2 rounded-full shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            )
            return (
              <section key={section.id} id={`section-${section.id}`} style={{ backgroundColor: t.primaryLight }} className="rounded-[2.5rem] px-8 sm:px-14 py-14">
                <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-3xl font-bold mb-1">{section.title}</h3>
                {section.subtitle && <p style={{ color: t.textMuted }} className="text-sm mb-2">{section.subtitle}</p>}
                {section.photo && !isSide && (
                  <div className="relative h-72 rounded-3xl overflow-hidden my-6">
                    <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="1100px" />
                  </div>
                )}
                {isSide ? (
                  <div className="flex gap-10 items-start mt-5">
                    <div className="relative w-60 h-60 rounded-3xl overflow-hidden shrink-0">
                      <Image src={section.photo!} alt={section.title} fill className="object-cover" sizes="240px" />
                    </div>
                    <div className="flex-1 min-w-0">{content}</div>
                  </div>
                ) : content}
              </section>
            )
          })}
        </div>
      )}

      {/* Contact — rounded card */}
      {!hideContact && (
        <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10">
          <div style={{ backgroundColor: t.primaryLight }} className="rounded-[2.5rem] px-8 sm:px-14 py-14 grid md:grid-cols-2 gap-14">
            <div>
              <h2 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-3xl font-bold mb-5">{contact?.title || 'Contact us'}</h2>
              <div style={{ color: t.textMuted }} className="space-y-2 text-base">
                {contact?.phone && <p>{formatPhone(contact.phone)}</p>}
                {contact?.email && <p>{contact.email}</p>}
                {contact?.address && <p>{contact.address}<br />{contact.city}</p>}
              </div>
            </div>
            {!hideContactForm && <ContactForm siteId={site.id} theme={t.isDark ? 'dark' : 'light'} />}
          </div>
        </section>
      )}

      <footer style={{ color: t.textMuted }} className="py-8 text-center text-xs">
        {footerCopy || `© ${new Date().getFullYear()} ${title}`}
      </footer>
    </div>
    </>
  )
}

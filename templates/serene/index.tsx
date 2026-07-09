import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import { siteView } from '../siteView'

export default function SereneTemplate({ site }: TemplateProps) {
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
        {/* Mobile header row */}
        <div className="md:hidden border-b px-6 py-4 flex items-center justify-between" style={{ borderBottomColor: t.border }}>
          <div style={{ color: t.text, fontFamily: f.headingFamily }} className="font-bold text-lg">{title}</div>
          <MobileNav businessName={title} sections={navSections} navCtas={navCtas} hideContact={hideContact} t={t} f={f} />
        </div>
        {/* Desktop centered stack */}
        <div className="hidden md:block px-6 pt-10 pb-4">
          <div style={{ color: t.text, fontFamily: f.headingFamily }} className="text-center font-bold text-xl mb-5">{title}</div>
          <nav className="flex flex-wrap justify-center items-center gap-x-7 gap-y-2 text-sm">
            {contentBlocks.filter(s => !s.hideFromNav).map(s => (
              <a key={s.id} href={`#section-${s.id}`} style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">
                {(s.navTitle || s.title).trim()}
              </a>
            ))}
            {!hideContact && <a href="#contact" style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">Contact</a>}
            {(navCtas.length > 0) ? navCtas.map((cta, i) => (
              <a key={i} href={cta.href} style={{ color: t.primary }} className="font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">
                {cta.label}
              </a>
            )) : (
              <a href="#contact" style={{ color: t.primary }} className="font-medium underline underline-offset-4 hover:opacity-80 transition-opacity">
                Book now →
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero — centered */}
      <section
        className="relative overflow-hidden"
        style={hi ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {hi && <div className="absolute inset-0" style={{ backgroundColor: t.heroOverlay }} />}
        <div className={`relative max-w-3xl mx-auto px-6 text-center ${hi ? 'pt-40 pb-36' : 'pt-24 pb-28'}`}>
          {category && <p style={{ color: hi ? 'rgba(255,255,255,0.75)' : t.secondary }} className="text-xs font-semibold tracking-widest uppercase mb-6">{category}</p>}
          <h1 style={{ color: hi ? '#fff' : t.text, fontFamily: f.headingFamily }} className="text-5xl sm:text-6xl font-bold leading-tight mb-7">{title}</h1>
          {description && <p style={{ color: hi ? 'rgba(255,255,255,0.85)' : t.textMuted }} className="text-xl leading-relaxed mb-10 max-w-2xl mx-auto">{description}</p>}
          <div className="flex gap-4 flex-wrap items-center justify-center">
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
                className="inline-block px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                {cta.label}
              </a>
            )) : (
              <a
                href="#contact"
                style={{ backgroundColor: hi ? '#fff' : t.primary, color: hi ? t.primary : '#ffffff' }}
                className="inline-block px-8 py-3.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Get started
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Sections — centered, alternating soft cards */}
      {contentBlocks.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-8 space-y-8">
          {contentBlocks.map((section, idx) => {
            const isCard = idx % 2 === 0
            const photoLayout = section.photoLayout || 'stacked-below'
            const isSideLayout = photoLayout.startsWith('side-')
            const isPhotoAbove = photoLayout === 'stacked-above'
            const isPhotoLeft = photoLayout === 'side-left'

            const content = section.type === 'richtext' ? (
              <p style={{ color: t.textMuted }} className="leading-relaxed">{section.body}</p>
            ) : (
              <ul className="max-w-md mx-auto text-left w-full">
                {section.items.filter(i => i.trim()).map((item, i) => (
                  <li key={i} style={{ borderBottomColor: t.border, color: t.text }} className="py-3.5 border-b last:border-b-0 flex items-center gap-3">
                    <span style={{ backgroundColor: t.primary }} className="w-1.5 h-1.5 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )
            return (
              <section
                key={section.id}
                id={`section-${section.id}`}
                style={isCard ? { backgroundColor: t.primaryLight } : undefined}
                className={isCard ? 'rounded-3xl px-8 sm:px-12 py-14' : 'px-2 py-10'}
              >
                <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-2xl font-bold mb-2 text-center">{section.title}</h3>
                {section.subtitle && <p style={{ color: t.textMuted }} className="text-sm mb-6 text-center">{section.subtitle}</p>}

                {!isSideLayout ? (
                  <>
                    {section.photo && isPhotoAbove && (
                      <div className="relative h-64 rounded-2xl overflow-hidden my-6">
                        <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="700px" />
                      </div>
                    )}
                    <div className="mt-4 text-center flex flex-col items-center">{content}</div>
                    {section.photo && !isPhotoAbove && (
                      <div className="relative h-64 rounded-2xl overflow-hidden my-6">
                        <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="700px" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex gap-8 items-start mt-6 text-left">
                    {section.photo && isPhotoLeft && (
                      <div className="relative w-52 h-52 rounded-2xl overflow-hidden shrink-0">
                        <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="208px" />
                      </div>
                    )}
                    <div className="flex-1">{content}</div>
                    {section.photo && !isPhotoLeft && (
                      <div className="relative w-52 h-52 rounded-2xl overflow-hidden shrink-0">
                        <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="208px" />
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      {/* Contact — centered */}
      {!hideContact && (
        <section id="contact" className="max-w-xl mx-auto px-6 py-20 text-center">
          <h2 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-3xl font-bold mb-5">{contact?.title || 'Contact us'}</h2>
          <div className="space-y-2 text-sm mb-10" style={{ color: t.textMuted }}>
            {contact?.phone && <p>{formatPhone(contact.phone)}</p>}
            {contact?.email && <p>{contact.email}</p>}
            {contact?.address && <p>{contact.address}{contact.city ? `, ${contact.city}` : ''}</p>}
          </div>
          {!hideContactForm && (
            <div className="text-left">
              <ContactForm siteId={site.id} theme={t.isDark ? 'dark' : 'light'} />
            </div>
          )}
        </section>
      )}

      <footer style={{ borderTopColor: t.border, color: t.textMuted }} className="border-t py-8 text-center text-xs">
        {footerCopy || `© ${new Date().getFullYear()} ${title}`}
      </footer>
    </div>
    </>
  )
}

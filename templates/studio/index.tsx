import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import MobileNav from '@/components/site/MobileNav'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'
import { siteView } from '../siteView'

export default function StudioTemplate({ site }: TemplateProps) {
  if (!site) return null
  const {
    t, f, title, category, description, heroImage, heroCtas, navCtas,
    contact, hideContact, hideContactForm, contentBlocks, navSections, footerCopy,
  } = siteView(site)
  const hi = !!heroImage

  const navLinks = (
    <>
      {contentBlocks.filter(s => !s.hideFromNav).map(s => (
        <a key={s.id} href={`#section-${s.id}`} style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">
          {(s.navTitle || s.title).trim()}
        </a>
      ))}
      <a href="#contact" style={{ color: t.textMuted }} className="hover:opacity-70 transition-opacity">Contact</a>
    </>
  )

  const navCtaLinks = (navCtas.length > 0) ? navCtas.map((cta, i) => (
    <a key={i} href={cta.href}
      style={i === 0 ? { backgroundColor: t.primary, color: '#fff' } : { borderColor: t.primary, color: t.primary, borderWidth: '2px', borderStyle: 'solid' }}
      className="block text-center text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
    >{cta.label}</a>
  )) : (
    <a href="#contact" style={{ backgroundColor: t.primary, color: '#fff' }} className="block text-center text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
      Book now
    </a>
  )

  return (
    <>
    <link rel="stylesheet" href={f.googleUrl} />
    <div style={{ backgroundColor: t.bg, color: t.text, fontFamily: f.bodyFamily }} className="min-h-screen">
      {/* Mobile header */}
      <header style={{ borderBottomColor: t.border, backgroundColor: t.bg }} className="md:hidden border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 relative">
        <div style={{ color: t.text, fontFamily: f.headingFamily }} className="font-bold">{title}</div>
        <MobileNav businessName={title} sections={navSections} navCtas={navCtas} hideContact={hideContact} t={t} f={f} />
      </header>

      <div className="md:flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside style={{ borderRightColor: t.border }} className="hidden md:flex md:flex-col md:w-72 md:shrink-0 md:sticky md:top-0 md:h-screen md:border-r px-8 py-12">
          <div style={{ color: t.text, fontFamily: f.headingFamily }} className="text-2xl font-bold leading-snug mb-2">{title}</div>
          {category && <p style={{ color: t.secondary }} className="text-xs font-semibold tracking-widest uppercase mb-10">{category}</p>}
          <nav className="flex flex-col gap-4 text-sm">
            {navLinks}
          </nav>
          <div className="mt-auto space-y-3 pt-10">
            {navCtaLinks}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <section
            className="relative overflow-hidden"
            style={hi ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {hi && <div className="absolute inset-0" style={{ backgroundColor: t.heroOverlay }} />}
            <div className={`relative px-6 md:px-14 ${hi ? 'pt-28 md:pt-36 pb-28' : 'pt-20 md:pt-28 pb-20'}`}>
              {category && <p style={{ color: hi ? 'rgba(255,255,255,0.75)' : t.secondary }} className="md:hidden text-xs font-semibold tracking-widest uppercase mb-5">{category}</p>}
              <h1 style={{ color: hi ? '#fff' : t.text, fontFamily: f.headingFamily }} className="text-5xl sm:text-6xl font-bold leading-tight mb-6">{title}</h1>
              {description && <p style={{ color: hi ? 'rgba(255,255,255,0.85)' : t.textMuted }} className="text-xl max-w-2xl leading-relaxed mb-10">{description}</p>}
              <div className="flex gap-4 flex-wrap items-center">
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

          {/* Sections */}
          {contentBlocks.map(section => {
            const isSide = !!section.photo && section.photoLayout === 'side'
            const content = section.type === 'richtext' ? (
              <p style={{ color: t.textMuted }} className="leading-relaxed mt-2 max-w-2xl">{section.body}</p>
            ) : (
              <ul style={{ borderTopColor: t.border }} className="mt-4 border-t max-w-2xl">
                {section.items.filter(i => i.trim()).map((item, i) => (
                  <li key={i} style={{ borderBottomColor: t.border, color: t.text }} className="py-4 flex items-center gap-4 border-b">
                    <span style={{ color: t.primary }} className="text-xs font-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ul>
            )
            return (
              <section key={section.id} id={`section-${section.id}`} style={{ borderTopColor: t.border }} className="border-t px-6 md:px-14 py-16">
                <h3 style={{ color: t.text, fontFamily: f.headingFamily }} className="text-2xl font-bold mb-1">{section.title}</h3>
                {section.subtitle && <p style={{ color: t.textMuted }} className="text-sm mb-3">{section.subtitle}</p>}
                {section.photo && !isSide && (
                  <div className="relative h-64 rounded-2xl overflow-hidden my-5 max-w-2xl">
                    <Image src={section.photo} alt={section.title} fill className="object-cover" sizes="700px" />
                  </div>
                )}
                {isSide ? (
                  <div className="flex gap-8 items-start mt-4">
                    <div className="relative w-52 h-52 rounded-2xl overflow-hidden shrink-0">
                      <Image src={section.photo!} alt={section.title} fill className="object-cover" sizes="208px" />
                    </div>
                    <div className="flex-1 min-w-0">{content}</div>
                  </div>
                ) : content}
              </section>
            )
          })}

          {/* Contact */}
          {!hideContact && (
            <section id="contact" style={{ borderTopColor: t.border }} className="border-t px-6 md:px-14 py-16">
              <div className="grid lg:grid-cols-2 gap-14 max-w-4xl">
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

          <footer style={{ borderTopColor: t.border, color: t.textMuted }} className="border-t px-6 md:px-14 py-8 text-xs">
            {footerCopy || `© ${new Date().getFullYear()} ${title}`}
          </footer>
        </main>
      </div>
    </div>
    </>
  )
}

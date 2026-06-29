import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function ModernTemplate({ data, preview }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, hours, slug } = data

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-lg tracking-tight">{businessName}</div>
          <nav className="hidden md:flex gap-6 text-slate-400 text-sm">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            {images.length > 0 && <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>}
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors">
            Get in touch
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">{category}</p>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">{businessName}</h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl mb-10">{description}</p>
            <div className="flex gap-4">
              <a href="#contact" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-colors">
                Contact us
              </a>
              <a href="#services" className="border border-slate-700 text-slate-300 px-6 py-3 rounded-lg font-semibold hover:border-slate-500 transition-colors">
                Our services
              </a>
            </div>
          </div>
        </div>
        {/* Accent orb */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">About us</h2>
            <p className="text-slate-400 leading-relaxed text-lg">{description}</p>
            {address && (
              <div className="mt-6 flex gap-2 text-slate-400 text-sm">
                <span>📍</span>
                <span>{address}, {city}</span>
              </div>
            )}
            {phone && (
              <div className="mt-2 flex gap-2 text-slate-400 text-sm">
                <span>📞</span>
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{formatPhone(phone)}</a>
              </div>
            )}
          </div>
          {images[0] && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={images[0]} alt={businessName} fill className="object-cover" sizes="600px" />
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-lg mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-white font-semibold text-lg">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section id="gallery" className="py-20 px-6 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.slice(1).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={url} alt={`${businessName} gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="400px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Get in touch</h2>
            <p className="text-slate-400 mb-8">Ready to get started? Send us a message and we'll get back to you soon.</p>
            <div className="space-y-4">
              {phone && <div className="flex gap-3 text-slate-300"><span>📞</span><a href={`tel:${phone}`}>{formatPhone(phone)}</a></div>}
              {email && <div className="flex gap-3 text-slate-300"><span>✉️</span><a href={`mailto:${email}`}>{email}</a></div>}
              {address && <div className="flex gap-3 text-slate-300"><span>📍</span><span>{address}, {city}</span></div>}
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6">
            <ContactForm siteId={slug} theme="dark" />
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-slate-800 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} {businessName}
      </footer>
    </div>
  )
}

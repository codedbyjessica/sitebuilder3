import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function ElegantTemplate({ data }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, slug } = data

  return (
    <div className="min-h-screen bg-stone-950 font-serif">
      {/* Nav */}
      <header className="border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <div className="text-white text-xl font-normal tracking-[0.15em]">{businessName.toUpperCase()}</div>
            <div className="text-yellow-600 text-xs tracking-[0.3em] mt-0.5">{category}</div>
          </div>
          <nav className="hidden md:flex gap-8 text-stone-500 text-xs tracking-widest uppercase">
            <a href="#about" className="hover:text-yellow-600 transition-colors">About</a>
            <a href="#services" className="hover:text-yellow-600 transition-colors">Services</a>
            {images.length > 0 && <a href="#gallery" className="hover:text-yellow-600 transition-colors">Gallery</a>}
            <a href="#contact" className="hover:text-yellow-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-32 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 bg-yellow-800/50" />
            <span className="text-yellow-600 text-xs tracking-[0.4em] uppercase">{category}</span>
            <div className="h-px flex-1 bg-yellow-800/50" />
          </div>
          <h1 className="text-5xl sm:text-7xl text-white leading-tight font-light tracking-wide mb-6">
            {businessName}
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-sans">
            {description}
          </p>
          <a href="#contact" className="inline-block border border-yellow-600 text-yellow-600 px-10 py-3 text-xs tracking-[0.3em] uppercase hover:bg-yellow-600 hover:text-black transition-colors">
            Inquire Now
          </a>
        </div>
        {images[0] && (
          <div className="absolute inset-0 -z-10">
            <Image src={images[0]} alt="" fill className="object-cover opacity-10" sizes="1200px" />
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-5xl mx-auto px-8 py-4">
        <div className="h-px flex-1 bg-stone-800" />
        <div className="w-2 h-2 bg-yellow-600 rotate-45" />
        <div className="h-px flex-1 bg-stone-800" />
      </div>

      {/* Services */}
      <section id="services" className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-4">What We Offer</p>
            <h2 className="text-3xl text-white font-light tracking-wide">Our Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="border border-stone-800 p-8 text-center hover:border-yellow-700 transition-colors">
                <div className="w-8 h-px bg-yellow-600 mx-auto mb-6" />
                <h3 className="text-white text-lg font-light tracking-wide">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section id="gallery" className="py-20 px-8 border-t border-stone-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-4">Portfolio</p>
              <h2 className="text-3xl text-white font-light tracking-wide">Gallery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.slice(1).map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden">
                  <Image src={url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="400px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-8 border-t border-stone-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-600 text-xs tracking-[0.4em] uppercase mb-4">Reach Out</p>
            <h2 className="text-3xl text-white font-light tracking-wide">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6 text-stone-400 font-sans text-sm">
              {phone && <div><div className="text-yellow-700 text-xs uppercase tracking-widest mb-1">Phone</div><a href={`tel:${phone}`} className="hover:text-white">{formatPhone(phone)}</a></div>}
              {email && <div><div className="text-yellow-700 text-xs uppercase tracking-widest mb-1">Email</div><a href={`mailto:${email}`} className="hover:text-white">{email}</a></div>}
              {address && <div><div className="text-yellow-700 text-xs uppercase tracking-widest mb-1">Location</div><span>{address}, {city}</span></div>}
            </div>
            <div>
              <ContactForm siteId={slug} theme="dark" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-stone-700 text-xs tracking-[0.3em] uppercase border-t border-stone-900">
        © {new Date().getFullYear()} {businessName}
      </footer>
    </div>
  )
}

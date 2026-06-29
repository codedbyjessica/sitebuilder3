import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function MinimalTemplate({ data }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, slug } = data

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="font-bold text-gray-900 text-lg">{businessName}</div>
          <nav className="hidden md:flex gap-8 text-gray-500 text-sm">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            {images.length > 0 && <a href="#gallery" className="hover:text-gray-900 transition-colors">Gallery</a>}
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600">
            Book now →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">{category}</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">{businessName}</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">{description}</p>
        <a href="#contact" className="inline-block bg-gray-900 text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-gray-700 transition-colors">
          Get started
        </a>
      </section>

      {/* Divider image */}
      {images[0] && (
        <div className="max-w-5xl mx-auto px-6 mb-24">
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src={images[0]} alt={businessName} fill className="object-cover" sizes="1000px" />
          </div>
        </div>
      )}

      {/* Services */}
      <section id="services" className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">What we offer</h2>
        <div className="divide-y divide-gray-100">
          {services.map((service, i) => (
            <div key={i} className="py-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-lg text-gray-900">{service}</h3>
              </div>
              <span className="text-gray-300">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section id="gallery" className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.slice(1).map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                <Image src={url} alt={`${businessName} ${i + 2}`} fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact us</h2>
            <div className="space-y-3 text-sm text-gray-600">
              {phone && <p>{formatPhone(phone)}</p>}
              {email && <p>{email}</p>}
              {address && <p>{address}<br />{city}</p>}
            </div>
          </div>
          <ContactForm siteId={slug} theme="light" />
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {businessName}
      </footer>
    </div>
  )
}

import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function BoldTemplate({ data }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, slug } = data

  return (
    <div className="min-h-screen bg-indigo-950 font-sans">
      {/* Nav */}
      <header className="border-b border-indigo-900">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-white font-black text-xl tracking-tight">{businessName}</div>
          <a href="#contact" className="bg-amber-400 text-black px-5 py-2.5 rounded-lg text-sm font-black hover:bg-amber-300 transition-colors">
            BOOK NOW
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-950" />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-block bg-amber-400 text-black text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded mb-6">
            {category}
          </div>
          <h1 className="text-6xl sm:text-8xl font-black text-white leading-none mb-6 uppercase">
            {businessName}
          </h1>
          <p className="text-indigo-300 text-xl max-w-xl mb-10 leading-relaxed">{description}</p>
          <div className="flex gap-4">
            <a href="#contact" className="bg-amber-400 text-black px-8 py-4 rounded-xl font-black text-lg hover:bg-amber-300 transition-colors uppercase">
              Get started
            </a>
            <a href="#services" className="border-2 border-indigo-700 text-white px-8 py-4 rounded-xl font-black text-lg hover:border-amber-400 transition-colors uppercase">
              Services
            </a>
          </div>
        </div>
        <div className="absolute -right-20 top-0 bottom-0 w-96 bg-amber-400/10 transform skew-x-12" />
      </section>

      {/* Image strip */}
      {images.length > 0 && (
        <div className="relative h-64 overflow-hidden">
          <Image src={images[0]} alt={businessName} fill className="object-cover opacity-60" sizes="1200px" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-transparent to-indigo-950" />
        </div>
      )}

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-1 bg-amber-400" />
            <h2 className="text-3xl font-black text-white uppercase">What we do</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <div key={i} className="bg-indigo-900 border border-indigo-800 rounded-xl p-6 hover:border-amber-400 transition-colors group">
                <div className="text-amber-400 font-black text-4xl mb-3 group-hover:scale-110 transition-transform origin-left">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-white font-bold text-lg">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section id="gallery" className="py-20 px-6 border-t border-indigo-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-1 bg-amber-400" />
              <h2 className="text-3xl font-black text-white uppercase">Gallery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.slice(1).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image src={url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="400px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-indigo-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-amber-400" />
              <h2 className="text-3xl font-black text-white uppercase">Let's talk</h2>
            </div>
            <div className="space-y-4">
              {phone && <div className="text-indigo-300 text-lg">{formatPhone(phone)}</div>}
              {email && <div className="text-indigo-300">{email}</div>}
              {address && <div className="text-indigo-300">{address}, {city}</div>}
            </div>
          </div>
          <div className="bg-indigo-900 rounded-2xl p-6">
            <ContactForm siteId={slug} theme="dark" accentColor="amber" />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-indigo-700 text-sm border-t border-indigo-900">
        © {new Date().getFullYear()} {businessName}
      </footer>
    </div>
  )
}

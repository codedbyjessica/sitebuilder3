import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function ClassicTemplate({ data }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, hours, slug } = data

  const hourEntries = Object.entries(hours).filter(([, v]) => v)

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top bar */}
      <div className="bg-blue-950 text-blue-300 py-2 px-6 text-center text-xs">
        {phone && <span>Call us: <a href={`tel:${phone}`} className="text-yellow-500 hover:underline">{formatPhone(phone)}</a></span>}
        {email && phone && <span className="mx-3">·</span>}
        {email && <span>Email: <a href={`mailto:${email}`} className="text-yellow-500 hover:underline">{email}</a></span>}
      </div>

      {/* Header */}
      <header className="bg-blue-900">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-white text-2xl font-bold">{businessName}</div>
            <div className="text-yellow-500 text-sm mt-1">{category}</div>
          </div>
          <nav className="flex gap-6 text-blue-200 text-sm font-medium">
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
            {images.length > 0 && <a href="#gallery" className="hover:text-yellow-400 transition-colors">Gallery</a>}
            <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="bg-yellow-500 text-blue-950 px-5 py-2.5 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
            Contact Us
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {images[0] ? (
          <div className="relative h-96">
            <Image src={images[0]} alt={businessName} fill className="object-cover" sizes="1200px" />
            <div className="absolute inset-0 bg-blue-950/70" />
            <div className="relative h-full flex items-center justify-center text-center px-6">
              <div>
                <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">{businessName}</h1>
                <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">{description}</p>
                <a href="#contact" className="inline-block bg-yellow-500 text-blue-950 px-8 py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-800 py-24 px-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">{businessName}</h1>
            <p className="text-blue-200 text-lg max-w-xl mx-auto mb-8">{description}</p>
            <a href="#contact" className="inline-block bg-yellow-500 text-blue-950 px-8 py-3 rounded font-bold hover:bg-yellow-400 transition-colors">
              Request a Quote
            </a>
          </div>
        )}
      </section>

      {/* Feature bar */}
      <div className="bg-yellow-500 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-sm font-bold text-blue-950">
          <span>✓ Professional Service</span>
          <span>✓ Free Consultation</span>
          <span>✓ Satisfaction Guaranteed</span>
        </div>
      </div>

      {/* About */}
      <section id="about" className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">About Us</h2>
            <div className="w-12 h-1 bg-yellow-500 mb-6" />
            <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
            {address && (
              <div className="mt-6 flex items-start gap-3 text-gray-600">
                <span className="text-yellow-600 mt-1">📍</span>
                <span>{address}, {city}</span>
              </div>
            )}
          </div>
          {images[1] ? (
            <div className="relative h-72 rounded-lg overflow-hidden shadow-lg border-4 border-blue-100">
              <Image src={images[1]} alt="" fill className="object-cover" sizes="600px" />
            </div>
          ) : (
            <div className="h-72 bg-blue-50 rounded-lg border-4 border-blue-100 flex items-center justify-center text-blue-200 text-6xl">
              🏢
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Our Services</h2>
            <div className="w-12 h-1 bg-yellow-500 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center text-yellow-400 font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-blue-900 text-lg">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 2 && (
        <section id="gallery" className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Gallery</h2>
              <div className="w-12 h-1 bg-yellow-500 mx-auto" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.slice(2).map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <Image src={url} alt="" fill className="object-cover" sizes="400px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours + Contact */}
      <section id="contact" className="py-16 px-6 bg-blue-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Contact Us</h2>
            <div className="w-12 h-1 bg-yellow-500 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-blue-200 space-y-4">
              {phone && <div><div className="text-yellow-500 text-xs uppercase font-bold tracking-wider mb-1">Phone</div><a href={`tel:${phone}`} className="hover:text-white">{formatPhone(phone)}</a></div>}
              {email && <div><div className="text-yellow-500 text-xs uppercase font-bold tracking-wider mb-1">Email</div><a href={`mailto:${email}`} className="hover:text-white">{email}</a></div>}
              {address && <div><div className="text-yellow-500 text-xs uppercase font-bold tracking-wider mb-1">Address</div><span>{address}<br />{city}</span></div>}
              {hourEntries.length > 0 && (
                <div>
                  <div className="text-yellow-500 text-xs uppercase font-bold tracking-wider mb-2">Hours</div>
                  {hourEntries.map(([day, time]) => (
                    <div key={day} className="flex justify-between text-xs py-1 border-b border-blue-800">
                      <span className="capitalize">{day}</span>
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2 bg-blue-800 rounded-lg p-6">
              <ContactForm siteId={slug} theme="dark" accentColor="yellow" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-blue-950 py-6 text-center text-blue-600 text-sm">
        © {new Date().getFullYear()} {businessName} · All Rights Reserved
      </footer>
    </div>
  )
}

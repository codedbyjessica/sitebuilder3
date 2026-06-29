import type { TemplateProps } from '../types'
import ContactForm from '@/components/site/ContactForm'
import Image from 'next/image'
import { formatPhone } from '@/lib/utils'

export default function FriendlyTemplate({ data }: TemplateProps) {
  const { businessName, category, description, services, phone, email, address, city, images, hours, slug } = data

  const hourEntries = Object.entries(hours).filter(([, v]) => v)

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Nav */}
      <header className="bg-white border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900 text-xl">{businessName}</div>
            <div className="text-orange-500 text-xs font-medium">{category}</div>
          </div>
          <nav className="hidden md:flex gap-6 text-gray-500 text-sm font-medium">
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            {images.length > 0 && <a href="#gallery" className="hover:text-orange-500 transition-colors">Gallery</a>}
            <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-400 transition-colors">
            Say hello 👋
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <span>⭐</span> {category}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {businessName}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{description}</p>
            <div className="flex gap-3">
              <a href="#contact" className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-400 transition-colors">
                Get in touch
              </a>
              <a href="#services" className="bg-white border border-orange-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors">
                See services
              </a>
            </div>
          </div>
          {images[0] ? (
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl">
              <Image src={images[0]} alt={businessName} fill className="object-cover" sizes="600px" />
            </div>
          ) : (
            <div className="h-80 bg-orange-100 rounded-3xl flex items-center justify-center text-6xl">
              🎨
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What I offer</h2>
            <p className="text-gray-500">Services designed with you in mind</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-amber-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-3xl mb-3">
                  {['🎨', '🎉', '✏️', '🌟', '🎭', '🖌️'][i % 6]}
                </div>
                <h3 className="font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 1 && (
        <section id="gallery" className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">My work</h2>
              <p className="text-gray-500">A peek at what we create together</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.slice(1).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                  <Image src={url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="400px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours if available */}
      {hourEntries.length > 0 && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hours</h2>
            <div className="max-w-sm mx-auto divide-y divide-gray-100">
              {hourEntries.map(([day, time]) => (
                <div key={day} className="flex justify-between py-3 text-sm">
                  <span className="capitalize font-medium text-gray-700">{day}</span>
                  <span className="text-gray-500">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-16 px-6 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's connect! 💬</h2>
            <p className="text-gray-500">I'd love to hear from you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            <div className="space-y-4">
              {phone && (
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Phone</div>
                    <a href={`tel:${phone}`} className="font-semibold text-gray-800">{formatPhone(phone)}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Email</div>
                    <a href={`mailto:${email}`} className="font-semibold text-gray-800">{email}</a>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Location</div>
                    <div className="font-semibold text-gray-800">{city}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ContactForm siteId={slug} theme="friendly" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm bg-white border-t border-orange-100">
        Made with ❤️ · © {new Date().getFullYear()} {businessName}
      </footer>
    </div>
  )
}

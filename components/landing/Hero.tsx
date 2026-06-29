import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              No code required
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
            Your business
            <br />
            <span className="text-indigo-600">online in minutes</span>
          </h1>

          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Enter your business info, pick a template, and publish a professional website.
            No design skills needed. Built for local businesses.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Build your site free
              </Button>
            </Link>
            <Link href="#templates">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                See templates
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            No credit card required &middot; Free to start &middot; Publish instantly
          </p>
        </div>

        {/* Browser mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-gray-400 border border-gray-200">
                jessy-zee-art.sitebuilder.com
              </div>
            </div>

            {/* Preview content */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">
                    Kids Art Teacher
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Jessy Zee Art</h2>
                  <p className="text-gray-600">
                    Inspiring young artists through private lessons, creative workshops, and memorable art parties.
                  </p>
                  <div className="mt-6 flex gap-3 justify-center">
                    <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium">
                      Book a lesson
                    </div>
                    <div className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-medium">
                      View gallery
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: 'Private Lessons', emoji: '🎨' },
                    { title: 'Birthday Parties', emoji: '🎉' },
                    { title: 'Workshops', emoji: '✏️' },
                  ].map((s) => (
                    <div key={s.title} className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="text-2xl mb-2">{s.emoji}</div>
                      <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</div>
            <div>
              <div className="text-xs font-semibold text-gray-900">Site published!</div>
              <div className="text-xs text-gray-400">2 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

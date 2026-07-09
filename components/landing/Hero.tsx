import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 bg-paper overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1 text-sm text-ink/70 mb-8">
            <span>🍁</span> Made in Canada
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink leading-[1.05] tracking-tight">
            A little website for
            <br />
            your <em className="text-maple">small business</em>
          </h1>

          <p className="mt-6 text-xl text-ink/60">
            Live in minutes. $12 a year.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="inline-flex justify-center items-center bg-maple text-paper font-medium px-8 py-3.5 rounded-full hover:bg-maple-deep transition-colors"
            >
              Build your site
            </Link>
            <Link
              href="#themes"
              className="inline-flex justify-center items-center border border-ink/20 text-ink font-medium px-8 py-3.5 rounded-full hover:border-ink/40 transition-colors"
            >
              See the looks
            </Link>
          </div>
        </div>

        {/* Browser mockup */}
        <div className="mt-20 relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_24px_60px_-20px_rgba(33,31,26,0.25)] border border-ink/10 overflow-hidden">
            <div className="bg-paper border-b border-ink/10 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-ink/15" />
                <div className="w-3 h-3 rounded-full bg-ink/15" />
                <div className="w-3 h-3 rounded-full bg-ink/15" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-ink/40 border border-ink/10">
                jessy-zee-art.sitelit.ca
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-xs font-semibold tracking-widest text-orange-600 uppercase mb-2">
                    Kids Art Teacher
                  </div>
                  <h2 className="font-display text-4xl font-semibold text-gray-900 mb-3">Jessy Zee Art</h2>
                  <p className="text-gray-600">
                    Private lessons, creative workshops, and art parties for kids.
                  </p>
                  <div className="mt-6 flex gap-3 justify-center">
                    <div className="bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium">
                      Book a lesson
                    </div>
                    <div className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-medium">
                      View gallery
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['Private Lessons', 'Birthday Parties', 'Workshops'].map((title) => (
                    <div key={title} className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="text-sm font-semibold text-gray-800">{title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2.5 bg-white rounded-xl shadow-lg border border-ink/10 px-4 py-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold">✓</div>
            <div>
              <div className="text-xs font-semibold text-ink">Site published</div>
              <div className="text-xs text-ink/40">2 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

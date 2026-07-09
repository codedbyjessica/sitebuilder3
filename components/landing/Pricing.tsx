import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
            One price
          </h2>
          <p className="mt-4 text-lg text-ink/60">In Canadian dollars, of course.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Main plan */}
          <div className="md:col-span-2 bg-ink rounded-3xl p-8 sm:p-10 text-paper">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-6xl font-semibold">$12</span>
              <span className="text-paper/60 text-lg">/year per site</span>
            </div>
            <p className="text-paper/60 mb-8">Everything included.</p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
              {[
                'Every theme',
                'Photo gallery',
                'Contact form',
                'Mobile-friendly',
                'SSL certificate',
                'Analytics',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-paper/80">
                  <span className="text-maple">✓</span>
                  {f}
                </div>
              ))}
            </div>

            <Link
              href="/app"
              className="inline-flex justify-center items-center bg-maple text-paper font-medium px-8 py-3 rounded-full hover:bg-maple-deep transition-colors w-full sm:w-auto"
            >
              Get started
            </Link>
          </div>

          {/* Add-ons */}
          <div className="flex flex-col gap-4">
            <div className="bg-paper border border-ink/10 rounded-3xl p-6 flex-1">
              <div className="text-sm text-ink/50 mb-2">Setup service</div>
              <div className="font-display text-3xl font-semibold text-ink">
                $35 <span className="text-sm font-sans font-normal text-ink/40">one time</span>
              </div>
              <p className="mt-3 text-sm text-ink/60">
                Send us your info. We build it.
              </p>
            </div>

            <div className="bg-paper border border-ink/10 rounded-3xl p-6 flex-1">
              <div className="text-sm text-ink/50 mb-2">Custom domain</div>
              <div className="font-display text-3xl font-semibold text-ink">
                $15 <span className="text-sm font-sans font-normal text-ink/40">/year</span>
              </div>
              <p className="mt-3 text-sm text-ink/60">
                yourbusiness.com, yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

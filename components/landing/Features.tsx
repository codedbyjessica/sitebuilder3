const steps = [
  { num: '1', title: 'Fill in your details', description: 'Name, services, hours, contact.' },
  { num: '2', title: 'Pick a style', description: 'Choose a look that fits.' },
  { num: '3', title: 'Add photos', description: 'Show your work or your space.' },
  { num: '4', title: 'Publish', description: 'Live on your own URL.' },
]

const included = [
  'Every theme',
  'Photo gallery',
  'Contact form',
  'Mobile-friendly',
  'SSL certificate',
  'Analytics',
]

export default function Features() {
  return (
    <section id="how" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink text-center tracking-tight mb-16">
          How it works
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-24">
          {steps.map((step) => (
            <div key={step.num}>
              <div className="font-display text-5xl text-maple/30 font-semibold mb-4">{step.num}</div>
              <h3 className="text-lg font-semibold text-ink mb-1">{step.title}</h3>
              <p className="text-sm text-ink/50">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 pt-14 flex flex-col lg:flex-row gap-10 lg:items-start">
          <h2 className="font-display text-3xl font-semibold text-ink tracking-tight lg:w-1/3 shrink-0">
            Everything included
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 flex-1">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-ink/70">
                <span className="text-maple font-bold">✓</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

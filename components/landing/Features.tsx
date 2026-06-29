const steps = [
  {
    num: '01',
    title: 'Enter your business info',
    description: 'Business name, services, location, hours, and contact details.',
    icon: '📝',
  },
  {
    num: '02',
    title: 'Choose a template',
    description: 'Pick from 6 professionally designed styles that match your brand.',
    icon: '🎨',
  },
  {
    num: '03',
    title: 'Upload your photos',
    description: 'Add images of your work, your space, or your team.',
    icon: '📸',
  },
  {
    num: '04',
    title: 'Publish instantly',
    description: 'Your site goes live on your own custom URL in seconds.',
    icon: '🚀',
  },
]

const highlights = [
  { icon: '📱', title: 'Mobile-first design', desc: 'Every template looks great on phones and tablets.' },
  { icon: '🔍', title: 'SEO built-in', desc: 'Automatic meta tags, structured data, and fast loading.' },
  { icon: '📬', title: 'Contact forms', desc: 'Inquiries go straight to your dashboard.' },
  { icon: '🖼️', title: 'Photo gallery', desc: 'Showcase your work with a beautiful image gallery.' },
  { icon: '⚡', title: 'Fast publishing', desc: 'From signup to live website in under 5 minutes.' },
  { icon: '🔒', title: 'Secure hosting', desc: 'SSL certificate and reliable cloud infrastructure included.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            From zero to professional website in four simple steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2">
                Step {step.num}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            All the essentials to get your local business online.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((h) => (
            <div key={h.title} className="flex gap-4 p-6 rounded-xl bg-gray-50">
              <div className="text-3xl flex-shrink-0">{h.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{h.title}</h3>
                <p className="text-sm text-gray-500">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

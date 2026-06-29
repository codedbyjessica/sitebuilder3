import Link from 'next/link'
import Button from '@/components/ui/Button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get your first website live with no cost.',
    features: [
      '1 website',
      'sitebuilder.com subdomain',
      'All 6 templates',
      'Contact form',
      'Mobile-friendly',
      'SSL certificate',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For businesses that want more power and branding.',
    features: [
      '5 websites',
      'Custom domain support',
      'Remove SiteBuilder branding',
      'Priority support',
      'Analytics dashboard',
      'All Free features',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$29',
    period: 'per month',
    description: 'For agencies managing multiple clients.',
    features: [
      'Unlimited websites',
      'White-label ready',
      'Client management',
      'Advanced analytics',
      'API access',
      'All Pro features',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple, honest pricing</h2>
          <p className="mt-4 text-lg text-gray-500">
            Start free. Upgrade when your business is ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 shadow-xl'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              <div className="mb-6">
                <div className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-gray-400'}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-green-500'}`}>✓</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/app">
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

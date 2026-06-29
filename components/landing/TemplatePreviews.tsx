import Link from 'next/link'
import { TEMPLATES } from '@/lib/types'
import Button from '@/components/ui/Button'

function TemplatePreviewCard({ template }: { template: typeof TEMPLATES[0] }) {
  const previewStyles: Record<string, { bg: string; accent: string; text: string; card: string }> = {
    modern: { bg: 'bg-slate-900', accent: 'bg-indigo-500', text: 'text-white', card: 'bg-slate-800' },
    minimal: { bg: 'bg-gray-50', accent: 'bg-gray-800', text: 'text-gray-900', card: 'bg-white' },
    bold: { bg: 'bg-indigo-950', accent: 'bg-amber-400', text: 'text-white', card: 'bg-indigo-900' },
    elegant: { bg: 'bg-stone-900', accent: 'bg-yellow-600', text: 'text-white', card: 'bg-stone-800' },
    friendly: { bg: 'bg-amber-50', accent: 'bg-orange-500', text: 'text-gray-900', card: 'bg-white' },
    classic: { bg: 'bg-blue-950', accent: 'bg-yellow-600', text: 'text-white', card: 'bg-blue-900' },
  }

  const style = previewStyles[template.id]

  return (
    <div className="group cursor-pointer">
      <div className={`${style.bg} rounded-2xl overflow-hidden aspect-[4/3] p-4 mb-3 transition-transform group-hover:-translate-y-1`}>
        {/* Mini nav */}
        <div className={`flex justify-between items-center mb-3 opacity-60`}>
          <div className={`text-[10px] font-bold ${style.text}`}>ACME Co.</div>
          <div className="flex gap-2">
            {['Home', 'About', 'Contact'].map(n => (
              <div key={n} className={`text-[8px] ${style.text} opacity-60`}>{n}</div>
            ))}
          </div>
        </div>
        {/* Hero block */}
        <div className="mb-3">
          <div className={`text-[11px] font-bold ${style.text} leading-tight`}>Professional</div>
          <div className={`text-[11px] font-bold ${style.text} leading-tight mb-1`}>Business Name</div>
          <div className={`text-[7px] ${style.text} opacity-50 mb-2`}>Services for your community</div>
          <div className={`${style.accent} rounded px-2 py-1 text-[7px] text-white font-medium inline-block`}>
            Get in touch
          </div>
        </div>
        {/* Cards row */}
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`${style.card} flex-1 rounded p-2`}>
              <div className={`text-[8px] font-medium ${style.text} opacity-70`}>Service {i}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">{template.name}</div>
            <div className="text-sm text-gray-500">{template.description}</div>
          </div>
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: template.accentColor }}
          />
        </div>
      </div>
    </div>
  )
}

export default function TemplatePreviews() {
  return (
    <section id="templates" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            6 beautiful templates
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Each one is fully responsive, SEO-optimized, and customized with your content.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((template) => (
            <TemplatePreviewCard key={template.id} template={template} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/app">
            <Button size="lg">Choose a template and get started</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

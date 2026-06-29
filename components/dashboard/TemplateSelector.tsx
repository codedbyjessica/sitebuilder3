'use client'

import { TEMPLATES, TemplateId } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TemplateSelectorProps {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

const previewStyles: Record<TemplateId, { bg: string; accent: string; text: string; card: string }> = {
  modern: { bg: 'bg-slate-900', accent: 'bg-indigo-500', text: 'text-white', card: 'bg-slate-800' },
  minimal: { bg: 'bg-gray-50', accent: 'bg-gray-800', text: 'text-gray-900', card: 'bg-white' },
  bold: { bg: 'bg-indigo-950', accent: 'bg-amber-400', text: 'text-white', card: 'bg-indigo-900' },
  elegant: { bg: 'bg-stone-900', accent: 'bg-yellow-600', text: 'text-white', card: 'bg-stone-800' },
  friendly: { bg: 'bg-amber-50', accent: 'bg-orange-500', text: 'text-gray-900', card: 'bg-white' },
  classic: { bg: 'bg-blue-950', accent: 'bg-yellow-600', text: 'text-white', card: 'bg-blue-900' },
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TEMPLATES.map((template) => {
        const style = previewStyles[template.id]
        const isSelected = value === template.id

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={cn(
              'text-left rounded-xl border-2 overflow-hidden transition-all hover:-translate-y-0.5',
              isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-100 hover:border-gray-300'
            )}
          >
            {/* Mini preview */}
            <div className={`${style.bg} p-3 aspect-video`}>
              <div className="flex justify-between items-center mb-2 opacity-60">
                <div className={`text-[8px] font-bold ${style.text}`}>Business</div>
                <div className="flex gap-1">
                  {['Home', 'About'].map(n => (
                    <div key={n} className={`text-[6px] ${style.text} opacity-60`}>{n}</div>
                  ))}
                </div>
              </div>
              <div className={`text-[10px] font-bold ${style.text} mb-1`}>Business Name</div>
              <div className={`text-[6px] ${style.text} opacity-50 mb-2`}>Your tagline here</div>
              <div className={`${style.accent} rounded px-1.5 py-0.5 text-[6px] text-white font-medium inline-block mb-2`}>
                Contact us
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`${style.card} flex-1 rounded p-1`}>
                    <div className={`text-[6px] font-medium ${style.text} opacity-70`}>Service</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

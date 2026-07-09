'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import TemplateSelector from '@/components/dashboard/TemplateSelector'
import SectionEditor from '@/components/dashboard/SectionEditor'
import { saveDraft } from '@/lib/siteStore'
import { normalizeSite } from '@/lib/legacyAdapter'
import { getAuthUser } from '@/lib/amplify/client'
import { slugify } from '@/lib/utils'
import type { TemplateId, LayoutId, FontId, SiteSection } from '@/lib/types'

const STEPS = ['Business info', 'Sections', 'Template', 'Review']

interface FormData {
  businessName: string
  category: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  contactTitle: string
  sections: SiteSection[]
  layout: LayoutId
  template: TemplateId
  fontId: FontId
}

const DEFAULT_FORM: FormData = {
  businessName: '',
  category: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  contactTitle: '',
  sections: [],
  layout: 'minimal',
  template: 'cloud',
  fontId: 'classic',
}

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [siteId] = useState(() => crypto.randomUUID())
  const [userId, setUserId] = useState('')
  const router = useRouter()

  useEffect(() => {
    getAuthUser().then((u) => { if (u) setUserId(u.userId) })
  }, [])

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function canProceed(): boolean {
    if (step === 0) return !!form.businessName.trim()
    return true
  }

  function handleSaveDraft() {
    // Build the flat wizard shape, then let normalizeSite construct the canonical Site (blocks).
    const site = normalizeSite({
      id: siteId,
      userId,
      slug: slugify(form.businessName),
      ...form,
      published: false,
      createdAt: new Date().toISOString(),
    })
    saveDraft(site)
    router.push(`/app/edit/${siteId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? 'bg-maple text-white'
                    : i === step
                    ? 'bg-maple-light text-maple ring-2 ring-maple'
                    : 'bg-ink/8 text-ink/40'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 w-8 ${i < step ? 'bg-maple' : 'bg-ink/8'}`} />
              )}
            </div>
          ))}
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">{STEPS[step]}</h1>
        <p className="text-sm text-ink/50 mt-1">Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* Step 0: Business info */}
      {step === 0 && (
        <div className="space-y-5">
          <Input
            label="Business name *"
            value={form.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            placeholder="e.g. Jessy Zee Art"
          />
          <Input
            label="Business category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="e.g. Kids Art Teacher"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Tell visitors about your business in a few sentences..."
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(555) 000-0000" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Address" value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="123 Main St" />
            <Input label="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="Toronto, ON" />
          </div>
        </div>
      )}

      {/* Step 1: Sections */}
      {step === 1 && (
        <div>
          <p className="text-sm text-ink/50 mb-4">
            Add sections for your site — services, pricing, about, FAQ, whatever fits your business. You can skip this and add them later.
          </p>
          <SectionEditor
            sections={form.sections}
            onChange={(s) => updateField('sections', s)}
            siteId={siteId}
            userId={userId}
          />
        </div>
      )}

      {/* Step 2: Template */}
      {step === 2 && (
        <TemplateSelector
          layout={form.layout}
          theme={form.template}
          font={form.fontId}
          onLayoutChange={(l) => updateField('layout', l)}
          onThemeChange={(t) => updateField('template', t)}
          onFontChange={(f) => updateField('fontId', f)}
        />
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-paper rounded-xl p-5 space-y-3">
            {[
              ['Business', form.businessName],
              ['Category', form.category || '—'],
              ['Sections', `${form.sections.length} added`],
              ['Template', form.template],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-ink/50">{label}</span>
                <span className="font-medium capitalize">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink/50">
            Your site saves as a draft. You can preview it and publish when you're ready — publishing requires signing in.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSaveDraft}>
            Save and Review
          </Button>
        )}
      </div>
    </div>
  )
}

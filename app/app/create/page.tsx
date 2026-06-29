'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthUser } from '@/lib/amplify/client'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import TemplateSelector from '@/components/dashboard/TemplateSelector'
import ImageUpload from '@/components/dashboard/ImageUpload'
import type { TemplateId, SiteHours } from '@/lib/types'

const STEPS = ['Business info', 'Services', 'Template', 'Photos', 'Review']

const DAYS: (keyof SiteHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

interface FormData {
  businessName: string
  category: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  services: string[]
  hours: SiteHours
  template: TemplateId
  images: string[]
}

const DEFAULT_FORM: FormData = {
  businessName: '',
  category: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  services: ['', '', ''],
  hours: {},
  template: 'modern',
  images: [],
}

export default function CreatePage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [siteId] = useState(() => crypto.randomUUID())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateService(i: number, val: string) {
    const updated = [...form.services]
    updated[i] = val
    updateField('services', updated)
  }

  function addService() {
    updateField('services', [...form.services, ''])
  }

  function removeService(i: number) {
    updateField('services', form.services.filter((_, idx) => idx !== i))
  }

  function updateHour(day: keyof SiteHours, val: string) {
    updateField('hours', { ...form.hours, [day]: val })
  }

  function canProceed(): boolean {
    if (step === 0) return !!form.businessName.trim()
    if (step === 1) return form.services.some((s) => s.trim())
    return true
  }

  async function handlePublish() {
    setSaving(true)
    setError('')
    try {
      const user = await getAuthUser()
      if (!user) throw new Error('Not authenticated')

      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.userId,
        },
        body: JSON.stringify({
          ...form,
          services: form.services.filter((s) => s.trim()),
          published: false,
        }),
      })

      if (!res.ok) throw new Error('Failed to create site')
      const { site } = await res.json()
      router.push(`/app/edit/${site.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSaving(false)
    }
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
                    ? 'bg-indigo-600 text-white'
                    : i === step
                    ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 w-8 ${i < step ? 'bg-indigo-600' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{STEPS[step]}</h1>
        <p className="text-sm text-gray-500 mt-1">Step {step + 1} of {STEPS.length}</p>
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
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="(555) 000-0000"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Main St"
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="New York, NY"
            />
          </div>
        </div>
      )}

      {/* Step 1: Services + Hours */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Services *</div>
            <div className="space-y-3">
              {form.services.map((service, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={service}
                    onChange={(e) => updateService(i, e.target.value)}
                    placeholder={`Service ${i + 1} (e.g. Private lessons)`}
                    className="flex-1"
                  />
                  {form.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      className="text-gray-400 hover:text-red-500 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addService}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Add another service
            </button>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Hours (optional)</div>
            <div className="space-y-2">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-24 text-sm capitalize text-gray-600">{day}</div>
                  <Input
                    value={form.hours[day] || ''}
                    onChange={(e) => updateHour(day, e.target.value)}
                    placeholder="e.g. 9am – 5pm or Closed"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Template */}
      {step === 2 && (
        <TemplateSelector
          value={form.template}
          onChange={(t) => updateField('template', t)}
        />
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Upload photos of your work, your space, or your team. These will appear in your website gallery.
          </p>
          <ImageUpload
            siteId={siteId}
            images={form.images}
            onImagesChange={(imgs) => updateField('images', imgs)}
          />
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Business</span>
              <span className="font-medium">{form.businessName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{form.category || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Services</span>
              <span className="font-medium">{form.services.filter(Boolean).length} listed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Template</span>
              <span className="font-medium capitalize">{form.template}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Photos</span>
              <span className="font-medium">{form.images.length} uploaded</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <p className="text-sm text-gray-500">
            Your site will be saved as a draft. You can preview and publish it from the editor.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            Continue
          </Button>
        ) : (
          <Button onClick={handlePublish} loading={saving}>
            Save and edit site
          </Button>
        )}
      </div>
    </div>
  )
}

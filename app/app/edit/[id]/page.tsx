'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAuthUser } from '@/lib/amplify/client'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import TemplateSelector from '@/components/dashboard/TemplateSelector'
import ImageUpload from '@/components/dashboard/ImageUpload'
import { Badge } from '@/components/ui/Badge'
import type { BusinessData, SiteHours, TemplateId } from '@/lib/types'
import Link from 'next/link'

const DAYS: (keyof SiteHours)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const TABS = ['Info', 'Services', 'Template', 'Photos'] as const
type Tab = typeof TABS[number]

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [site, setSite] = useState<BusinessData | null>(null)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('Info')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      const user = await getAuthUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.userId)

      const res = await fetch(`/api/sites/${id}`, {
        headers: { 'x-user-id': user.userId },
      })
      if (!res.ok) { router.push('/app'); return }

      const { site } = await res.json()
      setSite(site)
      setLoading(false)
    }
    load()
  }, [id, router])

  function update<K extends keyof BusinessData>(key: K, value: BusinessData[K]) {
    setSite((prev) => prev ? { ...prev, [key]: value } : prev)
  }

  function updateService(i: number, val: string) {
    if (!site) return
    const updated = [...site.services]
    updated[i] = val
    update('services', updated)
  }

  function addService() {
    if (!site) return
    update('services', [...site.services, ''])
  }

  function removeService(i: number) {
    if (!site) return
    update('services', site.services.filter((_, idx) => idx !== i))
  }

  function updateHour(day: keyof SiteHours, val: string) {
    if (!site) return
    update('hours', { ...site.hours, [day]: val })
  }

  const handleSave = useCallback(async () => {
    if (!site) return
    setSaving(true)
    try {
      await fetch(`/api/sites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          ...site,
          services: site.services.filter((s) => s.trim()),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [site, id, userId])

  async function handlePublishToggle() {
    if (!site) return
    setPublishing(true)
    try {
      await fetch(`/api/sites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ published: !site.published }),
      })
      update('published', !site.published)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!site) return null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{site.businessName}</h1>
            <Badge variant={site.published ? 'success' : 'default'}>
              {site.published ? 'Live' : 'Draft'}
            </Badge>
          </div>
          {site.published && (
            <Link
              href={`/site/${site.slug}`}
              target="_blank"
              className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
            >
              /site/{site.slug} →
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          {site.published && (
            <Link href={`/site/${site.slug}`} target="_blank">
              <Button variant="secondary" size="sm">Preview site</Button>
            </Link>
          )}
          <Button
            variant={site.published ? 'secondary' : 'primary'}
            size="sm"
            onClick={handlePublishToggle}
            loading={publishing}
          >
            {site.published ? 'Unpublish' : 'Publish site'}
          </Button>
          <Button size="sm" onClick={handleSave} loading={saving}>
            {saved ? '✓ Saved' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Info' && (
        <div className="space-y-5">
          <Input label="Business name" value={site.businessName} onChange={(e) => update('businessName', e.target.value)} />
          <Input label="Category" value={site.category} onChange={(e) => update('category', e.target.value)} />
          <Textarea label="Description" value={site.description} onChange={(e) => update('description', e.target.value)} rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={site.phone} onChange={(e) => update('phone', e.target.value)} />
            <Input label="Email" type="email" value={site.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Address" value={site.address} onChange={(e) => update('address', e.target.value)} />
            <Input label="City" value={site.city} onChange={(e) => update('city', e.target.value)} />
          </div>
        </div>
      )}

      {activeTab === 'Services' && (
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Services</div>
            <div className="space-y-3">
              {site.services.map((service, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={service} onChange={(e) => updateService(i, e.target.value)} placeholder={`Service ${i + 1}`} className="flex-1" />
                  {site.services.length > 1 && (
                    <button type="button" onClick={() => removeService(i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addService} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              + Add service
            </button>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Business hours</div>
            <div className="space-y-2">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-24 text-sm capitalize text-gray-600">{day}</div>
                  <Input
                    value={site.hours[day] || ''}
                    onChange={(e) => updateHour(day, e.target.value)}
                    placeholder="9am – 5pm or Closed"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Template' && (
        <TemplateSelector
          value={site.template as TemplateId}
          onChange={(t) => update('template', t)}
        />
      )}

      {activeTab === 'Photos' && (
        <ImageUpload
          siteId={id}
          images={images}
          onImagesChange={setImages}
        />
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          {saved ? '✓ Saved' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}

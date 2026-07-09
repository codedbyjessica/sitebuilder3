'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAuthUser, configureAmplify } from '@/lib/amplify/client'
import { loadDraft, saveDraft, deleteDraft } from '@/lib/siteStore'
import { normalizeSite, siteToBusinessData } from '@/lib/legacyAdapter'
import { homePage, type Site, type Block } from '@/lib/schema'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import TemplateSelector from '@/components/dashboard/TemplateSelector'
import BlockEditor from '@/components/dashboard/BlockEditor'
import CtaEditor from '@/components/dashboard/CtaEditor'
import SlugInput from '@/components/dashboard/SlugInput'
import { Badge } from '@/components/ui/Badge'
import type { TemplateId, LayoutId, FontId } from '@/lib/types'
import Link from 'next/link'

const TABS = ['Content', 'Design', 'Settings'] as const
type Tab = typeof TABS[number]

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [site, setSite] = useState<Site | null>(null)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('Content')
  const isInitialized = useRef(false)

  useEffect(() => {
    configureAmplify()

    async function load() {
      const draft = loadDraft(id)
      if (draft) {
        setSite(draft)
        setLoading(false)
      }

      const user = await getAuthUser()
      if (user) {
        setUserId(user.userId)
        if (!draft) {
          const siteRes = await fetch(`/api/sites/${id}`, { headers: { 'x-user-id': user.userId } })
          if (siteRes.ok) {
            const { site: raw } = await siteRes.json()
            setSite(normalizeSite(raw))
          } else {
            router.push('/app')
            return
          }
          setLoading(false)
        }
      } else if (!draft) {
        router.push('/app')
      }
    }
    load()
  }, [id, router])

  function patchSite(patch: Partial<Site>) {
    setSite((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  function setBlocks(blocks: Block[]) {
    setSite((prev) => {
      if (!prev) return prev
      const home = prev.pages.find((p) => p.isHome) ?? prev.pages[0]
      return { ...prev, pages: prev.pages.map((p) => (p.id === home.id ? { ...p, blocks } : p)) }
    })
  }

  // Auto-save on change (debounced). isInitialized guard prevents a save on the initial load.
  useEffect(() => {
    if (!site) return
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    const timer = setTimeout(async () => {
      setSaving(true)
      const ok = saveDraft(site)
      if (!ok) {
        setSaveError('Draft could not be saved — storage may be full')
        setSaving(false)
        return
      }
      setSaveError(null)

      if (userId && site.published) {
        await fetch(`/api/sites/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
          body: JSON.stringify(siteToBusinessData(site)),
        }).catch(() => {})
      }

      setSaved(true)
      setSaving(false)
      setTimeout(() => setSaved(false), 1500)
    }, 1000)
    return () => clearTimeout(timer)
  }, [site, id, userId])

  async function handlePublish() {
    if (!site) return

    const user = await getAuthUser()
    if (!user) {
      router.push(`/login?publish=${id}`)
      return
    }

    setPublishing(true)
    try {
      const payload = siteToBusinessData({ ...site, userId: user.userId, published: true })

      const existing = await fetch(`/api/sites/${id}`, { headers: { 'x-user-id': user.userId } })
      let res: Response
      if (existing.ok) {
        res = await fetch(`/api/sites/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-user-id': user.userId },
          body: JSON.stringify({ published: true }),
        })
      } else {
        res = await fetch('/api/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': user.userId },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        patchSite({ published: true })
        setUserId(user.userId)
        deleteDraft(id)
      }
    } finally {
      setPublishing(false)
    }
  }

  async function handleUnpublish() {
    if (!site || !userId) return
    setPublishing(true)
    try {
      const res = await fetch(`/api/sites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ published: false }),
      })
      if (res.ok) patchSite({ published: false })
    } finally {
      setPublishing(false)
    }
  }

  const handleSlugChange = useCallback((slug: string) => {
    setSite((prev) => (prev ? { ...prev, slug } : prev))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-ink/40">Loading...</div>
      </div>
    )
  }

  if (!site) return null

  const isPublished = !!site.published
  const page = homePage(site)

  const anchors = [
    ...page.blocks
      .filter((b) => b.type === 'list' || b.type === 'richtext')
      .filter((b) => 'title' in b && b.title.trim())
      .map((b) => ({ href: `#section-${b.id}`, label: b.navTitle || ('title' in b ? b.title : '') })),
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">{site.businessName || 'Untitled'}</h1>
            <Badge variant={isPublished ? 'success' : 'default'}>
              {isPublished ? 'Live' : 'Draft'}
            </Badge>
          </div>
          {isPublished && site.slug && (
            <Link href={`/site/${site.slug}`} target="_blank" className="text-sm text-maple hover:underline mt-1 inline-block">
              /site/{site.slug} →
            </Link>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {saved && <span className="text-xs text-green-600 font-medium">Saved</span>}
          {saveError && <span className="text-xs text-red-500 font-medium">{saveError}</span>}
          {saving ? (
            <Button variant="secondary" size="sm" disabled>Preview</Button>
          ) : (
            <Link href={`/preview/${id}`} target="_blank">
              <Button variant="secondary" size="sm">Preview</Button>
            </Link>
          )}
          {isPublished && site.slug && (
            saving ? (
              <Button variant="secondary" size="sm" disabled>View site</Button>
            ) : (
              <Link href={`/site/${site.slug}`} target="_blank">
                <Button variant="secondary" size="sm">View site</Button>
              </Link>
            )
          )}
          {isPublished ? (
            <Button variant="secondary" size="sm" onClick={handleUnpublish} loading={publishing || saving} disabled={saving}>
              Unpublish
            </Button>
          ) : (
            <Button size="sm" onClick={handlePublish} loading={publishing || saving} disabled={saving}>
              Publish
            </Button>
          )}
        </div>
      </div>

      {!userId && !isPublished && (
        <div className="mb-6 bg-maple-light border border-maple/15 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-maple-deep">
            Your site is saved locally. Sign in to publish it live.
          </p>
          <Link href={`/login?publish=${id}`}>
            <Button size="sm">Sign in to publish</Button>
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-ink/8 rounded-lg mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white text-ink shadow-sm' : 'text-ink/50 hover:text-ink/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Content' && (
        <BlockEditor
          blocks={page.blocks}
          onChange={setBlocks}
          siteId={id}
          userId={userId}
          businessName={site.businessName}
        />
      )}

      {activeTab === 'Design' && (
        <TemplateSelector
          layout={(site.layout as LayoutId) || 'minimal'}
          theme={(site.themeId as TemplateId) || 'cloud'}
          font={(site.fontId as FontId) || 'classic'}
          onLayoutChange={(l) => patchSite({ layout: l })}
          onThemeChange={(t) => patchSite({ themeId: t })}
          onFontChange={(f) => patchSite({ fontId: f })}
        />
      )}

      {activeTab === 'Settings' && (
        <div className="space-y-6">
          <div className="p-5 border border-ink/10 rounded-xl bg-paper">
            <SlugInput value={site.slug} siteId={id} onChange={handleSlugChange} />
          </div>

          <Input label="Business name" value={site.businessName || ''} onChange={(e) => patchSite({ businessName: e.target.value })} />
          <Input label="Category / tagline (optional)" value={site.category || ''} onChange={(e) => patchSite({ category: e.target.value })} />
          <Textarea label="Description (optional)" value={site.description || ''} rows={3} onChange={(e) => patchSite({ description: e.target.value })} />

          <div className="border-t border-ink/10 pt-5">
            <p className="text-xs font-medium text-ink/50 mb-3">Nav buttons</p>
            <CtaEditor
              value={site.nav.ctas || []}
              onChange={(ctas) => patchSite({ nav: { ctas } })}
              anchors={anchors}
              noun="nav button"
            />
          </div>

          <div className="border-t border-ink/10 pt-5">
            <Input
              label="Footer copy"
              value={site.footer.copy ?? `© ${new Date().getFullYear()} ${site.businessName}`}
              onChange={(e) => patchSite({ footer: { copy: e.target.value } })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

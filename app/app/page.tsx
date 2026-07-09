'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAuthUser, configureAmplify } from '@/lib/amplify/client'
import { listDraftIds, loadDraft } from '@/lib/siteStore'
import { normalizeSite } from '@/lib/legacyAdapter'
import SiteCard from '@/components/dashboard/SiteCard'
import Button from '@/components/ui/Button'
import type { Site } from '@/lib/schema'

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    configureAmplify()

    async function load() {
      // Local drafts — always visible (loadDraft returns canonical Site)
      const draftIds = listDraftIds()
      const drafts = draftIds.map((id) => loadDraft(id)).filter(Boolean) as Site[]

      const user = await getAuthUser()
      if (user) {
        setUserId(user.userId)
        // Fetch published sites from API (legacy flat records → normalize to Site)
        const res = await fetch('/api/sites', { headers: { 'x-user-id': user.userId } })
        if (res.ok) {
          const { sites: remote } = await res.json()
          const remoteSites = (remote as unknown[]).map(normalizeSite)
          // Merge: remote wins over local draft for same id
          const remoteIds = new Set(remoteSites.map((s) => s.id))
          const localOnly = drafts.filter((d) => !remoteIds.has(d.id))
          setSites([...remoteSites, ...localOnly])
        } else {
          setSites(drafts)
        }
      } else {
        setSites(drafts)
      }

      setLoading(false)
    }

    load()
  }, [])

  function handleDelete(id: string) {
    if (!confirm('Delete this website? This cannot be undone.')) return
    setSites((prev) => prev.filter((s) => s.id !== id))
    if (userId) {
      fetch(`/api/sites/${id}`, { method: 'DELETE', headers: { 'x-user-id': userId } }).catch(() => {})
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your websites</h1>
          <p className="text-sm text-ink/50 mt-1">
            {loading ? '' : sites.length === 0 ? 'No websites yet' : `${sites.length} website${sites.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/app/create">
          <Button>+ New website</Button>
        </Link>
      </div>

      {!userId && !loading && (
        <div className="mb-6 bg-paper border border-ink/10 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-ink/60">
            Sign in to publish your site and access it from any device.
          </p>
          <Link href="/login">
            <Button variant="secondary" size="sm">Sign in</Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-ink/10 p-6 animate-pulse">
              <div className="h-1.5 bg-ink/8 rounded-full mb-4" />
              <div className="h-4 bg-ink/8 rounded w-2/3 mb-2" />
              <div className="h-3 bg-ink/8 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-ink/15 rounded-2xl">
          <h3 className="font-display text-lg font-semibold text-ink mb-2">No websites yet</h3>
          <p className="text-ink/50 mb-6 max-w-sm mx-auto">
            Build your first professional website in minutes.
          </p>
          <Link href="/app/create">
            <Button size="lg">Create your first website</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

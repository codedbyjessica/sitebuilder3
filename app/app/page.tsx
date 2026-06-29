'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAuthUser } from '@/lib/amplify/client'
import SiteCard from '@/components/dashboard/SiteCard'
import Button from '@/components/ui/Button'
import type { BusinessData } from '@/lib/types'

export default function DashboardPage() {
  const [sites, setSites] = useState<BusinessData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    async function load() {
      const user = await getAuthUser()
      if (!user) return

      setUserId(user.userId)
      const res = await fetch('/api/sites', {
        headers: { 'x-user-id': user.userId },
      })
      if (res.ok) {
        const { sites } = await res.json()
        setSites(sites)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this website? This cannot be undone.')) return

    await fetch(`/api/sites/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    })
    setSites((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your websites</h1>
          <p className="text-sm text-gray-500 mt-1">
            {sites.length === 0 ? 'No websites yet' : `${sites.length} website${sites.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/app/create">
          <Button>+ New website</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-1.5 bg-gray-100 rounded-full mb-4" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No websites yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Build your first professional website in minutes. Just fill in your business details and choose a style.
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

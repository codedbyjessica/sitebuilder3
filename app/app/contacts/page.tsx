'use client'

import { useEffect, useState } from 'react'
import { getAuthUser } from '@/lib/amplify/client'
import { Card } from '@/components/ui/Card'
import type { ContactSubmission, BusinessData } from '@/lib/types'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<(ContactSubmission & { siteName?: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const user = await getAuthUser()
      if (!user) return

      const sitesRes = await fetch('/api/sites', {
        headers: { 'x-user-id': user.userId },
      })
      if (!sitesRes.ok) { setLoading(false); return }

      const { sites }: { sites: BusinessData[] } = await sitesRes.json()

      const allContacts: (ContactSubmission & { siteName?: string })[] = []
      for (const site of sites) {
        const res = await fetch(`/api/sites/${site.id}/contacts`, {
          headers: { 'x-user-id': user.userId },
        })
        if (res.ok) {
          const { contacts: siteContacts } = await res.json()
          allContacts.push(
            ...siteContacts.map((c: ContactSubmission) => ({
              ...c,
              siteName: site.businessName,
            }))
          )
        }
      }

      allContacts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setContacts(allContacts)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-500 mt-1">Contact form submissions from your websites</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📬</div>
          <p>No inquiries yet. They'll appear here when visitors contact you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-400">via {c.siteName}</span>
                  </div>
                  <a href={`mailto:${c.email}`} className="text-sm text-indigo-600 hover:underline">
                    {c.email}
                  </a>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{c.message}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

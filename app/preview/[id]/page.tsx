'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { configureAmplify, getAuthUser } from '@/lib/amplify/client'
import { loadDraft } from '@/lib/siteStore'
import { normalizeSite } from '@/lib/legacyAdapter'
import TemplateRenderer from '@/templates'
import type { Site } from '@/lib/schema'
import Link from 'next/link'

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [site, setSite] = useState<Site | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    configureAmplify()

    async function load() {
      // Try localStorage draft first (loadDraft returns a canonical Site)
      const draft = loadDraft(id)
      if (draft) {
        setSite(draft)
        setLoading(false)
        return
      }

      // Fall back to API if logged in
      const user = await getAuthUser()
      if (user) {
        const [siteRes, imagesRes] = await Promise.all([
          fetch(`/api/sites/${id}`, { headers: { 'x-user-id': user.userId } }),
          fetch(`/api/sites/${id}/images`, { headers: { 'x-user-id': user.userId } }),
        ])
        if (siteRes.ok) {
          const { site: raw } = await siteRes.json()
          setImages(
            imagesRes.ok ? (await imagesRes.json()).images.map((img: { url: string }) => img.url) : []
          )
          setSite(normalizeSite(raw))
          setLoading(false)
          return
        }
      }

      // Nothing found
      router.push('/app')
    }

    load()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading preview...</div>
      </div>
    )
  }

  if (!site) return null

  return (
    <div>
      {/* Preview banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white text-xs flex items-center justify-between px-4 h-9">
        <span className="text-gray-400">
          Preview — this is how your site will look when published
        </span>
        <div className="flex items-center gap-4">
          <Link
            href={`/app/edit/${id}`}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Back to editor
          </Link>
        </div>
      </div>

      {/* Push content below banner */}
      <div className="pt-9">
        <TemplateRenderer site={site} images={images} preview />
      </div>
    </div>
  )
}

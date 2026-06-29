'use client'

import { useEffect } from 'react'

export default function PageViewTracker({ siteId }: { siteId: string }) {
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, event: 'page_view' }),
    }).catch(() => {})
  }, [siteId])

  return null
}

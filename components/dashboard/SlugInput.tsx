'use client'

import { useState, useEffect, useCallback } from 'react'

interface SlugInputProps {
  value: string
  siteId: string
  onChange: (slug: string) => void
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'

export default function SlugInput({ value, siteId, onChange }: SlugInputProps) {
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [displayValue, setDisplayValue] = useState(value)

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug.trim()) {
      setStatus('idle')
      return
    }

    setStatus('checking')
    try {
      const res = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}&siteId=${siteId}`)
      const data = await res.json()
      setStatus(data.available ? 'available' : 'taken')
    } catch {
      setStatus('error')
    }
  }, [siteId])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayValue !== value) {
        onChange(displayValue)
      }
      if (displayValue.trim()) {
        checkSlug(displayValue)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [displayValue, value, onChange, checkSlug])

  const statusIcon = {
    idle: '',
    checking: '⏳',
    available: '✓',
    taken: '✕',
    error: '!',
  }[status]

  const statusColor = {
    idle: 'text-gray-400',
    checking: 'text-gray-500',
    available: 'text-green-600',
    taken: 'text-red-600',
    error: 'text-orange-600',
  }[status]

  const statusMessage = {
    idle: '',
    checking: 'Checking availability…',
    available: 'Available!',
    taken: 'This domain is taken',
    error: 'Unable to check availability',
  }[status]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your Sitelit subdomain
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
          <input
            type="text"
            value={displayValue}
            onChange={(e) => setDisplayValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="my-site"
            className="flex-1 outline-none text-sm"
          />
          <span className="text-gray-400 text-sm ml-2">.sitelit.ca</span>
        </div>
        {statusIcon && <span className={`text-lg ${statusColor}`}>{statusIcon}</span>}
      </div>
      {statusMessage && (
        <p className={`text-xs ${statusColor}`}>{statusMessage}</p>
      )}
      <p className="text-xs text-gray-500">
        Use lowercase letters, numbers, and hyphens. This creates your unique site URL.
      </p>
      <p className="text-xs text-gray-500 mt-3 p-3 bg-gray-50 rounded">
        💡 Want your own custom domain? Purchase one for as low as $15/year during checkout.
      </p>
    </div>
  )
}

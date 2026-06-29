'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ContactFormProps {
  siteId: string
  theme?: 'light' | 'dark' | 'friendly'
  accentColor?: 'indigo' | 'amber' | 'yellow'
}

export default function ContactForm({ siteId, theme = 'light', accentColor = 'indigo' }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isDark = theme === 'dark'
  const labelClass = cn('text-xs font-semibold uppercase tracking-wider mb-1 block', isDark ? 'text-gray-400' : 'text-gray-600')
  const inputClass = cn(
    'w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 transition-colors',
    isDark
      ? 'bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:ring-white/30'
      : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500'
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('text-center py-8', isDark ? 'text-white' : 'text-gray-900')}>
        <div className="text-4xl mb-3">✉️</div>
        <div className="font-semibold text-lg mb-1">Message sent!</div>
        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>We'll get back to you soon.</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="How can we help?"
          className={cn(inputClass, 'resize-none')}
        />
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60',
          accentColor === 'amber'
            ? 'bg-amber-400 text-black hover:bg-amber-300'
            : accentColor === 'yellow'
            ? 'bg-yellow-500 text-blue-950 hover:bg-yellow-400'
            : 'bg-indigo-600 text-white hover:bg-indigo-500'
        )}
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}

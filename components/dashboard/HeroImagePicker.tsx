'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface HeroImagePickerProps {
  siteId: string
  userId?: string
  value: string
  onChange: (url: string) => void
}

export default function HeroImagePicker({ siteId, userId, value, onChange }: HeroImagePickerProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = reader.result as string
          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          if (userId) headers['x-user-id'] = userId

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers,
            body: JSON.stringify({ siteId, filename: file.name, contentType: file.type, base64 }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Upload failed')
          const { publicUrl } = data
          onChange(publicUrl)
          setUploading(false)
        } catch {
          setError('Upload failed. Please try again.')
          setUploading(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read file.')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setError('Upload failed. Please try again.')
      setUploading(false)
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {value ? (
        <div className="relative rounded-xl overflow-hidden aspect-[3/1] group border border-ink/10">
          <Image src={value} alt="Hero background" fill className="object-cover" sizes="700px" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-ink text-xs font-semibold px-4 py-2 rounded-full hover:bg-paper transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/40 hover:bg-white/30 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-ink/15 rounded-xl p-8 text-center cursor-pointer hover:border-maple/40 hover:bg-maple-light/40 transition-colors"
        >
          <div className="text-2xl mb-2">🖼</div>
          <div className="text-sm font-medium text-ink/70 mb-1">
            {uploading ? 'Uploading…' : 'Click to upload a hero image'}
          </div>
          <div className="text-xs text-ink/40">PNG, JPG, WebP up to 10MB — displayed full-width behind your hero text</div>
        </div>
      )}

      {uploading && !value && (
        <div className="mt-2 flex items-center gap-2 text-sm text-ink/50">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Uploading…
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}

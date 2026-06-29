'use client'

import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Image from 'next/image'

interface ImageUploadProps {
  siteId: string
  images: string[]
  onImagesChange: (images: string[]) => void
}

export default function ImageUpload({ siteId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')

    const uploaded: string[] = []

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10MB.')
        continue
      }

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!res.ok) throw new Error('Upload failed')

        const { uploadUrl, publicUrl } = await res.json()

        await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })

        uploaded.push(publicUrl)
      } catch {
        setError('Failed to upload one or more images.')
      }
    }

    if (uploaded.length) {
      onImagesChange([...images, ...uploaded])
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeImage(url: string) {
    onImagesChange(images.filter((i) => i !== url))
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
      >
        <div className="text-3xl mb-2">📸</div>
        <div className="text-sm font-medium text-gray-700 mb-1">
          {uploading ? 'Uploading...' : 'Click to upload photos'}
        </div>
        <div className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB each</div>
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      {/* Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((url) => (
            <div key={url} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-100">
              <Image src={url} alt="Uploaded" fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Uploading images...
        </div>
      )}
    </div>
  )
}

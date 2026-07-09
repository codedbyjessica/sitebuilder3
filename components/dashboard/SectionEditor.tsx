'use client'

import { useState } from 'react'
import type { SiteSection } from '@/lib/types'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  sections: SiteSection[]
  onChange: (sections: SiteSection[]) => void
  siteId?: string
  userId?: string
}

function newSection(): SiteSection {
  return {
    id: crypto.randomUUID(),
    title: '',
    subtitle: '',
    type: 'list',
    items: ['', '', ''],
  }
}

export default function SectionEditor({ sections, onChange, siteId, userId }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  function uploadPhoto(sectionId: string, file: File) {
    setUploadingId(sectionId)
    const reader = new FileReader()
    reader.onload = () => {
      update(sectionId, { photo: reader.result as string, photoLayout: 'stacked' })
      setUploadingId(null)
    }
    reader.onerror = () => setUploadingId(null)
    reader.readAsDataURL(file)
  }

  function add() {
    onChange([...sections, newSection()])
  }

  function remove(id: string) {
    onChange(sections.filter(s => s.id !== id))
  }

  function update(id: string, patch: Partial<SiteSection>) {
    onChange(sections.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function updateItem(id: string, idx: number, val: string) {
    const section = sections.find(s => s.id === id)
    if (!section) return
    const items = [...section.items]
    items[idx] = val
    update(id, { items })
  }

  function addItem(id: string) {
    const section = sections.find(s => s.id === id)
    if (!section) return
    update(id, { items: [...section.items, ''] })
  }

  function removeItem(id: string, idx: number) {
    const section = sections.find(s => s.id === id)
    if (!section) return
    update(id, { items: section.items.filter((_, i) => i !== idx) })
  }

  function toggleCollapse(id: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...sections]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  function moveDown(idx: number) {
    if (idx === sections.length - 1) return
    const next = [...sections]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {sections.length === 0 && (
        <p className="text-sm text-ink/40 py-4 text-center border-2 border-dashed border-ink/10 rounded-xl">
          No sections yet. Add one below.
        </p>
      )}

      {sections.map((section, idx) => {
        const isCollapsed = collapsed.has(section.id)
        const label = section.title.trim() || 'Untitled section'

        return (
          <div key={section.id} className="border border-ink/15 rounded-xl overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-paper">
              <button
                type="button"
                onClick={() => toggleCollapse(section.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <span className="text-ink/40 text-xs">{isCollapsed ? '▶' : '▼'}</span>
                <span className="text-sm font-medium text-ink/80 truncate">{label}</span>
                <span className="text-xs text-ink/40 shrink-0">{section.type}</span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 text-ink/40 hover:text-ink/60 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === sections.length - 1} className="p-1 text-ink/40 hover:text-ink/60 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => remove(section.id)} className="p-1 text-ink/40 hover:text-red-500 ml-1">✕</button>
              </div>
            </div>

            {/* Section body */}
            {!isCollapsed && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    value={section.title}
                    onChange={e => update(section.id, { title: e.target.value })}
                  />
                  <Input
                    label="Nav label (optional)"
                    value={section.navTitle || ''}
                    onChange={e => update(section.id, { navTitle: e.target.value })}
                  />
                </div>
                <Input
                  label="Subtitle (optional)"
                  value={section.subtitle || ''}
                  onChange={e => update(section.id, { subtitle: e.target.value })}
                />
                <label className="flex items-center gap-2 text-sm text-ink/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={section.hideFromNav || false}
                    onChange={e => update(section.id, { hideFromNav: e.target.checked })}
                    className="rounded border-ink/25 text-maple focus:ring-maple"
                  />
                  Hide from top navigation
                </label>

                {/* Type toggle */}
                <div>
                  <div className="text-sm font-medium text-ink/70 mb-2">Content type</div>
                  <div className="flex gap-2">
                    {(['list', 'paragraph'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update(section.id, {
                          type: t,
                          items: t === 'paragraph' ? [section.items.join(' ')] : section.items,
                        })}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          section.type === t
                            ? 'bg-maple text-white border-maple'
                            : 'bg-white text-ink/60 border-ink/15 hover:border-maple/40'
                        }`}
                      >
                        {t === 'list' ? 'List' : 'Paragraph'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                {section.type === 'paragraph' ? (
                  <Textarea
                    label="Content"
                    value={section.items[0] || ''}
                    onChange={e => updateItem(section.id, 0, e.target.value)}
                    rows={5}
                  />
                ) : (
                  <div>
                    <div className="text-sm font-medium text-ink/70 mb-2">List items</div>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Input
                            value={item}
                            onChange={e => updateItem(section.id, i, e.target.value)}
                            className="flex-1"
                          />
                          {section.items.length > 1 && (
                            <button type="button" onClick={() => removeItem(section.id, i)} className="text-ink/40 hover:text-red-500 px-1 shrink-0">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem(section.id)}
                      className="mt-2 text-sm text-maple hover:text-maple-deep font-medium"
                    >
                      + Add item
                    </button>
                  </div>
                )}

                {/* Photo */}
                <div className="border-t border-ink/10 pt-4">
                    <div className="text-sm font-medium text-ink/70 mb-2">Photo (optional)</div>
                    {section.photo ? (
                      <div className="flex gap-4 items-start">
                        <img src={section.photo} alt="" className="w-24 h-24 object-cover rounded-lg border border-ink/10 shrink-0" />
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-ink/50 mb-1.5">Layout</div>
                            <div className="flex gap-2">
                              {([['stacked', 'Stacked'], ['side', 'Side by side']] as const).map(([val, label]) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => update(section.id, { photoLayout: val })}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                    (section.photoLayout || 'stacked') === val
                                      ? 'bg-maple text-white border-maple'
                                      : 'bg-white text-ink/60 border-ink/15 hover:border-maple/40'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => update(section.id, { photo: undefined, photoLayout: undefined })}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Remove photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          id={`photo-${section.id}`}
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) uploadPhoto(section.id, file)
                            e.target.value = ''
                          }}
                        />
                        <label
                          htmlFor={`photo-${section.id}`}
                          className={`inline-flex items-center gap-1.5 text-sm cursor-pointer ${
                            uploadingId === section.id
                              ? 'text-ink/40 pointer-events-none'
                              : 'text-maple hover:text-maple-deep'
                          }`}
                        >
                          {uploadingId === section.id ? 'Uploading…' : '+ Add photo'}
                        </label>
                      </>
                    )}
                  </div>
              </div>
            )}
          </div>
        )
      })}

      <Button variant="secondary" onClick={add} className="w-full">
        + Add section
      </Button>
    </div>
  )
}

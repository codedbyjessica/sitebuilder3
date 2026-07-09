'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import HeroImagePicker from '@/components/dashboard/HeroImagePicker'
import CtaEditor from '@/components/dashboard/CtaEditor'
import type {
  Block,
  HeroBlock,
  ContactBlock,
  ListBlock,
  RichTextBlock,
} from '@/lib/schema'

type ContentBlock = ListBlock | RichTextBlock

interface Props {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  siteId: string
  userId?: string
  businessName?: string
}

function newHero(): HeroBlock {
  return {
    id: crypto.randomUUID(),
    type: 'hero',
    heading: '',
    subheading: '',
    eyebrow: '',
    ctas: [{ label: 'Get started', href: '#contact' }],
  }
}

function newContact(): ContactBlock {
  return { id: crypto.randomUUID(), type: 'contact', title: 'Contact us', showForm: true }
}

function newContent(): ListBlock {
  return { id: crypto.randomUUID(), type: 'list', title: '', subtitle: '', items: ['', '', ''] }
}

export default function BlockEditor({ blocks, onChange, siteId, userId, businessName }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const hero = blocks.find((b): b is HeroBlock => b.type === 'hero')
  const contact = blocks.find((b): b is ContactBlock => b.type === 'contact')
  const contents = blocks.filter(
    (b): b is ContentBlock => b.type === 'list' || b.type === 'richtext'
  )

  // Canonical order: hero first, content in the middle, contact last.
  function commit(h: HeroBlock | undefined, cs: ContentBlock[], c: ContactBlock | undefined) {
    onChange([...(h ? [h] : []), ...cs, ...(c ? [c] : [])])
  }

  const anchors = [
    ...contents
      .filter((c) => c.title.trim())
      .map((c) => ({ href: `#section-${c.id}`, label: c.navTitle || c.title })),
    { href: '#contact', label: 'Contact' },
  ]

  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ---- content block ops ----
  function updateContent(id: string, patch: Partial<ContentBlock>) {
    commit(
      hero,
      contents.map((c) => (c.id === id ? ({ ...c, ...patch } as ContentBlock) : c)),
      contact
    )
  }

  function setContentType(id: string, type: 'list' | 'richtext') {
    commit(
      hero,
      contents.map((c) => {
        if (c.id !== id) return c
        const base = {
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          navTitle: c.navTitle,
          hideFromNav: c.hideFromNav,
          photo: c.photo,
          photoLayout: c.photoLayout,
        }
        if (type === 'richtext') {
          const body = c.type === 'list' ? c.items.join('\n\n') : c.body
          return { ...base, type: 'richtext', body }
        }
        const items = c.type === 'richtext' ? (c.body ? c.body.split('\n\n') : ['']) : c.items
        return { ...base, type: 'list', items }
      }),
      contact
    )
  }

  function updateItem(id: string, idx: number, val: string) {
    const block = contents.find((c) => c.id === id)
    if (!block || block.type !== 'list') return
    const items = [...block.items]
    items[idx] = val
    updateContent(id, { items } as Partial<ContentBlock>)
  }

  function addItem(id: string) {
    const block = contents.find((c) => c.id === id)
    if (!block || block.type !== 'list') return
    updateContent(id, { items: [...block.items, ''] } as Partial<ContentBlock>)
  }

  function removeItem(id: string, idx: number) {
    const block = contents.find((c) => c.id === id)
    if (!block || block.type !== 'list') return
    updateContent(id, { items: block.items.filter((_, i) => i !== idx) } as Partial<ContentBlock>)
  }

  function moveContent(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= contents.length) return
    const next = [...contents]
    ;[next[i], next[j]] = [next[j], next[i]]
    commit(hero, next, contact)
  }

  function uploadPhoto(id: string, file: File) {
    setUploadingId(id)
    const reader = new FileReader()
    reader.onload = () => {
      updateContent(id, { photo: reader.result as string, photoLayout: 'stacked' } as Partial<ContentBlock>)
      setUploadingId(null)
    }
    reader.onerror = () => setUploadingId(null)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      {/* ---- Hero ---- */}
      {hero ? (
        <div className="border border-ink/15 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-paper">
            <button
              type="button"
              onClick={() => toggleCollapse(hero.id)}
              className="flex-1 flex items-center gap-2 text-left"
            >
              <span className="text-ink/40 text-xs">{collapsed.has(hero.id) ? '▶' : '▼'}</span>
              <span className="text-sm font-medium text-ink/80">Hero</span>
              <span className="text-xs text-ink/40">pinned to top</span>
            </button>
            <button
              type="button"
              onClick={() => commit(undefined, contents, contact)}
              className="p-1 text-ink/40 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          {!collapsed.has(hero.id) && (
            <div className="p-4 space-y-4">
              <Input
                label="Heading"
                value={hero.heading || ''}
                placeholder={businessName || 'Your business name'}
                onChange={(e) => commit({ ...hero, heading: e.target.value }, contents, contact)}
              />
              <Input
                label="Eyebrow (optional)"
                value={hero.eyebrow || ''}
                onChange={(e) => commit({ ...hero, eyebrow: e.target.value }, contents, contact)}
              />
              <Textarea
                label="Subheading (optional)"
                value={hero.subheading || ''}
                rows={3}
                onChange={(e) => commit({ ...hero, subheading: e.target.value }, contents, contact)}
              />
              <div className="border-t border-ink/10 pt-4">
                <p className="text-xs font-medium text-ink/50 mb-3">Background image</p>
                <HeroImagePicker
                  siteId={siteId}
                  userId={userId}
                  value={hero.image || ''}
                  onChange={(url) => commit({ ...hero, image: url }, contents, contact)}
                />
              </div>
              <div className="border-t border-ink/10 pt-4">
                <p className="text-xs font-medium text-ink/50 mb-3">Buttons</p>
                <CtaEditor
                  value={hero.ctas || []}
                  onChange={(ctas) => commit({ ...hero, ctas }, contents, contact)}
                  anchors={anchors}
                  noun="hero button"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button variant="secondary" onClick={() => commit(newHero(), contents, contact)} className="w-full">
          + Add hero
        </Button>
      )}

      {/* ---- Content blocks ---- */}
      {contents.map((block, idx) => {
        const isCollapsed = collapsed.has(block.id)
        const label = block.title.trim() || 'Untitled section'
        return (
          <div key={block.id} className="border border-ink/15 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-paper">
              <button
                type="button"
                onClick={() => toggleCollapse(block.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <span className="text-ink/40 text-xs">{isCollapsed ? '▶' : '▼'}</span>
                <span className="text-sm font-medium text-ink/80 truncate">{label}</span>
                <span className="text-xs text-ink/40 shrink-0">
                  {block.type === 'list' ? 'list' : 'paragraph'}
                </span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => moveContent(idx, -1)} disabled={idx === 0} className="p-1 text-ink/40 hover:text-ink/60 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveContent(idx, 1)} disabled={idx === contents.length - 1} className="p-1 text-ink/40 hover:text-ink/60 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => commit(hero, contents.filter((c) => c.id !== block.id), contact)} className="p-1 text-ink/40 hover:text-red-500 ml-1">✕</button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Title" value={block.title} onChange={(e) => updateContent(block.id, { title: e.target.value })} />
                  <Input label="Nav label (optional)" value={block.navTitle || ''} onChange={(e) => updateContent(block.id, { navTitle: e.target.value })} />
                </div>
                <Input label="Subtitle (optional)" value={block.subtitle || ''} onChange={(e) => updateContent(block.id, { subtitle: e.target.value })} />
                <label className="flex items-center gap-2 text-sm text-ink/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={block.hideFromNav || false}
                    onChange={(e) => updateContent(block.id, { hideFromNav: e.target.checked })}
                    className="rounded border-ink/25 text-maple focus:ring-maple"
                  />
                  Hide from top navigation
                </label>

                <div>
                  <div className="text-sm font-medium text-ink/70 mb-2">Content type</div>
                  <div className="flex gap-2">
                    {([['list', 'List'], ['richtext', 'Paragraph']] as const).map(([t, tLabel]) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setContentType(block.id, t)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          block.type === t
                            ? 'bg-maple text-white border-maple'
                            : 'bg-white text-ink/60 border-ink/15 hover:border-maple/40'
                        }`}
                      >
                        {tLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {block.type === 'richtext' ? (
                  <Textarea label="Content" value={block.body} rows={5} onChange={(e) => updateContent(block.id, { body: e.target.value } as Partial<ContentBlock>)} />
                ) : (
                  <div>
                    <div className="text-sm font-medium text-ink/70 mb-2">List items</div>
                    <div className="space-y-2">
                      {block.items.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Input value={item} onChange={(e) => updateItem(block.id, i, e.target.value)} className="flex-1" />
                          {block.items.length > 1 && (
                            <button type="button" onClick={() => removeItem(block.id, i)} className="text-ink/40 hover:text-red-500 px-1 shrink-0">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addItem(block.id)} className="mt-2 text-sm text-maple hover:text-maple-deep font-medium">
                      + Add item
                    </button>
                  </div>
                )}

                <div className="border-t border-ink/10 pt-4">
                  <div className="text-sm font-medium text-ink/70 mb-2">Photo (optional)</div>
                  {block.photo ? (
                    <div className="flex gap-4 items-start">
                      <img src={block.photo} alt="" className="w-24 h-24 object-cover rounded-lg border border-ink/10 shrink-0" />
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-ink/50 mb-1.5">Layout</div>
                          <div className="flex gap-2">
                            {([['stacked', 'Stacked'], ['side', 'Side by side']] as const).map(([val, l]) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => updateContent(block.id, { photoLayout: val })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  (block.photoLayout || 'stacked') === val
                                    ? 'bg-maple text-white border-maple'
                                    : 'bg-white text-ink/60 border-ink/15 hover:border-maple/40'
                                }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={() => updateContent(block.id, { photo: undefined, photoLayout: undefined })} className="text-xs text-red-400 hover:text-red-600">
                          Remove photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id={`photo-${block.id}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadPhoto(block.id, file)
                          e.target.value = ''
                        }}
                      />
                      <label
                        htmlFor={`photo-${block.id}`}
                        className={`inline-flex items-center gap-1.5 text-sm cursor-pointer ${
                          uploadingId === block.id ? 'text-ink/40 pointer-events-none' : 'text-maple hover:text-maple-deep'
                        }`}
                      >
                        {uploadingId === block.id ? 'Uploading…' : '+ Add photo'}
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <Button variant="secondary" onClick={() => commit(hero, [...contents, newContent()], contact)} className="w-full">
        + Add section
      </Button>

      {/* ---- Contact ---- */}
      {contact ? (
        <div className="border border-ink/15 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-paper">
            <button
              type="button"
              onClick={() => toggleCollapse(contact.id)}
              className="flex-1 flex items-center gap-2 text-left"
            >
              <span className="text-ink/40 text-xs">{collapsed.has(contact.id) ? '▶' : '▼'}</span>
              <span className="text-sm font-medium text-ink/80">Contact</span>
              <span className="text-xs text-ink/40">pinned to bottom</span>
            </button>
            <button
              type="button"
              onClick={() => commit(hero, contents, undefined)}
              className="p-1 text-ink/40 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          {!collapsed.has(contact.id) && (
            <div className="p-4 space-y-4">
              <Input label="Section title" value={contact.title} onChange={(e) => commit(hero, contents, { ...contact, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" value={contact.phone || ''} onChange={(e) => commit(hero, contents, { ...contact, phone: e.target.value })} />
                <Input label="Email" type="email" value={contact.email || ''} onChange={(e) => commit(hero, contents, { ...contact, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Address" value={contact.address || ''} onChange={(e) => commit(hero, contents, { ...contact, address: e.target.value })} />
                <Input label="City" value={contact.city || ''} onChange={(e) => commit(hero, contents, { ...contact, city: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={contact.showForm}
                  onChange={(e) => commit(hero, contents, { ...contact, showForm: e.target.checked })}
                  className="rounded border-ink/25 text-maple focus:ring-maple"
                />
                Show contact form
              </label>
            </div>
          )}
        </div>
      ) : (
        <Button variant="secondary" onClick={() => commit(hero, contents, newContact())} className="w-full">
          + Add contact
        </Button>
      )}
    </div>
  )
}

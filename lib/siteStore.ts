// localStorage-backed draft store for pre-auth builder sessions.
// Drafts live here until the user publishes (which requires auth + DynamoDB save).
//
// Drafts are persisted and returned as canonical `Site` objects. Reads always pass through
// normalizeSite, so legacy flat drafts written by older builds upgrade transparently on load.

import { normalizeSite } from './legacyAdapter'
import type { Site } from './schema'

const PREFIX = 'draft_'

export function saveDraft(site: Site): boolean {
  try {
    localStorage.setItem(`${PREFIX}${site.id}`, JSON.stringify(site))
    return true
  } catch (err) {
    console.error('saveDraft failed — localStorage may be full:', err)
    return false
  }
}

export function loadDraft(id: string): Site | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${id}`)
    return raw ? normalizeSite(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function listDraftIds(): string[] {
  try {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => k.slice(PREFIX.length))
  } catch {
    return []
  }
}

export function deleteDraft(id: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${id}`)
  } catch {}
}

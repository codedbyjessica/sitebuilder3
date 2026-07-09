---
name: schema-migration
description: "In-progress migration from flat BusinessData to a multi-page, block-based Site model"
metadata: 
  node_type: memory
  type: project
  originSessionId: dac26998-b83a-4962-b95a-57b7b10afb11
---

Migrating the site data model from the legacy flat `BusinessData` (all content as top-level
fields + a limited `sections: 'list'|'paragraph'` array) to a canonical **`Site`** model.

**Target shape** (`lib/schema.ts`): `Site { pages: Page[] }`, `Page { blocks: Block[] }`,
`Block` = discriminated union (`hero | richtext | list | contact`, extensible). Presentation
(`layout`/`themeId`/`fontId`) is separate from content.

**Locked design invariants (do not break):**
- **Layout-agnostic**: every layout renders the SAME Site; a layout switch changes only
  presentation tokens, never which data is required. All 6 layouts already consume identical
  `TemplateData` today — preserve that.
- **Block-based**: hero & contact are blocks, not privileged fields (reorderable/removable).
- **Multi-page**: DATA MODEL is multi-page (`Site.pages[]`), but DO NOT build page-management
  UX yet. Editor operates only on `homePage(site)`. Structure must allow expansion later; the
  UI stays single-page for now (user decision 2026-07-09).
- A block type can't ship until all layouts render it; renderers skip unknown types.
- Defaults applied in ONE hydrator (`normalizeSite`). Never read persisted data raw — always
  through the migrator (keyed on `schemaVersion`). Unknown theme/font/layout id falls back.
- Persisted data holds image REFERENCES (S3 key/URL), never base64. See [[aws_migration_todo]].
- Block ids are permanent/unique (React keys + `#section-<id>` anchors).

**Approach: strangler-fig.** `lib/legacyAdapter.ts` holds `normalizeSite(raw)→Site` (migrates
old flat drafts) and `siteToTemplateData(site,page)→TemplateData` (flattens Site back to what
the 6 templates consume, so they stay UNTOUCHED through phases 1–3). Delete legacyAdapter at end.

**Phase status:**
- ✅ Phase 1 (done): `lib/schema.ts` + `lib/legacyAdapter.ts` landed. Purely additive, nothing
  imports them yet. Typechecks clean.
- ✅ Phase 2 (done): read paths (`app/preview/[id]`, `app/site/[slug]`) now go through
  `normalizeSite → siteToTemplateData`; `draftToTemplateData` mapper deleted. Content defaults
  (Get started / Book now → / Contact us) moved into `migrateV0` (the one hydrator). Verified:
  Test Florist draft renders identically. NOTE: preview page still has a `console.log('site:',…)`
  debugging aid — remove before prod.
- ✅ Phase 3 (done): editor stack now speaks `Site`. `siteStore` stores/returns `Site`
  (normalizes on read); dashboard + `SiteCard` consume `Site` (uses `themeId`); create wizard
  builds a `Site` via `normalizeSite(flatForm)`. New `components/dashboard/BlockEditor.tsx` +
  extracted `CtaEditor.tsx`. Edit page rebuilt: tabs Content(BlockEditor)/Design/Settings,
  operates on `homePage(site)` only. Hero pinned top, content blocks reorderable, contact pinned
  bottom — all `Block`s. Publish path uses new `siteToBusinessData(site)` (backend stays flat).
  Verified end-to-end in browser (create→dashboard→edit→autosave Site→preview).
  - FOLLOW-UPS: (1) create wizard still uses old `SectionEditor` for its Sections step (converted
    via normalizeSite) — unify to BlockEditor later. (2) `siteToTemplateData` collapses
    `hero.heading` and `site.businessName` into one title because templates render a single
    `businessName`; Phase 4 should render them separately (hero.heading in hero, businessName in
    nav/SEO). See TODO(phase4) in legacyAdapter.
- ✅ Phase 4 (done): all 6 layouts (minimal, bold, folio, serene, studio, harvest) now render
  directly from `Site`/`page.blocks` via a shared `templates/siteView.ts` helper (derives the
  presentation pieces from blocks). Layouts are structurally distinct, so each keeps its own
  bespoke markup — `siteView` is the shared DATA contract, not shared rendering.
  - `TemplateProps` is now `{ site, images?, preview? }` — `data`/`template` REMOVED from the whole
    render pipeline (TemplateRenderer + both read paths pass only `site`). `MobileNav.sections`
    widened to a structural `NavItem` type.
  - `siteToTemplateData` un-exported (internal helper for `siteToBusinessData` only).
  - Verified all 6 layouts render correctly by switching the draft layout (no console errors).

**MIGRATION COMPLETE.** Flat BusinessData → multi-page block-based Site, end to end. Adding a new
block type now: extend the `Block` union + `BlockEditor` + one branch per layout's block rendering.

**Remaining cleanup (non-blocking):**
- `components/site/SectionBlock.tsx` is now orphaned dead code (no imports) — safe to delete.
- Preview page still has `console.log('site:', …)` debug aid — remove before prod.
- `legacyAdapter.ts` stays: `normalizeSite` (permanent hydration/migration) + `siteToBusinessData`
  (publish path, until backend stores Site natively) + internal `siteToTemplateData`.
- Create wizard still uses old `SectionEditor` (converted via normalizeSite) — unify to BlockEditor.
- Phase-4 TODO in legacyAdapter: templates now COULD render `hero.heading` and `site.businessName`
  separately (they read `site` directly), but `siteView.title` still collapses them for parity —
  revisit if you want distinct nav-brand vs hero-title.

**Note:** legacy field `template` (theme id) is renamed `themeId` on `Site`.

---
name: project-sitebuilder
description: SiteBuilder SaaS — template-based local business website builder built from scratch
metadata:
  type: project
---

Template-based SaaS website builder for local businesses. No AI features — user manually enters business info, picks a style, uploads photos, publishes.

**Why:** MVP for a local business website builder product.

**How to apply:** When working on this project, understand the full-stack structure below before making changes.

## Tech stack
- Next.js 16 App Router, TypeScript, Tailwind CSS
- AWS Amplify Auth + Cognito (client-side auth)
- DynamoDB (sites, images, contacts, analytics, domains tables)
- S3 + CloudFront (image storage with presigned URLs)
- AWS Amplify Hosting (amplify.yml at root)

## Route map
- `/` — Landing page (hero, features, 6 template previews, pricing)
- `/login` — Sign up / login / email verification (Amplify Auth)
- `/app` — Dashboard (lists sites, requires auth)
- `/app/create` — 5-step wizard (info → services → template → photos → review)
- `/app/edit/[id]` — Tabbed editor (Info, Services, Template, Photos) + publish toggle
- `/app/contacts` — All contact form submissions across sites
- `/site/[slug]` — Public generated site (SSR, SEO, JSON-LD)
- `/api/sites` — CRUD for sites
- `/api/sites/[id]/images` — GET/DELETE images for a site
- `/api/sites/[id]/contacts` — GET contact submissions
- `/api/upload` — Presigned URL generation for S3
- `/api/contact` — Contact form submission
- `/api/analytics` — Event tracking

## 6 Templates
modern, minimal, bold, elegant, friendly, classic
Each in `templates/{name}/index.tsx`, receives `TemplateData`, includes ContactForm.

## Key design decisions
- Auth uses `x-user-id` header on API routes (client sends userId from Cognito session). Production should verify JWT instead.
- Image uploads: client gets presigned S3 URL from `/api/upload`, PUTs directly to S3.
- Create wizard uses client-side UUID for siteId; passed to server so images uploaded during wizard stay linked to the site.
- Public sites are SSR (DynamoDB lookup by slug), not static — needed for real-time publish/unpublish.

## Setup
Copy `.env.local.example` → `.env.local`, fill in AWS values.
Run `infrastructure/setup.sh` to create DynamoDB tables and S3 bucket.

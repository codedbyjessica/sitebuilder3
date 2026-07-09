---
name: aws_migration_todo
description: Hero image upload currently uses base64; needs migration to AWS S3
metadata:
  type: project
---

**Currently using base64 for hero image uploads.** Need to migrate to AWS S3 eventually.

**Why:** Base64 storage works for dev/testing but doesn't scale—data URIs increase payload size, impact performance, and hit size limits. S3 is the proper solution for production.

**How to apply:** When moving to production or hitting image size/performance issues, implement the AWS S3 upload flow using the existing S3 infrastructure (lib/s3/upload.ts). The placeholder code is already there; just needs to be re-enabled and credentials configured in .env.local.

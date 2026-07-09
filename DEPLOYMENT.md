# Amplify Deployment Checklist

## Prerequisites
- [ ] AWS Account with Amplify access
- [ ] GitHub repository connected to Amplify
- [ ] Environment variables configured in Amplify console

## AWS Services Required

### Cognito (Authentication)
- [ ] User Pool created
- [ ] App client configured
- [ ] Identity Pool created
- [ ] Required env vars:
  - `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
  - `NEXT_PUBLIC_COGNITO_CLIENT_ID`
  - `NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID`

### DynamoDB (Database)
- [ ] Tables created:
  - `sitebuilder-sites` (pk: id)
  - `sitebuilder-images` (pk: id, gsi: siteId)
  - `sitebuilder-contacts` (pk: id, gsi: siteId)
  - `sitebuilder-domains` (pk: domain)
  - `sitebuilder-users` (pk: userId)
  - `sitebuilder-analytics` (pk: id)
- [ ] Required env vars:
  - `DYNAMO_SITES_TABLE`
  - `DYNAMO_IMAGES_TABLE`
  - `DYNAMO_CONTACTS_TABLE`
  - `DYNAMO_DOMAINS_TABLE`
  - `DYNAMO_USERS_TABLE`
  - `DYNAMO_ANALYTICS_TABLE`

### S3 + CloudFront (Image Storage & CDN)
- [ ] S3 bucket created (`sitebuilder-images-prod`)
- [ ] CORS configured for uploads
- [ ] CloudFront distribution created
- [ ] Required env vars:
  - `NEXT_PUBLIC_S3_BUCKET`
  - `S3_BUCKET`
  - `NEXT_PUBLIC_CDN_URL`

### IAM Roles
- [ ] Amplify execution role with permissions for:
  - DynamoDB (read/write all tables)
  - S3 (read/write to bucket)
  - CloudFront (invalidate cache if needed)

## Build Configuration
- Build script: `npm run build`
- Output directory: `.next`
- Node.js version: 18+ (Next.js 16.2.9 requirement)

## Environment Variables
All variables must be set in Amplify console:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<IAM access key>
AWS_SECRET_ACCESS_KEY=<IAM secret key>
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<pool id>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<client id>
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=<identity pool id>
NEXT_PUBLIC_S3_BUCKET=sitebuilder-images-prod
S3_BUCKET=sitebuilder-images-prod
NEXT_PUBLIC_CDN_URL=https://d<distribution-id>.cloudfront.net
DYNAMO_SITES_TABLE=sitebuilder-sites
DYNAMO_IMAGES_TABLE=sitebuilder-images
DYNAMO_CONTACTS_TABLE=sitebuilder-contacts
DYNAMO_DOMAINS_TABLE=sitebuilder-domains
DYNAMO_USERS_TABLE=sitebuilder-users
DYNAMO_ANALYTICS_TABLE=sitebuilder-analytics
```

## Post-Deployment
- [ ] Test auth flow (sign up, sign in)
- [ ] Test site creation
- [ ] Test image upload
- [ ] Test preview and publish
- [ ] Monitor CloudWatch logs

## Notes
- Next.js 16 uses Turbopack by default (faster builds)
- All auth is handled via AWS Amplify SDK
- Images are stored in S3 with presigned URLs
- Database schema is DynamoDB (NoSQL)
- See `.env.local.example` for environment variable template

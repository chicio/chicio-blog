---
name: Contact Form & Rate Limiting
description: Resend email integration with honeypot spam protection and Upstash Redis rate limiting
type: project
---

## Contact Form (apps/website/src/app/api/contact/route.ts)
- Resend API for transactional emails
- Validation: name, email, message length
- Honeypot field for spam protection
- Sends both notification (to Fabrizio, recipient from the `CONTACT_EMAIL` env var) and confirmation (to user)
- Uses React Email components for templates (`@react-email/components`)

## Rate Limiting (apps/website/src/lib/rate-limit/rate-limit.ts)
- Upstash Redis backend (client in `apps/website/src/lib/upstash/upstash-redis.ts`)
- Tracks by client IP
- Prevents contact form abuse

## Env Vars
- `RESEND_API_KEY`, `CONTACT_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

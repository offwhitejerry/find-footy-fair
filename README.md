# SoccerFare — Soccer Ticket Meta-Search (Compare → Redirect)

Find the cheapest soccer tickets across providers. We **do not** sell tickets or take payment. We compare prices, then **redirect** you to the seller’s website.

[![Live](https://img.shields.io/badge/live-soccerfare.com-blue)](https://soccerfare.com)
[![Deploy-Vercel](https://img.shields.io/badge/deploy-Vercel-black)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

## Live Site
https://soccerfare.com

## What it does
- Search **MLS / USL Championship / USL League One / NWSL** matches  
- Normalize listings across partners  
- Show **all-in prices** when provided; otherwise label **Fees estimated**  
- **Redirect-only** checkout (no payments here)  
- `subid` click tracking for attribution

## Tech
- Vite + React + TypeScript + Tailwind + shadcn/ui  
- (Optional) Supabase/edge functions for logging  
- Deployed on Vercel

## Preview
<!-- Replace with a real screenshot or OG image -->
![SoccerFare screenshot](./public/og.jpg)

## Environment Variables
Public keys must start with `VITE_`. Create a `.env` locally or set them in your host.

```env
# branding (public)
VITE_APP_NAME=SoccerFare
VITE_APP_DOMAIN=https://soccerfare.com
VITE_CONTACT_EMAIL=hello@soccerfare.com
VITE_AFFILIATE_SUBID_PARAM=subid

# feature flags (public)
VITE_SHOW_POPULAR=true
VITE_ENABLE_SAMPLE_DATA=false
VITE_SHOW_ADMIN=false
VITE_ADMIN_PASSCODE_HASH=   # sha256 hex of your passphrase (no plain text)

# providers (server-side usage only)
TICKETMASTER_API_KEY=
SEATGEEK_API_KEY=
TICKPICK_AFFILIATE_ID=
GAMETIME_PARTNER_TOKEN=

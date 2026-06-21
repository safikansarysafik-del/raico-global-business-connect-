# Raico Global Business Connect — Next.js Project

A deployable Next.js (App Router, v16) wrapper around the Raico Global Business Connect prototype, ready to push to **Vercel** or **Cloudflare Workers** (via OpenNext).

## What changed from the uploaded file

The uploaded component called `api.anthropic.com` directly from the browser with no API key. That only worked inside the claude.ai artifact sandbox, which proxies and authenticates those calls invisibly. In a real deployment that call would fail outright (no key sent), and hardcoding a key client-side would expose it to every visitor — a real security and billing risk.

This project fixes that by moving translation to a server-side route:

- `app/api/translate/route.ts` — reads `ANTHROPIC_API_KEY` from server-only environment variables and calls the Anthropic API.
- `components/RaicoApp.tsx` — the uploaded component, unchanged except for: `"use client"` added, the export renamed to `RaicoApp`, and `translateText()` now calls `/api/translate` instead of Anthropic directly.

If `ANTHROPIC_API_KEY` isn't set, the API route fails soft and returns the original text instead of crashing the chat, so the app stays usable while you're getting set up.

## What this is (and isn't)

This ships the full interactive frontend plus one real backend endpoint (translation). It does **not** include authentication, a database, or persistence — connections, follows, and messages reset on page reload, same as the original prototype. If you want real accounts, saved profiles, and persistent chat history, that needs a backend (Firebase/Postgres/etc.) wired into the same service-call pattern; happy to build that out as a next step if useful.

## Local development

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

Zero config needed — Vercel detects Next.js automatically.

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Import the repo at https://vercel.com/new.
3. In Project Settings → Environment Variables, add `ANTHROPIC_API_KEY`.
4. Deploy.

Or via CLI: `npx vercel`.

## Deploy to Cloudflare

Cloudflare retired `@cloudflare/next-on-pages` in favor of the **OpenNext adapter**, which runs Next.js on Cloudflare Workers with full server-feature support (the old Pages/edge-only path didn't support API routes properly). This project is already configured for it (`wrangler.jsonc`, `open-next.config.ts`).

```bash
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npm run cf:deploy
```

`npm run cf:preview` runs the built Worker locally first if you want to test before deploying.

## Notes on dependency choices

- **lucide-react** is pinned to `>=0.400.0 <1.0.0`. Lucide hit a 1.0 release that renamed several icons (e.g. `CheckCircle2` → `CircleCheckBig`), and this component uses the pre-1.0 names throughout. Staying on 0.x avoids a breaking install; upgrading later just means following Lucide's migration guide and updating the renamed imports.
- **TypeScript strict mode is off** (`tsconfig.json`) because the source component was written as plain JS-style JSX with no prop types. The app builds cleanly as-is; tightening types incrementally (starting with the data shapes in `RaicoApp.tsx`) is a reasonable follow-up but not required to ship.
- **Tailwind v4** is used with the new CSS-first config (`@import "tailwindcss";` in `app/globals.css`, no `tailwind.config.js` needed) — current Next.js-recommended setup.

## Project structure

```
app/
  layout.tsx          root layout + metadata
  page.tsx             renders RaicoApp
  globals.css           Tailwind v4 entry
  api/translate/route.ts   server-side translation endpoint
components/
  RaicoApp.tsx           the ported prototype
wrangler.jsonc / open-next.config.ts   Cloudflare Workers deploy config
```

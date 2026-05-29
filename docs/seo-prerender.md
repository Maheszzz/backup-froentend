# Prerender and crawler HTML (makemystay.ai)

The marketing site is a **Vite + React SPA**. Titles, meta tags, and JSON-LD are injected with `react-helmet-async` after JavaScript runs. Crawlers that only parse the first HTML response need a **prerender or bot-specific HTML** path so the document includes real body content (listings, headings, FAQ text).

## What to configure (hosting / edge)

1. **Route search-engine bots to a prerender service** (hosted, e.g. Prerender.io, or self-hosted Rendertron / headless Chrome) using **User-Agent** detection at the CDN or reverse proxy.
2. **Cache** prerendered HTML with a **short TTL** (e.g. 5–60 minutes) for listing pages; **purge or bump cache on deploy** so new builds are not stuck on old HTML.
3. **Ensure the renderer waits for the app** until listings or PDP content is present (network idle or equivalent), not only `<div id="root"></div>`.

### Example: bot User-Agents to match

Include at least: `Googlebot`, `Google-InspectionTool`, `bingbot`, `Slurp`, `DuckDuckBot`, `facebookexternalhit` (for OG debugging), `LinkedInBot`.

(Exact lists depend on your vendor.)

### Static redirects for legacy rent URLs

[`public/_redirects`](file:///Users/maheswaranm/make-my-stay/public/_redirects) (Netlify / Cloudflare Pages–style) maps `/rent-in-*` → `/rent/*` with **301** so bookmarks and old backlinks consolidate on the canonical pattern.

Replicate the same rules in your edge config if you do not use `_redirects`.

## Verification

**Baseline (SPA only):** Until prerender or bot routing is configured at the CDN, `curl` with a Googlebot User-Agent will typically return the static `index.html` shell with an empty `#root`. The shell’s default `<title>`, meta description, and Open Graph tags are aligned with the homepage (`buildHomeSEO`), and **no** duplicate `LocalBusiness` JSON-LD is embedded there — structured data comes from the React app (and from prerendered HTML once bots are routed). Rich schema in the first response still requires prerender or SSR.

After prerender is live, the first HTML response for a listing hub should contain visible text, not an empty shell:

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "https://makemystay.ai/rent/koramangala" | head -n 80
```

You should see listing titles, headings, or FAQ copy in the raw HTML.

Also use **Google Search Console → URL Inspection → View crawled page** to confirm `<title>`, `meta description`, and `link rel="canonical"` match expectations.

## Deploy checklist

- [ ] Bot traffic receives prerendered HTML (not bare `index.html` only).
- [ ] Cache invalidation on new deployments.
- [ ] No infinite loading states on `/rent/:slug`, `/pg/:slug`, or property detail routes when JS runs without a logged-in user.

## Ready-made edge integrations

See **[deploy/prerender-hosts.md](../deploy/prerender-hosts.md)** for Netlify Edge + Cloudflare Pages middleware in this repo (`PRERENDER_TOKEN`).

# SEO: post-deploy checks (Google Search Console)

After shipping SEO fixes (API hardening, sitemap hygiene, unavailable PDP pages, canonical tags), validate and speed up discovery:

## 1. Deploy

- Run `npm run build` (regenerates `public/sitemap.xml` from live API).
- Optional: `npm run validate:sitemap` (HEAD sample of sitemap URLs; set `SITEMAP_VALIDATE_STRICT=1` to fail CI on errors).
- Deploy frontend to production EC2 / CDN.

## 2. Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) for the `makemystay.ai` property.
2. **Sitemaps** → resubmit `https://makemystay.ai/sitemap.xml`.
3. Use **URL Inspection** on priority URLs:
   - `https://makemystay.ai/`
   - `https://makemystay.ai/pg/hsr-layout`
   - `https://makemystay.ai/pg/koramangala`
   - `https://makemystay.ai/pg/marathahalli`
   - `https://makemystay.ai/pg/whitefield`
   - `https://makemystay.ai/pg/electronic-city`
   - `https://makemystay.ai/blog/how-to-choose-pg-in-bangalore`
   - One live PG property URL and one removed listing URL (should show “no longer available”, `noindex`).
4. For each URL: **Test live URL** → confirm title, description, canonical, and (for bots) prerendered body.
5. Click **Request indexing** on fixed hubs and a sample of property pages.

## 3. Validate indexing issues

After 7–14 days, review **Pages** → **Why pages aren’t indexed** / **Not found** / **Server error**:

- 404 clusters should drop as stale sitemap URLs age out and unavailable PDPs serve consistent content.
- Unknown `/pg/{area}` slugs should report 404 to bots (not soft redirect to `/pg`).

## Expectations

Search results and GSC snippets often lag **7–14+ days** after recrawl. Duplicates and soft issues can take multiple passes.

Titles are set via `react-helmet-async`; bots should use **Prerender.io** at nginx for full HTML — see [seo-prerender.md](./seo-prerender.md).

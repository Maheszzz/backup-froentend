# Post-Deploy Verification Checklist

Run these after every production deploy that touches SEO, routing, or prerender config.

Quick run-all command:

```bash
node scripts/verify-seo-prerender.mjs
```

## 0. Prerender token source (EC2/nginx)

```bash
sudo test -s /etc/nginx/snippets/prerender_token.conf && echo "token snippet present"
```

Expected: `token snippet present`  
If missing: create from `deploy/prerender_token.conf.example` and reload nginx

## 1. Prerender — bots see real HTML

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://makemystay.ai/pg/bangalore | grep -c "<h1\|listing\|property"
```

Expected: > 0  
If 0: `PRERENDER_TOKEN` not set or prerender service down

## 2. Homepage schema depth

```bash
curl -s -A "Googlebot" https://makemystay.ai/ | grep -c "application/ld+json"
```

Expected: 2  
If 0: schema injection broken or prerender not serving

## 3. Canonical tags — no query params

```bash
curl -s -A "Googlebot" https://makemystay.ai/pg/bangalore \
  | grep -o '<link rel="canonical"[^>]*>'
```

Expected: `href="https://makemystay.ai/pg/bangalore"`  
If shows `?cat=` params: canonical logic broken

## 4. Legacy redirect working

```bash
curl -sI "https://makemystay.ai/properties?cat=pg" | grep -i "location"
```

Expected: `location: https://makemystay.ai/pg/bangalore`  
If missing: SPA may still load (HTTP 200) — check **nginx** `location = /properties` on EC2 ([`deploy/prerender-hosts.md`](./prerender-hosts.md)) or client redirect in `App.tsx`

## 5. Noindex on thin pages

```bash
curl -s -A "Googlebot" https://makemystay.ai/buy/in/bangalore \
  | grep "noindex"
```

Expected: `noindex` in meta robots tag  
If missing: `buildPageSEO` threshold check broken

## 6. Sitemap accessible

```bash
curl -s https://makemystay.ai/sitemap.xml | grep -c "<url>"
```

Expected: > 90  
If 0: sitemap not built or not served

## GSC Actions (after prerender confirmed working)

1. Search Console → Sitemaps → submit `https://makemystay.ai/sitemap.xml`
2. URL Inspection → request indexing for:
   - `https://makemystay.ai/`
   - `https://makemystay.ai/pg/bangalore`
   - `https://makemystay.ai/rent/bangalore`
   - `https://makemystay.ai/faq`
   - `https://makemystay.ai/blog/pg-in-bangalore-guide`
   - `https://makemystay.ai/blog/pg-near-whitefield-bangalore`
   - `https://makemystay.ai/blog/pg-checklist-new-joiners-bangalore`
3. Rich Results Test:
   - `https://makemystay.ai/` → expect LocalBusiness + WebSite
   - `https://makemystay.ai/faq` → expect FAQPage
   - `https://makemystay.ai/pg/bangalore` → expect FAQPage + BreadcrumbList
   - `https://makemystay.ai/rent/bangalore` → expect FAQPage
   - `https://makemystay.ai/blog/pg-in-bangalore-guide` → expect Article + FAQPage + BreadcrumbList
   - `https://makemystay.ai/blog/pg-near-whitefield-bangalore` → expect Article + FAQPage + BreadcrumbList
   - `https://makemystay.ai/blog/pg-checklist-new-joiners-bangalore` → expect Article + FAQPage + BreadcrumbList

## External citation workflow (AEO)

1. Quora: publish 5-10 useful answers for "PG in Bangalore" queries and mention relevant MakeMyStay guides.
2. Reddit: share practical PG advice in `r/bangalore`, `r/india`, and `r/digitalnomad` with one contextual guide link.
3. High-authority directories: list MakeMyStay on JustDial and Sulekha with homepage + `/pg/bangalore` URL.
4. Guest posting: secure 1-2 mentions from Bangalore lifestyle blogs and link one new guide per post.

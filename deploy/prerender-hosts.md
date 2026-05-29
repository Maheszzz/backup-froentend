# Prerender.io at the edge (production)

The SPA shell is fixed in-repo only after **Prerender.io** (or equivalent) runs for bot User-Agents. Set **`PRERENDER_TOKEN`** from [prerender.io dashboard](https://prerender.io/) (same token for Netlify or Cloudflare).

## Netlify

1. Connect the repo; Netlify reads [`netlify.toml`](../netlify.toml).
2. Site settings → Environment variables → add **`PRERENDER_TOKEN`** (secret).
3. Deploy. Edge function: [`netlify/edge-functions/prerender.ts`](../netlify/edge-functions/prerender.ts).

If the token is missing, the function **falls through** to the normal SPA (safe default).

## Cloudflare Pages

1. Connect the repo; ensure **Functions** are enabled (default for Pages with a `functions/` directory).
2. Settings → Environment variables → add **`PRERENDER_TOKEN`** (secret) for Production.
3. Deploy. Middleware: [`functions/_middleware.js`](../functions/_middleware.js).

## Vercel (static Vite)

This repo is **not** Next.js. Options: (1) use [Vercel Edge Middleware](https://vercel.com/docs/functions/edge-middleware) in a **separate** small Worker that proxies to Prerender (same logic as above), or (2) host on Netlify/Cloudflare using the files here.

## EC2 / nginx (`sites-available`)

When the marketing site is served from **Ubuntu + nginx** on EC2, the active vhost is often **`/etc/nginx/sites-available/makemystay_all`** (not committed as the live file). Use the repo reference **[`nginx_frontend_and_api.conf`](../nginx_frontend_and_api.conf)** as the canonical fragment to merge: Prerender **`map` blocks** (must live in **`http`**, outside any `server { }`), bot **`location /`** branch, **`location = /properties`** legacy `?cat=*` handling, and optional **`location ~* ^/rent-in-(.*)$`** redirects.

### Rollout steps (operator)

1. **SSH** to the instance and **backup** the active config:

   ```bash
   sudo cp /etc/nginx/sites-available/makemystay_all \
     /etc/nginx/sites-available/makemystay_all.bak."$(date +%Y%m%d%H%M)"
   ```

2. **Capture the current `location /` block** (before changing anything). This documents the exact text on disk and avoids risky blind `sed` if the live file differs from expectations:

   ```bash
   sudo grep -n -A25 'location /' /etc/nginx/sites-available/makemystay_all
   ```

   If multiple `location /` blocks exist (e.g. HTTP vs HTTPS `server`), grep each vhost or open the file in `sudo nano` / `sudo vim` and note which `server { }` serves **HTTPS** for `makemystay.ai` — prerender and SPA `try_files` must apply there.

3. **Create token snippet** on server (secret, not in git):

   ```bash
   sudo install -d -m 755 /etc/nginx/snippets
   sudo cp /path/to/repo/deploy/prerender_token.conf.example /etc/nginx/snippets/prerender_token.conf
   sudo sed -i 's/REPLACE_WITH_PRERENDER_IO_TOKEN/<REAL_PRERENDER_TOKEN>/' /etc/nginx/snippets/prerender_token.conf
   sudo chmod 600 /etc/nginx/snippets/prerender_token.conf
   ```

4. **Merge** into `makemystay_all` (prefer manual edit or a small diff, not blind regex):
   - Copy **`map` … `map $http_x_prerender`** from [`nginx_frontend_and_api.conf`](../nginx_frontend_and_api.conf) lines 15–38 into the **`http`** block (before the first `server {`).
   - In the **`server_name makemystay.ai`** (or equivalent) block, align **`location /`** with lines 58–67: load token from `/etc/nginx/snippets/prerender_token.conf`, then `if ($prerender = 1) { rewrite … break; proxy_set_header X-Prerender-Token $prerender_token; proxy_pass https://service.prerender.io; }`, then `try_files $uri $uri/ /index.html;`.
   - Add **`location = /properties`** exactly as lines 95–101: four `if ($arg_cat = …) { return 301 …; }` lines, then **`try_files $uri $uri/ /index.html;`** for requests **without** `cat` (bare `/properties`).

5. **Do not** end `location = /properties` with `return 301 /properties;` — that **redirects `/properties` to itself** when `cat` is absent and breaks the SPA.

6. **Test and reload**:

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

7. **Verify** with [verify-checklist.md](./verify-checklist.md) (prerender curl, legacy `Location`, noindex, sitemap).

### Homepage JSON-LD count

After prerender returns hydrated HTML, `curl … | grep -c "application/ld+json"` on `/` should be **2** (FAQ + `@graph` from [`Home.tsx`](../src/pages/Home.tsx)). If `grep -o '<script type="application/ld+json">.*</script>'` looks wrong, use a non-greedy pattern or count `type="application/ld+json"` occurrences in a saved HTML file.

## Verify (after deploy)

```bash
curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "https://makemystay.ai/rent/koramangala" | grep -E '<h1|json\+ld|canonical' | head
```

Expect non-zero matches for headings or `application/ld+json` in the **first** response body.

## Post-go-live

- GSC → Sitemaps → `https://makemystay.ai/sitemap.xml`
- URL Inspection on `/`, `/rent/koramangala`, `/faq` → Request indexing
- Rich Results Test on homepage for Organization / FAQPage

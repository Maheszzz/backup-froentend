#!/usr/bin/env node

/**
 * Verify production SEO/prerender signals for makemystay.ai.
 * Usage: node scripts/verify-seo-prerender.mjs [baseUrl]
 */

const baseUrl = (process.argv[2] || 'https://makemystay.ai').replace(/\/+$/, '');
const googlebotUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

async function fetchText(url, { ua = googlebotUA } = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': ua } });
  return { status: res.status, headers: res.headers, text: await res.text() };
}

async function fetchHead(url) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
  return { status: res.status, headers: res.headers };
}

function countMatches(text, regex) {
  const m = text.match(regex);
  return m ? m.length : 0;
}

const checks = [];

const pg = await fetchText(`${baseUrl}/pg/bangalore`);
checks.push({
  id: 'bot_html',
  ok: pg.status === 200 && countMatches(pg.text.toLowerCase(), /<h1|listing|property/g) > 0,
  details: `status=${pg.status}, matches=${countMatches(pg.text.toLowerCase(), /<h1|listing|property/g)}`,
});

const home = await fetchText(`${baseUrl}/`);
checks.push({
  id: 'home_jsonld',
  ok: countMatches(home.text, /application\/ld\+json/g) >= 2,
  details: `status=${home.status}, jsonLdCount=${countMatches(home.text, /application\/ld\+json/g)}`,
});

const canonical = (pg.text.match(/<link rel="canonical"[^>]*>/i) || [null])[0];
checks.push({
  id: 'canonical',
  ok: !!canonical && canonical.includes(`${baseUrl}/pg/bangalore`),
  details: canonical || `missing (status=${pg.status})`,
});

const legacy = await fetchHead(`${baseUrl}/properties?cat=pg`);
const location = legacy.headers.get('location');
checks.push({
  id: 'legacy_redirect',
  ok: legacy.status >= 300 && legacy.status < 400 && !!location,
  details: `status=${legacy.status}, location=${location || 'missing'}`,
});

const buy = await fetchText(`${baseUrl}/buy/in/bangalore`);
checks.push({
  id: 'buy_noindex',
  ok: /noindex/i.test(buy.text),
  details: `status=${buy.status}, containsNoindex=${/noindex/i.test(buy.text)}`,
});

const sitemap = await fetchText(`${baseUrl}/sitemap.xml`, { ua: 'curl/8.0' });
checks.push({
  id: 'sitemap_urls',
  ok: countMatches(sitemap.text, /<url>/g) > 90,
  details: `status=${sitemap.status}, urlCount=${countMatches(sitemap.text, /<url>/g)}`,
});

let failures = 0;
console.log(`SEO verification for ${baseUrl}`);
for (const c of checks) {
  const status = c.ok ? 'PASS' : 'FAIL';
  if (!c.ok) failures += 1;
  console.log(`- [${status}] ${c.id}: ${c.details}`);
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log('\nAll checks passed.');

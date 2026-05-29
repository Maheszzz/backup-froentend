/**
 * Generates sitemap index + split sitemaps (static, localities, blog, properties).
 * Canonical URLs only — no /pg-in-* duplicates, no blocked utility paths.
 * Run after build: node scripts/generate-sitemap.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const BASE = 'https://makemystay.ai';

const STATIC_PATHS = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/contact-us', priority: '0.85', changefreq: 'monthly' },
    { path: '/properties', priority: '0.9', changefreq: 'daily' },
    { path: '/pg/bangalore', priority: '0.96', changefreq: 'daily' },
    { path: '/pg/hyderabad', priority: '0.94', changefreq: 'daily' },
    { path: '/pg/pune', priority: '0.94', changefreq: 'daily' },
    { path: '/pg-with-wifi', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-food', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-with-ac', priority: '0.82', changefreq: 'weekly' },
    { path: '/pg-vs-flat-bangalore', priority: '0.8', changefreq: 'monthly' },
    { path: '/compare/hsr-layout-vs-koramangala', priority: '0.78', changefreq: 'monthly' },
    { path: '/compare/hsr-layout-vs-bellandur', priority: '0.78', changefreq: 'monthly' },
    { path: '/compare/whitefield-vs-marathahalli', priority: '0.78', changefreq: 'monthly' },
    { path: '/compare/koramangala-vs-indiranagar', priority: '0.78', changefreq: 'monthly' },
    { path: '/pg-near-me', priority: '0.84', changefreq: 'weekly' },
    { path: '/rent', priority: '0.85', changefreq: 'daily' },
    { path: '/rent/bangalore', priority: '0.93', changefreq: 'daily' },
    { path: '/rent/hyderabad', priority: '0.92', changefreq: 'daily' },
    { path: '/rent/pune', priority: '0.92', changefreq: 'daily' },
    { path: '/faq', priority: '0.75', changefreq: 'monthly' },
    { path: '/about', priority: '0.78', changefreq: 'monthly' },
    { path: '/how-we-verify', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/flats-in-bangalore', priority: '0.9', changefreq: 'daily' },
    { path: '/1bhk', priority: '0.88', changefreq: 'weekly' },
    { path: '/2bhk', priority: '0.88', changefreq: 'weekly' },
    { path: '/buy/in/bangalore', priority: '0.82', changefreq: 'weekly' },
    { path: '/plots/in/bangalore', priority: '0.82', changefreq: 'weekly' },
];

const locJson = JSON.parse(readFileSync(join(root, 'src/data/pg-locations.json'), 'utf8'));

const PG_NEAR_LANDMARK_PATHS = [
    'pg-near-ecospace',
    'pg-near-rmz-ecoworld',
    'pg-near-wipro-ecity',
    'pg-near-manyata',
    'pg-near-itpl',
    'pg-near-embassy-techvillage',
    'pg-near-ecity-phase-2',
    'pg-near-prestige-tech-park',
];

const blogPostsSrc = readFileSync(join(root, 'src/data/blogPosts.ts'), 'utf8');
const BLOG_SLUGS = [...blogPostsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const RENT_HUB_LOCATION_SLUGS = [
    'whitefield',
    'marathahalli',
    'btm',
    'koramangala',
    'hsr-layout',
    'electronic-city',
    'indiranagar',
    'bellandur',
    'hebbal',
    'jp-nagar',
    'bannerghatta-road',
    'sarjapur-road',
];

function titleToSlug(title = '') {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function tokenizeSlugSource(value = '') {
    return String(value ?? '')
        .toLowerCase()
        .replace(/\bin\b/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function buildPropertySeoSlug(property) {
    const orderedTokens = [
        ...tokenizeSlugSource(property.property_name),
        ...tokenizeSlugSource(property.property_type),
        ...tokenizeSlugSource(property.location),
        ...tokenizeSlugSource(property.city),
    ];
    const deduped = orderedTokens.filter((token, index) => orderedTokens.indexOf(token) === index);
    return deduped.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '') || property.slug || titleToSlug(property.property_name || '');
}

function deriveUiCategory(item) {
    const raw = item.category;
    if (typeof raw === 'string' && raw.trim()) {
        const c = raw.trim().toLowerCase();
        if (c === 'pg' || c === 'plot' || c === 'rent' || c === 'buy') return c;
    }
    const pt = String(item.property_type ?? '').toLowerCase();
    if (pt === 'pg') return 'pg';
    if (pt === 'plot') return 'plot';
    const lt = (item.listing_type ?? 'rent').toString().toLowerCase();
    if (lt === 'buy' || lt === 'sale') return 'buy';
    return 'rent';
}

function buildPropertyDetailPath(property) {
    const id = String(property.id || '').trim();
    const slug = buildPropertySeoSlug(property);
    const category = deriveUiCategory(property);
    const typeLower = (property.property_type || '').toLowerCase();
    const isPgType = ['pg', 'hostel', 'coliving'].some((t) => typeLower.includes(t));

    let prefix = '/pg';
    if (category === 'rent' && !isPgType) {
        prefix = '/rent';
    } else if (category === 'buy' || category === 'plot') {
        prefix = '/property';
    } else if (isPgType || category === 'pg') {
        prefix = '/pg';
    }

    return slug ? `${prefix}/${id}-${slug}` : `${prefix}/${id}`;
}

function resolveApiBase() {
    const raw = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.VITE_API_BASE_URL ||
        process.env.VITE_API_URL ||
        '/api/v1'
    ).trim();
    if (!raw) return `${BASE}/api/v1`;
    if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
    if (raw.startsWith('/')) return `${BASE}${raw}`.replace(/\/+$/, '');
    return `${BASE}/${raw}`.replace(/\/+$/, '');
}

function urlEntry(loc, priority, changefreq) {
    const lastmod = new Date().toISOString();
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

function wrapUrlset(body) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}</urlset>\n`;
}

function wrapIndex(entries) {
    const lastmod = new Date().toISOString();
    const body = entries
        .map(
            (e) =>
                `  <sitemap>\n    <loc>${e.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
        )
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

async function fetchAllProperties() {
    const apiBase = resolveApiBase();
    const rows = [];
    const limit = 100;
    let skip = 0;
    let total = Infinity;

    while (skip < total) {
        const url = `${apiBase}/realty/properties?skip=${skip}&limit=${limit}&sort_by=newest`;
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            throw new Error(`Failed to fetch property sitemap rows from ${url}: ${response.status}`);
        }
        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        total = typeof payload?.total === 'number' ? payload.total : items.length;
        rows.push(...items);
        if (items.length === 0) break;
        skip += items.length;
    }

    return rows.filter((row) => row && row.id && row.is_available !== false);
}

let staticBody = '';
for (const s of STATIC_PATHS) {
    const loc = s.path === '/' ? BASE : `${BASE}${s.path}`;
    staticBody += urlEntry(loc, s.priority, s.changefreq);
}
for (const p of PG_NEAR_LANDMARK_PATHS) {
    staticBody += urlEntry(`${BASE}/${p}`, '0.86', 'weekly');
}

let localitiesBody = '';
for (const row of locJson) {
    localitiesBody += urlEntry(`${BASE}/pg/${row.slug}`, '0.85', 'weekly');
    localitiesBody += urlEntry(`${BASE}/pg-for-boys-in-${row.slug}`, '0.84', 'weekly');
    localitiesBody += urlEntry(`${BASE}/pg-for-girls-in-${row.slug}`, '0.84', 'weekly');
}
for (const rentSlug of RENT_HUB_LOCATION_SLUGS) {
    localitiesBody += urlEntry(`${BASE}/rent/${rentSlug}`, '0.86', 'weekly');
}

let blogBody = '';
for (const slug of BLOG_SLUGS) {
    blogBody += urlEntry(`${BASE}/blog/${slug}`, '0.72', 'monthly');
}

let propertiesBody = '';
let propertyCount = 0;
try {
    const properties = await fetchAllProperties();
    for (const property of properties) {
        propertiesBody += urlEntry(`${BASE}${buildPropertyDetailPath(property)}`, '0.88', 'daily');
    }
    propertyCount = properties.length;
} catch (error) {
    console.warn(`Property sitemap generation skipped: ${error instanceof Error ? error.message : String(error)}`);
}

const files = [
    { name: 'sitemap-static.xml', body: staticBody },
    { name: 'sitemap-localities.xml', body: localitiesBody },
    { name: 'sitemap-blog.xml', body: blogBody },
];
if (propertiesBody) {
    files.push({ name: 'sitemap-properties.xml', body: propertiesBody });
}

const publicDir = join(root, 'public');
for (const f of files) {
    writeFileSync(join(publicDir, f.name), wrapUrlset(f.body));
}

const indexEntries = files.map((f) => ({ loc: `${BASE}/${f.name}` }));
const indexXml = wrapIndex(indexEntries);
writeFileSync(join(publicDir, 'sitemap.xml'), indexXml);

// Legacy single-file consumers: combined urlset (canonical URLs only)
const combinedBody = staticBody + localitiesBody + blogBody + propertiesBody;
writeFileSync(join(publicDir, 'sitemap-all.xml'), wrapUrlset(combinedBody));

const distDir = join(root, 'dist');
if (existsSync(distDir)) {
    for (const f of files) {
        writeFileSync(join(distDir, f.name), wrapUrlset(f.body));
    }
    writeFileSync(join(distDir, 'sitemap.xml'), indexXml);
}

const n =
    STATIC_PATHS.length +
    PG_NEAR_LANDMARK_PATHS.length +
    locJson.length * 3 +
    RENT_HUB_LOCATION_SLUGS.length +
    BLOG_SLUGS.length +
    propertyCount;
console.log(
    `Wrote sitemap index + ${files.length} child sitemaps (${n} URLs, ${propertyCount} properties)`,
);

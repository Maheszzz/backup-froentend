import type { BlogPost } from '@/data/blogPosts';

/** Local assets — each used at most once on the index grid. */
const LOCAL = {
    pgLiving: '/images/blog/pg-living.png',
    techPark: '/images/blog/tech-park.png',
    agreement: '/images/blog/agreement.png',
    safety: '/images/blog/safety.png',
    ai: '/images/blog/ai.png',
    hero: '/images/blog/hero.png',
    heroSunset: '/images/blog/hero-sunset.webp',
} as const;

/** Unique Unsplash covers (w=1200) — one per slug where local assets run out. */
const UNSPLASH: Record<string, string> = {
    'pg-checklist-new-joiners-bangalore':
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'how-to-choose-pg-in-bangalore':
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    'pg-rent-vs-flat-rent-bangalore':
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'best-pg-areas-bangalore-it-pros':
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'rental-agreement-bangalore':
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    'tenant-acquisition-24-hours':
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    'dynamic-pricing-coliving-revenue':
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'bangalore-rental-laws-compliance':
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    'how-to-find-verified-rentals-bangalore-2026':
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    'affordable-coliving-spaces-bangalore-2026':
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    'pg-electronic-city-it-professionals-2026':
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    'pg-hsr-layout-bangalore-2026':
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'pg-koramangala-guide-2026':
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    '1bhk-rent-bangalore-under-25000-2026':
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'pg-with-wifi-food-bangalore-2026':
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    'namma-metro-rent-bangalore-2026':
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'ladies-pg-bangalore-checklist-2026':
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    'pg-bellandur-orr-commute-2026':
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
};

/** One cover image per slug — overrides duplicate `imageUrl` in blogPosts data. */
export const BLOG_COVER_BY_SLUG: Record<string, string> = {
    'pg-in-bangalore-guide': LOCAL.pgLiving,
    'pg-near-whitefield-bangalore': LOCAL.techPark,
    'pg-deposits-notice-period-guide': LOCAL.agreement,
    'safety-guide-female-pg-bangalore': LOCAL.safety,
    'ai-vs-brokers-real-estate-future': LOCAL.ai,
    'emerging-rental-hotspots-bangalore-2027': LOCAL.heroSunset,
    'best-areas-to-live-bangalore-working-professionals-2026': LOCAL.hero,
    ...UNSPLASH,
};

export const BLOG_CATEGORY_STYLES: Record<
    string,
    { pill: string; accent: string; ring: string }
> = {
    Guides: {
        pill: 'bg-red-50 text-red-700 border-red-100',
        accent: 'from-red-500/20 to-transparent',
        ring: 'group-hover:ring-red-200',
    },
    'Area Guide': {
        pill: 'bg-sky-50 text-sky-700 border-sky-100',
        accent: 'from-sky-500/20 to-transparent',
        ring: 'group-hover:ring-sky-200',
    },
    Checklist: {
        pill: 'bg-violet-50 text-violet-700 border-violet-100',
        accent: 'from-violet-500/20 to-transparent',
        ring: 'group-hover:ring-violet-200',
    },
    Legal: {
        pill: 'bg-amber-50 text-amber-800 border-amber-100',
        accent: 'from-amber-500/20 to-transparent',
        ring: 'group-hover:ring-amber-200',
    },
    Safety: {
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        accent: 'from-emerald-500/20 to-transparent',
        ring: 'group-hover:ring-emerald-200',
    },
    Business: {
        pill: 'bg-slate-100 text-slate-700 border-slate-200',
        accent: 'from-slate-500/15 to-transparent',
        ring: 'group-hover:ring-slate-300',
    },
    Technology: {
        pill: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        accent: 'from-indigo-500/20 to-transparent',
        ring: 'group-hover:ring-indigo-200',
    },
    Market: {
        pill: 'bg-orange-50 text-orange-700 border-orange-100',
        accent: 'from-orange-500/20 to-transparent',
        ring: 'group-hover:ring-orange-200',
    },
};

const DEFAULT_STYLE = BLOG_CATEGORY_STYLES.Guides;

export const BLOG_COVER_FALLBACK = LOCAL.pgLiving;

export function getBlogCoverImage(post: Pick<BlogPost, 'slug' | 'imageUrl'>): string {
    return BLOG_COVER_BY_SLUG[post.slug] ?? post.imageUrl ?? BLOG_COVER_FALLBACK;
}

/** Use on `<img onError={...}>` so a removed Unsplash URL still shows a local cover. */
export function handleBlogCoverImageError(e: { currentTarget: HTMLImageElement }) {
    const el = e.currentTarget;
    if (el.dataset.fallbackApplied === 'true') return;
    el.dataset.fallbackApplied = 'true';
    el.src = BLOG_COVER_FALLBACK;
}

export function getBlogCategoryStyle(category?: string) {
    return BLOG_CATEGORY_STYLES[category ?? 'Guides'] ?? DEFAULT_STYLE;
}

export const BLOG_FILTER_CATEGORIES = [
    'All',
    'Guides',
    'Area Guide',
    'Checklist',
    'Legal',
    'Safety',
    'Market',
    'Business',
] as const;

export type BlogFilterCategory = (typeof BLOG_FILTER_CATEGORIES)[number];

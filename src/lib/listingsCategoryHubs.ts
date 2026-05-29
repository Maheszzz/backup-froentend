/**
 * Category-tab targets: each tab navigates to a canonical SEO URL (Option 2).
 * City-aware: buy/plot/rent use the current hub city when known; legacy default is Bangalore.
 */

export type ListingsCategoryKey = 'all' | 'pg' | 'rent' | 'buy' | 'plot';

export type ListingsHubTab = 'pg' | 'rent' | 'buy' | 'plot';

/** Homepage hero search tabs (no legacy `all`; commercial → all listings on home). */
export type HomeHeroNavigateTab = ListingsHubTab | 'commercial';

const HOME_HERO_TABS = new Set<HomeHeroNavigateTab>(['pg', 'rent', 'buy', 'plot', 'commercial']);

export function parseHomeHeroTab(raw: string | null | undefined): HomeHeroNavigateTab {
    const s = (raw || '').trim().toLowerCase();
    if (HOME_HERO_TABS.has(s as HomeHeroNavigateTab)) return s as HomeHeroNavigateTab;
    return 'pg';
}

/** Maps hero tab → PropertyGrid / API listing category on the homepage. */
export function homeHeroTabToListingsCategory(tab: HomeHeroNavigateTab): ListingsCategoryKey {
    if (tab === 'commercial') return 'all';
    return tab;
}

/** Normalized slug for URLs (undefined = no city / all-India listing index). */
export function normalizeCitySlug(city: string | undefined | null): string | undefined {
    if (city == null || typeof city !== 'string') return undefined;
    const s = city.trim().toLowerCase();
    if (!s || s === 'all') return undefined;
    return s;
}

/**
 * Canonical path for a category tab, optionally scoped by `citySlug`.
 * - Rent: `/rent/bangalore` hub when city is bangalore; else `/rent/{city}` for locality/city hubs.
 * - PG: `/pg` when no city; `/pg/{city}` for city hubs (e.g. bangalore) so tab nav stays on the SEO hub.
 */
export function listingsCategoryHubPath(cat: ListingsHubTab, citySlug?: string | undefined): string {
    const city = normalizeCitySlug(citySlug);
    switch (cat) {
        case 'pg':
            if (city) return `/pg/${city}`;
            return '/pg';
        case 'rent':
            if (city === 'bangalore') return '/rent/bangalore';
            if (city) return `/rent/${city}`;
            return '/rent';
        case 'buy':
            if (city) return `/buy/in/${city}`;
            return '/buy';
        case 'plot':
            if (city) return `/plots/in/${city}`;
            return '/plots';
    }
}

/** Default hub targets when city is unknown (legacy `?cat=` on `/properties`). */
export const LISTINGS_CATEGORY_HUB = {
    pg: listingsCategoryHubPath('pg', 'bangalore'),
    rent: listingsCategoryHubPath('rent', 'bangalore'),
    buy: listingsCategoryHubPath('buy', 'bangalore'),
    plot: listingsCategoryHubPath('plot', 'bangalore'),
} as const satisfies Record<ListingsHubTab, string>;

const HOME_HERO_DEFAULT_CITY = 'bangalore';

/**
 * Single source of truth for tab navigation URLs.
 * Used by both Home hero and Properties.tsx tab handler.
 */
export function listingsHubTabNavigateUrl(
  cat: ListingsCategoryKey,
  citySlug: string | undefined,
  qRaw: string
): string {
  const city = normalizeCitySlug(citySlug);
  const q = (qRaw || '').trim();

  const build = (pathname: string, extra: Record<string, string>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(extra)) {
      if (v) p.set(k, v);
    }
    if (q) p.set('q', q);
    const s = p.toString();
    return s ? `${pathname}?${s}` : pathname;
  };

  if (cat === 'all')  return build('/properties', {});
  if (cat === 'pg')   return build(city ? `/pg/${city}` : '/pg', {});
  if (cat === 'rent') return build(listingsCategoryHubPath('rent', city), city ? { city } : {});
  if (cat === 'buy')  return build(listingsCategoryHubPath('buy',  city), city ? { city } : {});
                      return build(listingsCategoryHubPath('plot', city), city ? { city } : {});
}

// Home hero delegates to the shared helper with a fixed default city
export function homeHeroSearchUrl(
  cat: ListingsCategoryKey,
  qRaw: string
): string {
  return listingsHubTabNavigateUrl(cat, HOME_HERO_DEFAULT_CITY, qRaw);
}

export function listingsLegacyCatRedirectPath(cat: string | null): string | null {
    if (!cat) return null;
    const c = cat.toLowerCase();
    if (c === 'pg') return LISTINGS_CATEGORY_HUB.pg;
    if (c === 'rent') return LISTINGS_CATEGORY_HUB.rent;
    if (c === 'buy') return LISTINGS_CATEGORY_HUB.buy;
    if (c === 'plot') return LISTINGS_CATEGORY_HUB.plot;
    return null;
}

/**
 * Map current pathname to the listings category tab (for highlight + state sync).
 * Returns null when the path is not a known listings surface (e.g. /1bhk, PDP).
 */
export function pathnameToActiveListingsTab(pathname: string): ListingsCategoryKey | null {
    const p = pathname.split('?')[0];
    if (p === '/properties' || p.startsWith('/properties/in/')) return 'all';
    if (p === '/pg' || p.startsWith('/pg/')) {
        const seg = (p.replace(/^\/pg\/?/, '').split('/')[0] ?? '').toLowerCase();
        if (seg && /^(\d+)(-|$)/.test(seg)) return null;
        return 'pg';
    }
    if (p === '/rent' || p.startsWith('/rent/')) {
        const slug = (p.slice('/rent/'.length).split('/')[0] ?? '').toLowerCase();
        if (slug && /^(\d+)(-|$)/.test(slug)) return null;
        return 'rent';
    }
    if (p === '/buy' || p.startsWith('/buy/')) return 'buy';
    if (p === '/plots' || p.startsWith('/plots/')) return 'plot';
    return null;
}

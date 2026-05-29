import { SITE_URL } from '@/lib/siteConfig';

/** Favicon / schema / OG (full SVG in public/). */
export const BRAND_LOGO_PATH = '/logo.svg';

/** Small raster for <img> in header/footer (avoids huge SVG + import object bugs). */
export const BRAND_LOGO_NAV_PATH = '/logo-nav.jpg';

export function brandLogoUrl(origin?: string): string {
    const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : SITE_URL);
    return `${base}${BRAND_LOGO_PATH}`;
}

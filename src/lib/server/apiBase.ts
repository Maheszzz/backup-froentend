import { SITE_URL } from '@/lib/siteConfig';

/** Absolute API base for server-side fetch (metadata, sitemap). */
export function resolveServerApiBase(): string {
    const raw = (
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        process.env.NEXT_PUBLIC_API_URL ??
        process.env.VITE_API_BASE_URL ??
        process.env.VITE_API_URL ??
        ''
    ).trim();
    if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, '');
    if (process.env.NODE_ENV === 'development') {
        return 'http://127.0.0.1:8000/api/v1';
    }
    return `${SITE_URL}/api/v1`;
}

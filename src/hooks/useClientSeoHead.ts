import { useEffect } from 'react';
import type { HelmetSEOProps } from '@/lib/seo';
import { OG_LOCALE, SITE_NAME, TWITTER_SITE_HANDLE } from '@/lib/siteConfig';

const MMS_SEO = 'data-mms-seo';

type SeoHeadOptions = HelmetSEOProps & {
    prerenderStatus?: number;
    prerenderHeaders?: Record<string, string>;
    ogType?: 'website' | 'article';
};

function safeRemove(el: Element | null) {
    if (el?.parentNode) {
        el.parentNode.removeChild(el);
    }
}

function upsertMeta(
    key: string,
    attrs: Record<string, string>,
    managed: Element[],
): void {
    const selector = `meta[${MMS_SEO}="${key}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(MMS_SEO, key);
        document.head.appendChild(el);
        managed.push(el);
    }
    for (const [name, value] of Object.entries(attrs)) {
        el.setAttribute(name, value);
    }
}

function upsertLink(
    key: string,
    attrs: Record<string, string>,
    managed: Element[],
): void {
    const selector = `link[${MMS_SEO}="${key}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute(MMS_SEO, key);
        document.head.appendChild(el);
        managed.push(el);
    }
    for (const [name, value] of Object.entries(attrs)) {
        el.setAttribute(name, value);
    }
}

/**
 * Client-side document head updates without react-helmet-async (avoids removeChild races in Next.js 15).
 */
export function useClientSeoHead({
    title,
    description,
    canonicalHref,
    ogImage,
    noindex,
    keywords,
    prerenderStatus,
    prerenderHeaders,
    ogType = 'website',
}: SeoHeadOptions): void {
    const prerenderHeadersKey = prerenderHeaders
        ? JSON.stringify(prerenderHeaders)
        : '';

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const managed: Element[] = [];
        document.title = title;

        upsertMeta('description', { name: 'description', content: description }, managed);
        upsertMeta('robots', {
            name: 'robots',
            content: noindex ? 'noindex, follow' : 'max-image-preview:large',
        }, managed);
        upsertLink('canonical', { rel: 'canonical', href: canonicalHref }, managed);

        upsertMeta('og:title', { property: 'og:title', content: title }, managed);
        upsertMeta('og:description', { property: 'og:description', content: description }, managed);
        upsertMeta('og:type', { property: 'og:type', content: ogType }, managed);
        upsertMeta('og:url', { property: 'og:url', content: canonicalHref }, managed);
        upsertMeta('og:site_name', { property: 'og:site_name', content: SITE_NAME }, managed);
        upsertMeta('og:locale', { property: 'og:locale', content: OG_LOCALE }, managed);
        if (ogImage) {
            upsertMeta('og:image', { property: 'og:image', content: ogImage }, managed);
        } else {
            safeRemove(document.head.querySelector(`meta[${MMS_SEO}="og:image"]`));
        }

        upsertMeta('twitter:card', { name: 'twitter:card', content: 'summary_large_image' }, managed);
        upsertMeta('twitter:site', { name: 'twitter:site', content: TWITTER_SITE_HANDLE }, managed);
        upsertMeta('twitter:title', { name: 'twitter:title', content: title }, managed);
        upsertMeta('twitter:description', { name: 'twitter:description', content: description }, managed);
        if (ogImage) {
            upsertMeta('twitter:image', { name: 'twitter:image', content: ogImage }, managed);
        } else {
            safeRemove(document.head.querySelector(`meta[${MMS_SEO}="twitter:image"]`));
        }

        if (keywords) {
            upsertMeta('keywords', { name: 'keywords', content: keywords }, managed);
        } else {
            safeRemove(document.head.querySelector(`meta[${MMS_SEO}="keywords"]`));
        }

        if (prerenderStatus) {
            upsertMeta('prerender-status', {
                name: 'prerender-status-code',
                content: prerenderStatus.toString(),
            }, managed);
        }
        if (prerenderHeaders) {
            Object.entries(prerenderHeaders).forEach(([headerKey, value], i) => {
                upsertMeta(`prerender-header-${i}`, {
                    name: 'prerender-header',
                    content: `${headerKey}: ${value}`,
                }, managed);
            });
        }

        return () => {
            for (const el of managed) {
                safeRemove(el);
            }
        };
    }, [
        title,
        description,
        canonicalHref,
        ogImage,
        noindex,
        keywords,
        prerenderStatus,
        ogType,
        prerenderHeadersKey,
    ]);
}

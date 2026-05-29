import type { Metadata } from 'next';
import { buildPageSEO, type PageSEOInput } from '@/lib/seo';
import { SITE_NAME } from '@/lib/siteConfig';

export type PageMetadataOptions = {
    openGraphType?: 'website' | 'article';
};

/** Maps shared `PageSEOInput` / `buildPageSEO` output to Next.js App Router metadata (SSR `<head>`). */
export function pageSeoToMetadata(input: PageSEOInput, options?: PageMetadataOptions): Metadata {
    const seo = buildPageSEO(input);
    const ogType = options?.openGraphType ?? 'website';
    return {
        title: { absolute: seo.title },
        description: seo.description,
        keywords: seo.keywords,
        alternates: { canonical: seo.canonicalHref },
        robots: seo.noindex
            ? { index: false, follow: true, googleBot: { index: false, follow: true } }
            : { index: true, follow: true },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: seo.canonicalHref,
            siteName: SITE_NAME,
            locale: 'en_IN',
            type: ogType,
            images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
            images: seo.ogImage ? [seo.ogImage] : undefined,
        },
    };
}

'use client';

import { useClientSeoHead } from '@/hooks/useClientSeoHead';
import type { HelmetSEOProps } from '@/lib/seo';

interface SEOHeadProps extends HelmetSEOProps {
    prerenderStatus?: number;
    prerenderHeaders?: Record<string, string>;
    ogType?: 'website' | 'article';
}

/**
 * Client meta/title updates (no react-helmet-async — safe with Next.js App Router + React 19).
 */
export function SEOHead(props: SEOHeadProps) {
    useClientSeoHead(props);
    return null;
}

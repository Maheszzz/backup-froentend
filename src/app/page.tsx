import type { Metadata } from 'next';
import { HeroImagePreload } from '@/components/sections/HeroImagePreload';
import { buildHomeSEO } from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import Home from '@/views/Home';

export const metadata: Metadata = pageSeoToMetadata(buildHomeSEO());

/** Homepage shell is static; client islands hydrate listings/search. */
export const revalidate = 3600;

export default function HomePage() {
    return (
        <>
            <HeroImagePreload />
            <Home />
        </>
    );
}

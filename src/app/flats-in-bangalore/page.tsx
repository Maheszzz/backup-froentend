import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildFlatsInBangaloreSEO } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(buildFlatsInBangaloreSEO());

export default function Page() {
    return (
        <Properties
            key="flats-bangalore"
            initialCategory="rent"
            pageTitle="Flats for Rent in Bangalore"
        />
    );
}

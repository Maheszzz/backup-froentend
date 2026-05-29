import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(
    listingsPageSeo({
        pathname: '/rent',
        pageTitle: 'Rent in Bangalore',
        pageSubtitle: 'Flats and houses for rent',
        category: 'rent',
        cityLabel: 'Bangalore',
    }),
);

export default function Page() {
    return <Properties key="rent" initialCategory="rent" initialCity="Bangalore" />;
}

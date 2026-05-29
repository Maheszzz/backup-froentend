import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(
    listingsPageSeo({
        pathname: '/properties',
        pageTitle: 'Properties in Bangalore',
        pageSubtitle: 'PG, rent, buy & plots',
        category: 'all',
        cityLabel: 'Bangalore',
    }),
);

export default function Page() {
    return <Properties key="all" initialCity="Bangalore" />;
}

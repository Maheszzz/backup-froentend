import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(
    listingsPageSeo({
        pathname: '/buy',
        pageTitle: 'Properties for Sale',
        pageSubtitle: 'Find your dream home to buy in Bangalore',
        category: 'buy',
        cityLabel: 'Bangalore',
        noindex: true,
    }),
);

export default function Page() {
    return (
        <Properties
            key="buy"
            initialCategory="buy"
            initialCity="Bangalore"
            pageTitle="Properties for Sale"
            pageSubtitle="Find your dream home to buy in Bangalore"
        />
    );
}

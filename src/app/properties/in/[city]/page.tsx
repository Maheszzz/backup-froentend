import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    const label = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Bangalore';
    return pageSeoToMetadata(
        listingsPageSeo({
            pathname: `/properties/in/${city}`,
            pageTitle: `Properties in ${label}`,
            pageSubtitle: `PG, rent, buy and plots in ${label}`,
            category: 'all',
            cityLabel: label,
        }),
    );
}

export default async function Page({ params }: PageProps) {
    const { city } = await params;
    const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
    return (
        <Properties
            key={`properties-${city}`}
            initialCity={city}
            pageTitle={`Properties in ${t}`}
            pageSubtitle={`Browse listings in ${t}`}
        />
    );
}

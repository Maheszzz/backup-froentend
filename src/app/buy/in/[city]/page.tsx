import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buyBangaloreHubSeo, listingsPageSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    if (city?.toLowerCase() === 'bangalore') {
        return pageSeoToMetadata(buyBangaloreHubSeo());
    }
    const label = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Bangalore';
    return pageSeoToMetadata(
        listingsPageSeo({
            pathname: `/buy/in/${city}`,
            pageTitle: `Buy in ${label}`,
            pageSubtitle: `Properties for sale in ${label}`,
            category: 'buy',
            cityLabel: label,
            noindex: true,
        }),
    );
}

export default async function Page({ params }: PageProps) {
    const { city } = await params;
    const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
    return (
        <Properties
            key={`buy-${city}`}
            initialCategory="buy"
            initialCity={city}
            pageTitle={`Buy in ${t}`}
            pageSubtitle={`Properties for sale in ${t}`}
        />
    );
}

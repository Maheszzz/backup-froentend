import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { listingsPageSeo, plotBangaloreHubSeo } from '@/lib/seo';
import Properties from '@/views/Properties';


type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;
    if (city?.toLowerCase() === 'bangalore') {
        return pageSeoToMetadata(plotBangaloreHubSeo());
    }
    const label = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Bangalore';
    return pageSeoToMetadata(
        listingsPageSeo({
            pathname: `/plots/in/${city}`,
            pageTitle: `Plots in ${label}`,
            pageSubtitle: `Plots and land for sale in ${label}`,
            category: 'plot',
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
            key={`plots-${city}`}
            initialCategory="plot"
            initialCity={city}
            pageTitle={`Plots in ${t}`}
            pageSubtitle={`Plots and land for sale in ${t}`}
        />
    );
}

import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build2BhkSEO } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(build2BhkSEO());

export default function Page() {
    return <Properties key="2bhk" initialCategory="rent" pageTitle="2BHK for Rent in Bangalore" />;
}

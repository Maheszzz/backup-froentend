import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buyBangaloreHubSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buyBangaloreHubSeo());

export { default } from '@/views/BuyBangaloreHub';

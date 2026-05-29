import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { plotBangaloreHubSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(plotBangaloreHubSeo());

export { default } from '@/views/PlotBangaloreHub';

import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildFaqPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildFaqPageSEO());

export { default } from '@/views/FAQ';

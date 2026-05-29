import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildTermsPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildTermsPageSEO());

export { default } from '@/views/Terms';

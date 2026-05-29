import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';

export const metadata: Metadata = pageSeoToMetadata({
    title: 'Page not found',
    description: 'The page you requested does not exist. Browse verified PG and rental listings on MakeMyStay.ai.',
    path: '/404',
    noindex: true,
});

export { default } from '@/views/NotFound';

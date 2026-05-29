import type { Metadata } from 'next';
import { resolveLandmarkPathMetadata } from '@/lib/routeMetadata';

export const metadata: Metadata = resolveLandmarkPathMetadata('/pg-near-prestige-tech-park');

export { default } from '@/views/PgNearLandmarkPage';

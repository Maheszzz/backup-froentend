import type { Metadata } from 'next';
import { resolveLandmarkPathMetadata } from '@/lib/routeMetadata';

export const metadata: Metadata = resolveLandmarkPathMetadata('/pg-near-rmz-ecoworld');

export { default } from '@/views/PgNearLandmarkPage';

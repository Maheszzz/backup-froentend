import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_RAZORPAY_KEY_ID:
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? '',
    },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.amazonaws.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/sitemap.xml',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
            {
                source: '/sitemap-:file.xml',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
            {
                source: '/sitemap-all.xml',
                headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            { source: '/pg-in-btm-layout-under-:price', destination: '/pg/btm', permanent: true },
            { source: '/pg-in-btm-layout', destination: '/pg/btm', permanent: true },
            { source: '/pg-in-:slug-under-:price', destination: '/pg/:slug', permanent: true },
            { source: '/pg-in-:slug', destination: '/pg/:slug', permanent: true },
            { source: '/pg-in-bangalore', destination: '/pg/bangalore', permanent: true },
            {
                source: '/images/blog/hero-sunset.jpg',
                destination: '/images/blog/hero-sunset.webp',
                permanent: true,
            },
            { source: '/hsr-layout-vs-koramangala', destination: '/compare/hsr-layout-vs-koramangala', permanent: true },
            { source: '/hsr-layout-vs-bellandur', destination: '/compare/hsr-layout-vs-bellandur', permanent: true },
            { source: '/whitefield-vs-marathahalli', destination: '/compare/whitefield-vs-marathahalli', permanent: true },
            { source: '/koramangala-vs-indiranagar', destination: '/compare/koramangala-vs-indiranagar', permanent: true },
            { source: '/buy/bangalore', destination: '/buy/in/bangalore', permanent: true },
            { source: '/plot/bangalore', destination: '/plots/in/bangalore', permanent: true },
            { source: '/properties', has: [{ type: 'query', key: 'cat', value: 'pg' }], destination: '/pg/bangalore', permanent: true },
            { source: '/rent-in-whitefield', destination: '/rent/whitefield', permanent: true },
            { source: '/rent-in-marathahalli', destination: '/rent/marathahalli', permanent: true },
            { source: '/rent-in-btm-layout', destination: '/rent/btm', permanent: true },
            { source: '/rent-in-electronic-city', destination: '/rent/electronic-city', permanent: true },
            { source: '/rent-in-indiranagar', destination: '/rent/indiranagar', permanent: true },
            { source: '/rent-in-koramangala', destination: '/rent/koramangala', permanent: true },
            { source: '/rent-in-hsr-layout', destination: '/rent/hsr-layout', permanent: true },
            { source: '/rent-in-bellandur', destination: '/rent/bellandur', permanent: true },
            { source: '/rent-in-sarjapur-road', destination: '/rent/sarjapur-road', permanent: true },
            { source: '/rent-in-hebbal', destination: '/rent/hebbal', permanent: true },
            { source: '/rent-in-jp-nagar', destination: '/rent/jp-nagar', permanent: true },
            { source: '/rent-in-bannerghatta-road', destination: '/rent/bannerghatta-road', permanent: true },
            { source: '/properties/id/:id', destination: '/properties/:id', permanent: true },
            { source: '/properties/:type/:slug', destination: '/properties/:slug', permanent: true },
            { source: '/pg', destination: '/pg/bangalore', permanent: true },
        ];
    },
    async rewrites() {
        return [
            { source: '/api/v1/:path*', destination: 'http://127.0.0.1:8000/api/v1/:path*' },
        ];
    },
};

export default withBundleAnalyzer(nextConfig);

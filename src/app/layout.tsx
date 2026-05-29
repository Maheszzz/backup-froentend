import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import { PageRouteFallback } from '@/components/ui/PageRouteFallback';
import { Providers } from './providers';
import '@/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-montserrat',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://makemystay.ai'),
    title: {
        default: 'Verified PG & 1BHK/2BHK in Bangalore | Zero brokerage rentals | MakeMyStay.ai',
        template: '%s | MakeMyStay.ai',
    },
    description:
        'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage. Book a visit in 60 seconds on MakeMyStay.ai.',
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'MakeMyStay.ai',
        url: 'https://makemystay.ai',
        title: 'Verified PG & 1BHK/2BHK in Bangalore | Zero brokerage rentals | MakeMyStay.ai',
        description:
            'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=630&q=80',
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@Makemystay16268',
    },
    icons: {
        icon: '/logo.svg',
        apple: '/logo.svg',
    },
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#c0392b',
};

/** Cached HTML for hubs/PDPs; client islands hydrate inside Suspense. */
export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}>
            <body className="antialiased font-sans">
                <Script
                    src="https://cdn-in.pagesense.io/js/60068323066/7e76ea503238457e82afc5266e8977c1.js"
                    strategy="lazyOnload"
                />
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-7THZ376P8D" strategy="lazyOnload" />
                <Script id="gtag-init" strategy="lazyOnload">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-7THZ376P8D');
                    gtag('config', 'AW-17957274528');
                    gtag('config', 'AW-11313350010');
                    `}
                </Script>
                <Providers>
                    <Suspense fallback={<PageRouteFallback />}>{children}</Suspense>
                </Providers>
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
import ContactView from '@/views/Contact';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildContactPageSEO } from '@/lib/seo';
import { buildOrganizationSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = pageSeoToMetadata(buildContactPageSEO());

export default function ContactUsPage() {
    const org = buildOrganizationSchema();
    const contactPage = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact MakeMyStay',
        url: `${SITE_URL}/contact-us`,
        description:
            'Contact MakeMyStay for PG and rental support, visit bookings, and operator listing enquiries in Bangalore.',
        mainEntity: org,
    };

    return (
        <>
            <JsonLd id="contact-organization" data={org} />
            <JsonLd id="contact-page" data={contactPage} />
            <ContactView />
        </>
    );
}

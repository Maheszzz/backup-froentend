import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { propertyDetailPageSeo } from '@/lib/seo';
import { buildPropertyPdpFaqs } from '@/lib/propertyClientSeoNarrative';
import type { Property } from '@/types/api';

function plainText(md: string): string {
    return md
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Crawler-visible PDP copy (SSR). Interactive UI hydrates in PropertyDetails on top.
 */
export function PropertyPdpSeoHtml({ property }: { property: Property }) {
    const path = getPropertyDetailPath(property);
    const seo = propertyDetailPageSeo(property, path);
    const title = formatPropertyTitle(property.title) || property.title;
    const about = plainText(
        property.seo_about?.trim() || buildClientSeoAbout(property) || property.description || '',
    );
    const faqs = buildPropertyPdpFaqs(property).slice(0, 6);
    const features = Array.isArray(property.features) ? property.features.filter(Boolean).slice(0, 12) : [];

    return (
        <article
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-800 border-b border-slate-100"
            data-pdp-seo="true"
        >
            <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{seo.title}</p>
            <p className="mt-3 text-slate-600 leading-relaxed">{seo.description}</p>
            <p className="mt-2 text-sm text-slate-500">
                {property.type} · {property.location} · {property.price}
            </p>
            {about.length > 120 && (
                <div className="mt-6 space-y-3 text-slate-700 leading-relaxed text-base">
                    {about.split(/(?<=[.!?])\s+/).reduce<string[]>((acc, sentence) => {
                        const last = acc[acc.length - 1];
                        if (!last || last.length > 400) acc.push(sentence);
                        else acc[acc.length - 1] = `${last} ${sentence}`;
                        return acc;
                    }, []).map((para) => (
                        <p key={para.slice(0, 48)}>{para}</p>
                    ))}
                </div>
            )}
            {features.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-900">Amenities at {title}</h2>
                    <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
                        {features.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>
                </section>
            )}
            {faqs.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-slate-900">FAQs — {title}</h2>
                    <dl className="mt-3 space-y-4">
                        {faqs.map((item) => (
                            <div key={item.question}>
                                <dt className="font-medium text-slate-900">{item.question}</dt>
                                <dd className="mt-1 text-sm text-slate-600 leading-relaxed">{item.answer}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </article>
    );
}

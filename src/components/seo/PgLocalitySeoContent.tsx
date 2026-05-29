import { Link } from '@/lib/navigation';
import { MapPin, Shield } from 'lucide-react';
import { QuickAnswer } from '@/components/seo/QuickAnswer';
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { LocalityAuthoritySections } from '@/components/seo/LocalityAuthoritySections';
import { LocalityInternalLinkHub } from '@/components/seo/LocalityInternalLinkHub';
import { PgRelatedAreasNav } from '@/components/seo/PgRelatedAreasNav';
import { PgLocationDeepContent } from '@/components/seo/PgLocationDeepContent';
import { PgFilterQuickLinks } from '@/components/seo/PgFilterQuickLinks';
import { PeopleAlsoAsk } from '@/components/seo/PeopleAlsoAsk';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildLocalityFaqs, resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { LocalityTrustStrip } from '@/components/trust/LocalityTrustStrip';

export interface PgLocalitySeoContentProps {
    name: string;
    slug: string;
    /** Defaults to `pg-locality-faq-heading` for hub pages; use a unique id on PDP. */
    faqSectionId?: string;
}

/**
 * Shared long-form PG locality SEO: deep copy, tools (filters + insight), Q&A stack, related areas.
 */
export function PgLocalitySeoContent({ name, slug, faqSectionId = 'pg-locality-faq-heading' }: PgLocalitySeoContentProps) {
    const profile = resolveLocalityProfile(slug);
    const faqs = buildLocalityFaqs(name, slug);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <QuickAnswer locationName={name}>{profile.quickAnswer}</QuickAnswer>

            <LocalityTrustStrip slug={slug} name={name} />

            <LocalityAuthoritySections profile={profile} />

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                <PgLocationDeepContent name={name} />
            </div>

            <section
                className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-7 shadow-sm ring-1 ring-slate-900/5"
                aria-labelledby="pg-find-right-heading"
            >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Tools</p>
                <h2 id="pg-find-right-heading" className="mt-1 text-lg font-bold text-slate-900 tracking-tight">
                    Find the right PG
                </h2>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    Shortcuts for budget and amenities — combined with live results below.
                </p>
                <div className="mt-5">
                    <PgFilterQuickLinks slug={slug} />
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/70 bg-emerald-50/60 text-emerald-700">
                        <Shield className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-800">Market note:</span> PG in {name} is popular with
                        students and IT professionals. Expect competition near tech parks — book early for single rooms
                        and meal-inclusive plans.
                    </p>
                </div>
            </section>

            <QuickAnswersBlock locationName={name} />

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                New to Bangalore? Read our{' '}
                <Link to="/blog/pg-in-bangalore-guide" className="font-semibold text-brand-red hover:underline">
                    PG in Bangalore guide
                </Link>{' '}
                for budgets and red flags, or browse{' '}
                <Link to={`/rent/${slug}`} className="font-semibold text-brand-red hover:underline">
                    flats for rent in {name}
                </Link>{' '}
                if you prefer an independent flat.
            </p>

            <PeopleAlsoAsk items={faqs} />

            <FaqSection
                id={faqSectionId}
                title={`Frequently asked — PG in ${name}`}
                items={faqs}
                collapsible
                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
            />

            <LocalityInternalLinkHub profile={profile} />

            <PgRelatedAreasNav currentSlug={slug} nearbySlugs={profile.nearbySlugs} />
        </div>
    );
}

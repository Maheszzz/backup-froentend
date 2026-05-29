import { Banknote, MapPin, Shield, Users, Utensils, Wifi, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/navigation';

interface PgLocationDeepContentProps {
    name: string;
}

/**
 * Long-form, location-specific copy for SEO (unique via {name}) with scannable layout.
 */
export function PgLocationDeepContent({ name }: PgLocationDeepContentProps) {
    const whyItems = [
        {
            title: 'Verified listings',
            body: 'Real photos and structured details on every PG we show.',
            icon: Shield,
        },
        {
            title: 'Transparent pricing',
            body: 'Compare rent and inclusions side by side before you enquire.',
            icon: Banknote,
        },
        {
            title: 'Prime micro-areas',
            body: `Including ${name} and other high-demand Bangalore corridors.`,
            icon: MapPin,
        },
        {
            title: 'Visits & booking',
            body: 'Schedule visits and pay booking tokens online where enabled.',
            icon: Users,
        },
    ];

    return (
        <article className="not-prose">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 md:gap-6 mb-8 md:mb-10">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red/[0.08] to-amber-400/[0.12] border border-brand-red/15 shadow-sm"
                    aria-hidden
                >
                    <MapPin className="h-7 w-7 text-brand-red" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Area guide</p>
                    <h2 className="mt-1.5 text-2xl md:text-[1.65rem] font-bold text-slate-900 tracking-tight leading-tight">
                        About PG in {name}
                    </h2>
                    <p className="mt-3 text-slate-600 text-[15px] md:text-base leading-relaxed max-w-3xl">
                        Looking for the best <strong className="text-slate-800 font-semibold">PG in {name}</strong>?
                        MakeMyStay.ai lists fully furnished paying guest and coliving options with transparent pricing —
                        whether you are a student, fresher, or working professional near Bangalore&apos;s tech corridors.
                        Compare room types (single, double, or multi-sharing), meal plans, and maintenance inclusions
                        before you shortlist or pay a booking token.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Banknote className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Typical rent</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 tabular-nums">₹6,000 – ₹18,000</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug">Per month · varies by room &amp; meals</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Wifi className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Amenities</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                        WiFi, backup, housekeeping &amp; security on most stays
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">Confirm on each listing</p>
                </div>
                <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Utensils className="h-4 w-4 shrink-0 text-brand-red/90" aria-hidden />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Food</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">Often 2–3 meals / day</p>
                    <p className="text-xs text-slate-500 mt-1.5">Veg &amp; non-veg — check the PG you pick</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-6 mb-8 md:mb-10">
                <div className="space-y-4 text-[15px] md:text-[16px] text-slate-600 leading-relaxed">
                    <p>
                        {name} continues to attract renters who want shorter commutes and reliable daily routines. Most
                        professionally managed PGs here bundle <strong className="text-slate-800 font-semibold">high-speed WiFi</strong>, power backup, housekeeping, and security features such as CCTV and controlled access. Food may be included as 2–3 meals per day or offered as an add-on — always confirm veg/non-veg availability and timings on the listing you like.
                    </p>
                    <p>
                        Budget expectations in {name} typically fall between{' '}
                        <strong className="text-slate-800 font-semibold">₹6,000 and ₹18,000 per month</strong> depending
                        on occupancy, floor space, AC/non-AC, and how premium the property is. Use the filters on this page
                        to narrow by price, sort by rating, and read real photos before you visit. If you are new to the
                        city, prioritise walkable access to metro or bus routes and clarify deposit and notice-period rules 
                        with the operator.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                        <Link to="/pg/bangalore" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:underline group">
                            Explore full City Guide <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link to={`/pg-in-${name.toLowerCase().replace(/\s+/g, '-')}-under-10000`} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-brand-red decoration-slate-300 hover:decoration-brand-red underline underline-offset-4">
                            Budget PGs in {name}
                        </Link>
                    </div>
                    <p>
                        MakeMyStay.ai focuses on <strong className="text-slate-800 font-semibold">verified listings</strong>{' '}
                        and clear information so you spend less time on broker calls and more time choosing the right room.
                        Scroll down to browse live PG inventory in {name}, see quick answers for typical rent and
                        amenities, and read FAQs tailored to this locality.
                    </p>
                </div>
            </div>

            <div className="pt-2">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                    Why choose MakeMyStay.ai in {name}?
                </h3>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 list-none p-0 m-0">
                    {whyItems.map(({ title, body, icon: Icon }) => (
                        <li
                            key={title}
                            className="flex gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03] transition-shadow hover:shadow-md hover:border-slate-300/80"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100/80">
                                <Icon className="h-5 w-5 text-emerald-700" aria-hidden />
                            </span>
                            <span className="min-w-0 pt-0.5">
                                <span className="block font-semibold text-slate-900 text-sm md:text-[15px]">{title}</span>
                                <span className="block text-slate-600 text-sm mt-1 leading-relaxed">{body}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}

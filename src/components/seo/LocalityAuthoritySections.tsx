import { Building2, GraduationCap, Shield, Train, Wifi } from 'lucide-react';
import type { PgLocalityDeepProfile } from '@/types/localityContent';

interface LocalityAuthoritySectionsProps {
    profile: PgLocalityDeepProfile;
}

function ChipList({ items }: { items: string[] }) {
    if (items.length === 0) return <span className="text-sm text-slate-500">See listings for specifics.</span>;
    return (
        <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {items.map((item) => (
                <li
                    key={item}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800"
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}

/**
 * Deep locality utility content for topical authority + entity coverage.
 */
export function LocalityAuthoritySections({ profile }: LocalityAuthoritySectionsProps) {
    const { name } = profile;

    return (
        <div className="space-y-6" data-seo="locality-authority">
            <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Living in {name} — at a glance</h2>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <p className="font-semibold text-slate-900">Shared PG</p>
                        <p>{profile.rent.shared}/mo</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">Single / private</p>
                        <p>{profile.rent.single}/mo</p>
                    </div>
                    {profile.rent.note && (
                        <p className="sm:col-span-2 text-slate-500 text-xs">{profile.rent.note}</p>
                    )}
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-4">
                <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                        <Train className="w-4 h-4 text-brand-red" aria-hidden />
                        Metro &amp; commute
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.metro}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{profile.commute}</p>
                </section>
                <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                        <Shield className="w-4 h-4 text-brand-red" aria-hidden />
                        Safety
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.safety}</p>
                </section>
                <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                        <Building2 className="w-4 h-4 text-brand-red" aria-hidden />
                        Nearby offices
                    </div>
                    <ChipList items={profile.nearbyOffices} />
                </section>
                <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                        <GraduationCap className="w-4 h-4 text-brand-red" aria-hidden />
                        Colleges nearby
                    </div>
                    <ChipList items={profile.nearbyColleges} />
                </section>
                <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                        <Wifi className="w-4 h-4 text-brand-red" aria-hidden />
                        Internet &amp; lifestyle
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.internet}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{profile.foodNightlife}</p>
                    <p className="mt-3 text-sm">
                        <strong className="text-slate-800">Best streets:</strong> {profile.bestStreets.join(', ')}
                    </p>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6">
                <h2 className="text-lg font-bold text-slate-900">Who is PG in {name} best for?</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                    <li>
                        <strong>Students:</strong> {profile.idealFor.students}
                    </li>
                    <li>
                        <strong>Working professionals:</strong> {profile.idealFor.professionals}
                    </li>
                </ul>
                {profile.entities.length > 0 && (
                    <p className="mt-4 text-xs text-slate-500">
                        Related places: {profile.entities.join(' · ')}
                    </p>
                )}
            </section>
        </div>
    );
}

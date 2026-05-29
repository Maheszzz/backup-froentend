interface QuickAnswersBlockProps {
    locationName: string;
    /** `dark` matches charcoal footer surfaces; default is light cards for hub pages. */
    variant?: 'light' | 'dark';
}

/**
 * AEO-oriented concise facts (voice + AI snippets).
 */
export function QuickAnswersBlock({ locationName, variant = 'light' }: QuickAnswersBlockProps) {
    const isDark = variant === 'dark';

    const shell = isDark
        ? 'rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-sm'
        : 'rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm';

    const titleCls = isDark ? 'text-lg font-bold text-white' : 'text-lg font-bold text-slate-900';
    const labelCls = isDark ? 'min-w-[5.5rem] font-semibold text-slate-200' : 'min-w-[5.5rem] font-semibold text-slate-900';
    const valueCls = isDark ? 'text-sm text-slate-300' : 'text-sm text-slate-700';

    return (
        <section className={shell} aria-labelledby="quick-answers-heading">
            <h2 id="quick-answers-heading" className={titleCls}>
                Quick answers — PG in {locationName}
            </h2>
            <ul className={`mt-4 space-y-2.5 ${valueCls} list-none p-0`}>
                <li className="flex gap-2">
                    <strong className={labelCls}>Price</strong>
                    <span>₹6,000–₹15,000/mo (varies by sharing, AC, meals)</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>WiFi</strong>
                    <span>High-speed internet on most verified PGs in {locationName}</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Food</strong>
                    <span>2–3 meals often included; veg/non-veg depends on operator</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Security</strong>
                    <span>CCTV, biometric access &amp; warden support common in premium stays</span>
                </li>
                <li className="flex gap-2">
                    <strong className={labelCls}>Commute</strong>
                    <span>
                        {locationName} — check each listing for distance to offices, metro &amp; bus routes
                    </span>
                </li>
            </ul>
        </section>
    );
}

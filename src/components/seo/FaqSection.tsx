import type { ReactNode } from 'react';
import type { FaqItem } from '@/lib/schema';

interface FaqSectionProps {
    id?: string;
    title: string;
    items: FaqItem[];
    /** Optional icon shown before title (e.g. MapPin). */
    titleAdornment?: ReactNode;
    className?: string;
    /** `dark` for charcoal footer; default is light cards. */
    variant?: 'light' | 'dark';
    /** Native details/summary (light variant only); full text stays in DOM for SEO. */
    collapsible?: boolean;
}

export function FaqSection({
    id = 'faq-heading',
    title,
    items,
    titleAdornment,
    className = '',
    variant = 'light',
    collapsible = false,
}: FaqSectionProps) {
    const isDark = variant === 'dark';
    const useCollapsible = collapsible && !isDark;

    const shell = isDark
        ? 'rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm ring-1 ring-white/5 backdrop-blur-sm'
        : 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

    const h2Cls = isDark
        ? 'text-lg font-bold text-white flex items-center gap-2'
        : 'text-lg font-bold text-slate-900 flex items-center gap-2';
    const dtCls = isDark ? 'font-semibold text-slate-100' : 'font-semibold text-slate-900';
    const ddCls = isDark ? 'mt-1.5 text-sm text-slate-400 leading-relaxed' : 'mt-1.5 text-sm text-slate-600 leading-relaxed';

    return (
        <section className={`${shell} ${className}`} aria-labelledby={id}>
            <h2 id={id} className={h2Cls}>
                {titleAdornment}
                {title}
            </h2>

            {useCollapsible ? (
                <div className="mt-5 space-y-2">
                    {items.map((f) => (
                        <details
                            key={f.question}
                            className="group rounded-xl border border-slate-100 bg-slate-50/50 transition-colors open:border-slate-200 open:bg-white"
                        >
                            <summary className="cursor-pointer list-none px-4 py-3.5 text-left text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                                {f.question}
                            </summary>
                            <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm text-slate-600 leading-relaxed">
                                {f.answer}
                            </div>
                        </details>
                    ))}
                </div>
            ) : (
                <dl className="mt-5 space-y-5">
                    {items.map((f) => (
                        <div key={f.question}>
                            <dt className={dtCls}>{f.question}</dt>
                            <dd className={ddCls}>{f.answer}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    );
}

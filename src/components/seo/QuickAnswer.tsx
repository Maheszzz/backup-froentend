import type { ReactNode } from 'react';

interface QuickAnswerProps {
    children: ReactNode;
    locationName?: string;
}

/**
 * AEO lead block — concise answer for AI Overviews, voice, and featured snippets.
 */
export function QuickAnswer({ children, locationName }: QuickAnswerProps) {
    return (
        <section
            className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-5 md:p-6 shadow-sm ring-1 ring-emerald-900/5"
            aria-label={locationName ? `Quick answer: PG in ${locationName}` : 'Quick answer'}
            data-seo="locality-quick-answer"
        >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800/80">Quick answer</p>
            <p className="mt-2 text-[15px] md:text-base text-slate-800 leading-relaxed font-medium">{children}</p>
        </section>
    );
}

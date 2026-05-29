import { CalendarDays, Phone } from 'lucide-react';

/** Same support line as MobileBottomCTA. */
const TEL_HREF = 'tel:+918150099911';

interface PropertyStickyActionsProps {
    onBookVisit: () => void;
}

/**
 * Call + Book visit — fixed above global mobile bottom bar; bottom-right on md+.
 */
export function PropertyStickyActions({ onBookVisit }: PropertyStickyActionsProps) {
    return (
        <div className="fixed z-[38] flex flex-col gap-2 right-3 sm:right-4 w-[min(100vw-1.5rem,11rem)] md:w-auto md:min-w-[10.5rem] bottom-[max(calc(env(safe-area-inset-bottom,0px)+5.75rem),5.75rem)] md:bottom-[6.5rem] md:right-6">
            <a
                href={TEL_HREF}
                onClick={() => console.log('[TRACK] Sticky Call clicked')}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800 md:min-h-[48px]"
            >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                Call now
            </a>
            <button
                type="button"
                onClick={() => {
                    console.log('[TRACK] Sticky Book visit clicked');
                    onBookVisit();
                }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-brand-red bg-white px-4 py-3 text-sm font-bold text-brand-red shadow-md transition hover:bg-red-50"
            >
                <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                Book visit
            </button>
        </div>
    );
}

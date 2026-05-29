/** Minimal shell while client routes with `useSearchParams` hydrate (ISR Suspense boundary). */
export function PageRouteFallback() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center bg-slate-50" aria-hidden>
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-brand-red animate-spin" />
        </div>
    );
}

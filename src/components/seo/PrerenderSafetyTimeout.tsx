import { useEffect } from 'react';

/** Max wait for Prerender.io if a route forgets to set `prerenderReady`. */
const PRERENDER_MAX_MS = 12_000;

export function PrerenderSafetyTimeout() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const t = window.setTimeout(() => {
            if (!window.prerenderReady) {
                window.prerenderReady = true;
            }
        }, PRERENDER_MAX_MS);
        return () => window.clearTimeout(t);
    }, []);
    return null;
}

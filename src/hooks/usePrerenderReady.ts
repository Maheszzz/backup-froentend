import { useEffect } from 'react';

declare global {
    interface Window {
        prerenderReady?: boolean;
    }
}

/**
 * Signal Prerender.io when async SEO content is ready (listings, PDP, etc.).
 * Call with `ready: true` when loading finished; resets to false when deps change.
 */
export function usePrerenderReady(ready: boolean, deps: unknown[] = []): void {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.prerenderReady = ready;
    }, [ready, ...deps]);
}

/** Initial state before route-specific hooks run. */
export function setPrerenderNotReady(): void {
    if (typeof window !== 'undefined') {
        window.prerenderReady = false;
    }
}

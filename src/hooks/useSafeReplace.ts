import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client-side replace without rendering <Navigate /> (avoids Helmet/DOM races in Next.js App Router).
 */
export function useSafeReplace(href: string | null | undefined, enabled: boolean): void {
    const router = useRouter();
    const lastHref = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || !href) {
            lastHref.current = null;
            return;
        }
        if (lastHref.current === href) return;
        lastHref.current = href;

        const frame = requestAnimationFrame(() => {
            router.replace(href);
        });
        return () => cancelAnimationFrame(frame);
    }, [enabled, href, router]);
}

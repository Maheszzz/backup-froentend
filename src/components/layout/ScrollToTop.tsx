import { useEffect, useRef } from "react";
import { useLocation } from '@/lib/navigation';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        // Only act on actual route changes or initial mount
        if (hash) {
            // Hash-based smooth scroll (e.g. /#services)
            const id = hash.replace('#', '');
            const tryScroll = (attempt = 0) => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (attempt < 10) {
                    // Retry until element is rendered (Suspense / lazy load)
                    requestAnimationFrame(() => tryScroll(attempt + 1));
                }
            };
            // Small delay for route transition to complete
            setTimeout(() => tryScroll(), 50);
        } else {
            // Normal page navigation — instant scroll to top
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

            // Fallback: ensure scroll after Suspense resolves
            requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
            });

            // Double fallback for heavy pages
            const tid = setTimeout(() => {
                if (window.scrollY > 0) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                }
            }, 200);

            prevPathname.current = pathname;
            return () => clearTimeout(tid);
        }

        prevPathname.current = pathname;
    }, [pathname, hash]);

    return null;
}

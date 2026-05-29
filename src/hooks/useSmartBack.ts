import { useCallback } from 'react';
import { useLocation, useNavigate } from '@/lib/navigation';

type SmartBackOptions = {
    fallback: string;
    /**
     * Optional key in `location.state` for the "from" URL.
     * Defaults to "from".
     */
    fromKey?: string;
};

/**
 * Consistent back navigation:
 * - If `location.state[fromKey]` exists (string), navigate to it (replace).
 * - Else if SPA history index > 0, navigate(-1).
 * - Else navigate to fallback (replace).
 */
export function useSmartBack({ fallback, fromKey = 'from' }: SmartBackOptions) {
    const navigate = useNavigate();
    const location = useLocation();

    return useCallback(() => {
        const state = location.state as any;
        const from = state?.[fromKey];

        if (typeof from === 'string' && from.length > 0) {
            navigate(from, { replace: true });
            return;
        }

        const idx =
            window.history.state && typeof window.history.state.idx === 'number'
                ? window.history.state.idx
                : 0;

        if (idx > 0) navigate(-1);
        else navigate(fallback, { replace: true });
    }, [fallback, fromKey, location.state, navigate]);
}


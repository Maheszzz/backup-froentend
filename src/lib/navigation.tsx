'use client';

/**
 * React Router → Next.js App Router compatibility layer.
 * Import from here instead of `react-router-dom` during the Next migration.
 */
import NextLink from 'next/link';
import {
    useParams as useNextParams,
    usePathname,
    useRouter,
    useSearchParams as useNextSearchParams,
} from 'next/navigation';
import {
    useCallback,
    useEffect,
    useMemo,
    type ComponentProps,
    type ReactNode,
} from 'react';

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
    return useNextParams() as T;
}

type SetSearchParamsArg =
    | URLSearchParams
    | Record<string, string>
    | ((prev: URLSearchParams) => URLSearchParams);

export function useSearchParams(): [
    URLSearchParams,
    (next: SetSearchParamsArg, options?: { replace?: boolean }) => void,
] {
    const router = useRouter();
    const pathname = usePathname() ?? '/';
    const nextParams = useNextSearchParams();

    const searchParams = useMemo(
        () => new URLSearchParams(nextParams?.toString() ?? ''),
        [nextParams],
    );

    const setSearchParams = useCallback(
        (next: SetSearchParamsArg, options?: { replace?: boolean }) => {
            let params: URLSearchParams;
            if (typeof next === 'function') {
                params = next(new URLSearchParams(nextParams?.toString() ?? ''));
            } else if (next instanceof URLSearchParams) {
                params = next;
            } else {
                params = new URLSearchParams();
                for (const [k, v] of Object.entries(next)) {
                    if (v !== undefined && v !== '') params.set(k, v);
                }
            }
            const qs = params.toString();
            const href = qs ? `${pathname}?${qs}` : pathname;
            if (options?.replace) router.replace(href);
            else router.push(href);
        },
        [pathname, router, nextParams],
    );

    return [searchParams, setSearchParams];
}

/**
 * Pathname-only location (safe during ISR/static generation).
 * For query strings use `useSearchParams()` inside a Suspense boundary.
 */
export function useLocation() {
    const pathname = usePathname() ?? '/';
    return {
        pathname,
        search: '',
        hash: '',
        state: null as unknown,
        key: 'default',
    };
}

/** Listing cards: preserve full URL for back-navigation state (call inside Suspense). */
export function useListingFromUrl(): { pathname: string; search: string; from: string } {
    const pathname = usePathname() ?? '/';
    const nextParams = useNextSearchParams();
    const qs = nextParams?.toString() ?? '';
    const search = qs ? `?${qs}` : '';
    return { pathname, search, from: `${pathname}${search}` };
}

export function useNavigate() {
    const router = useRouter();
    return (to: LegacyTo | number, options?: { replace?: boolean }) => {
        if (typeof to === 'number') {
            window.history.go(to);
            return;
        }
        const href = resolveNavigationHref(to);
        if (options?.replace) router.replace(href);
        else router.push(href);
    };
}

type LegacyTo =
    | string
    | {
          pathname?: string;
          search?: string;
          hash?: string;
      };

/** React Router `to` → Next.js `href` string. */
export function resolveNavigationHref(to: LegacyTo): string {
    if (typeof to === 'string') {
        if (!to || to.includes('[object Object]')) return '/';
        return to;
    }
    if (!to || typeof to !== 'object' || !('pathname' in to || 'search' in to || 'hash' in to)) {
        return '/';
    }
    const pathname = to.pathname || '/';
    const search = to.search ? (to.search.startsWith('?') ? to.search : `?${to.search}`) : '';
    const hash = to.hash ? (to.hash.startsWith('#') ? to.hash : `#${to.hash}`) : '';
    return `${pathname}${search}${hash}`;
}

type AppLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
    to: LegacyTo;
    replace?: boolean;
    /** React Router legacy — ignored under Next.js (use URL or sessionStorage if needed). */
    state?: unknown;
};

export function Link({ to, replace, state: _state, ...props }: AppLinkProps) {
    const { href: _ignoredHref, to: _ignoredTo, ...rest } = props as AppLinkProps & { href?: string };
    return <NextLink href={resolveNavigationHref(to)} replace={replace} scroll {...rest} />;
}

export function Navigate({ to, replace = true }: { to: LegacyTo; replace?: boolean }) {
    const router = useRouter();
    useEffect(() => {
        const href = resolveNavigationHref(to);
        if (replace) router.replace(href);
        else router.push(href);
    }, [to, replace, router]);
    return null;
}

/** Legacy stubs — routing is file-based in `app/`; no runtime router tree. */
export function BrowserRouter({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export function Routes({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export function Route(_props: { path?: string; element?: ReactNode }) {
    return null;
}

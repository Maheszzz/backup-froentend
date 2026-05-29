/** SSR-safe access to localStorage / sessionStorage (no-ops on the server). */

export function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

export function getLocalItem(key: string): string | null {
    if (!isBrowser()) return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function setLocalItem(key: string, value: string): void {
    if (!isBrowser()) return;
    try {
        localStorage.setItem(key, value);
    } catch {
        /* private mode / quota */
    }
}

export function removeLocalItem(key: string): void {
    if (!isBrowser()) return;
    try {
        localStorage.removeItem(key);
    } catch {
        /* ignore */
    }
}

export function getSessionItem(key: string): string | null {
    if (!isBrowser()) return null;
    try {
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

export function setSessionItem(key: string, value: string): void {
    if (!isBrowser()) return;
    try {
        sessionStorage.setItem(key, value);
    } catch {
        /* ignore */
    }
}

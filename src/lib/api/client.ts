import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';
import { getLocalItem } from '@/lib/browserStorage';
import { getApiBaseUrl, isDev } from '@/lib/env';

/** Public site hostnames that serve this SPA (www vs apex are different browser origins). */
const SAME_BRAND_SITE_HOSTS = new Set(['makemystay.ai', 'www.makemystay.ai']);

/**
 * Resolve API base URL.
 * On makemystay.ai / www we always use relative `/api/v1` so requests stay same-origin even if
 * an old build baked in `https://www...` vs apex — cross-origin + CORS caused pending requests
 * and "Provisional headers" in DevTools. Other hosts still use env / fallbacks.
 */
function resolveApiBaseUrl(): string {
    const raw = getApiBaseUrl();
    if (isDev()) {
        return raw || '/api/v1';
    }
    if (typeof window !== 'undefined') {
        const pageHost = window.location.hostname;
        if (SAME_BRAND_SITE_HOSTS.has(pageHost)) {
            return '/api/v1';
        }
    }
    if (!raw) {
        return typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1';
    }
    const normalized = raw.replace(/\/+$/, '');
    if (typeof window === 'undefined') return normalized;
    try {
        const envUrl = normalized.startsWith('http')
            ? new URL(normalized)
            : new URL(normalized, window.location.origin);
        const pageHost = new URL(window.location.origin).hostname;
        if (envUrl.origin === window.location.origin) return normalized;
        if (
            SAME_BRAND_SITE_HOSTS.has(envUrl.hostname) &&
            SAME_BRAND_SITE_HOSTS.has(pageHost)
        ) {
            return `${window.location.origin}/api/v1`;
        }
        return normalized;
    } catch {
        return normalized;
    }
}

/** Prefer VITE_API_BASE_URL; VITE_API_URL kept for older .env / README compatibility. */
export const API_BASE_URL = resolveApiBaseUrl();

function localhostApiHint(): string {
    const base = API_BASE_URL || 'http://localhost:8000/api/v1';
    return `Expected backend at ${base}. If you're developing locally, start FastAPI on port 8000 and use ENV=development so localhost origins are allowed.`;
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL || undefined,
    headers: {
        'Content-Type': 'application/json',
    },
    // Payment + DB calls can take a moment on cold start.
    // Keep this long enough to avoid classifying slow backend as "no response".
    timeout: 45000, // 45 seconds to account for backend DB connection retries
});

// Request interceptor for adding auth tokens if needed in the future
apiClient.interceptors.request.use(
    (config) => {
        const token = getLocalItem('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling standardized API format {success, data, error}
apiClient.interceptors.response.use(
    (response) => {
        const data = response.data as any;
        
        // If it's a standardized successful response, unwrap and return just the data
        if (data && typeof data === 'object' && 'success' in data && data.success === true) {
            // Update the response data to be the unwrapped payload.
            // Guard against null/undefined data.data — coerce to {} so downstream
            // `.items`, `.map()` etc. get `undefined` instead of crashing on `null`.
            // We use truthy check `data.data` because `null` and `undefined` are both falsy.
            response.data = (data.data && typeof data.data === 'object') ? data.data : {};
            return response;
        }
        
        // If it's a standardized failure but with 200 OK (from global_exception_handler)
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
            const error: ApiError = {
                message: data.error || 'An unexpected error occurred',
                status: response.status,
                detail: data.error,
            };
            return Promise.reject(error);
        }

        return response;
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: 'An error occurred',
            status: error.response?.status || 500,
            detail: error.message,
        };

        if (error.response) {
            // Server responded with error status
            const data = error.response.data as any;

            // Handle standardized error format even if status is not 200
            if (data && typeof data === 'object' && data.success === false) {
                apiError.message = data.error || 'A server error occurred';
                apiError.detail = data.error;
            } else {
                // Extract a clean string message, handling FastAPI's 422 array of validation details
                let parsedDetail = data?.detail || error.message;
                if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
                    parsedDetail = data.detail[0].msg;
                } else if (Array.isArray(data?.message) && data.message[0]?.msg) {
                    parsedDetail = data.message[0].msg;
                }

                apiError.message = typeof data?.message === 'string' ? data.message : parsedDetail;
                apiError.detail = parsedDetail;
            }
        } else if (error.request) {
            // Request made but no response received (or we hit a timeout)
            if (error.code === 'ECONNABORTED') {
                apiError.message = 'Request timed out while waiting for backend.';
                apiError.detail =
                    `Backend may be slow or blocked (often due to DB connectivity). ${localhostApiHint()}`;
            } else {
                apiError.message = 'Cannot reach the backend from this page.';
                apiError.detail = `${localhostApiHint()} This can also happen when CORS is blocking localhost requests.`;
            }
        }

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);

export async function apiRequest<T>(
    config: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await apiClient.request<T>(config);
        // Explicit safety: if we got a response but it's not JSON (e.g. an HTML error page from Nginx),
        // coerce to an empty object to avoid "undefined is not a function" or ".map is not a function" downstream.
        const result = response.data;
        if (result && typeof result === 'object') {
            return result as T;
        }

        // Capture edge case for debugging: if we got a 200/2XX but no object body
        if (response.status >= 200 && response.status < 300) {
            console.warn(`[apiRequest] Response for ${config.url} returned non-object data:`, typeof result, result);
        }

        // Fallback for unexpected data types
        return {} as T;
    } catch (error) {
        // Interceptor already logs and transforms most errors into ApiError objects.
        // This catch block handles any catastrophic failures that bypassed the interceptor.
        console.error(`[apiRequest] Critical failure for ${config.url}:`, error);
        return {} as T;
    }
}

// Convenience methods
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'PUT', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'DELETE', url }),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiRequest<T>({ ...config, method: 'PATCH', url, data }),
};

export default apiClient;

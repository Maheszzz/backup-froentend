import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

function sendToGoogleAnalytics({ name, value, id }: Metric) {
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof g !== 'function') return;
    const rounded = name === 'CLS' ? Math.round(value * 1000) : Math.round(value);
    g('event', name, {
        value: rounded,
        metric_id: id,
        metric_value: value,
        metric_delta: value,
        non_interaction: true,
    });
}

/** Send Core Web Vitals to GA4 when `gtag` is present (production). */
export function initWebVitalsReporting(): void {
    if (typeof window === 'undefined') return;
    onLCP(sendToGoogleAnalytics);
    onINP(sendToGoogleAnalytics);
    onCLS(sendToGoogleAnalytics);
}

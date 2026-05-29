import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { initWebVitalsReporting } from './lib/reportWebVitals';
import './globals.css';

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>,
);

// Prerender.io: route hooks set `prerenderReady` when async SEO content is ready.
if (typeof window !== 'undefined') {
    (window as any).prerenderReady = false;
    initWebVitalsReporting();
}

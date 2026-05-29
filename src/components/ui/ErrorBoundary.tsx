import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Top-level Error Boundary: prevents the entire app from going blank on any
 * uncaught render/lifecycle exception. Shows a branded recovery screen so users
 * can refresh instead of seeing a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                        fontFamily: 'Inter, sans-serif',
                        padding: '2rem',
                        textAlign: 'center',
                    }}
                >
                    {/* Brand mark */}
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg,#e92e35,#b01018)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            boxShadow: '0 8px 24px -4px rgba(217,32,39,0.35)',
                        }}
                    >
                        {/* exclamation mark */}
                        <span style={{ color: '#fff', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
                            !
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: '1.6rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Something went wrong
                    </h1>
                    <p
                        style={{
                            color: '#64748b',
                            maxWidth: 420,
                            lineHeight: 1.65,
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                        }}
                    >
                        We hit an unexpected error on this page. Try refreshing — if the
                        problem persists, contact support.
                    </p>

                    {/* Error detail (dev / debug aid — hidden in tiny collapsed block) */}
                    {this.state.error && (
                        <details
                            style={{
                                marginBottom: '1.5rem',
                                maxWidth: 520,
                                textAlign: 'left',
                                background: '#fff',
                                borderRadius: 12,
                                border: '1px solid #e2e8f0',
                                padding: '0.75rem 1rem',
                            }}
                        >
                            <summary
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#94a3b8',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Error details
                            </summary>
                            <pre
                                style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: '#b91c1c',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {this.state.error.message}
                                {'\n'}
                                {this.state.error.stack?.slice(0, 800)}
                            </pre>
                        </details>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.7rem 2rem',
                            borderRadius: 12,
                            background: 'linear-gradient(135deg,#e92e35,#b01018)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px -2px rgba(217,32,39,0.4)',
                            marginRight: '0.75rem',
                        }}
                    >
                        Refresh page
                    </button>
                    <a
                        href="/"
                        style={{
                            padding: '0.7rem 2rem',
                            borderRadius: 12,
                            background: '#fff',
                            color: '#0f172a',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        Go home
                    </a>
                </div>
            );
        }

        return this.props.children;
    }
}

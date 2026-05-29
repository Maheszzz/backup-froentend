import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
    message?: string;
}

export function LoadingSpinner({ size = 24, className = '', message }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className="animate-spin text-emerald-600" size={size} />
            {message && <p className="text-sm text-slate-500">{message}</p>}
        </div>
    );
}

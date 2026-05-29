import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
    message: string;
    detail?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({ message, detail, onRetry, className = '' }: ErrorMessageProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
            <div className="flex items-center gap-3 text-red-600">
                <AlertCircle size={32} />
                <h3 className="text-xl font-semibold">Error</h3>
            </div>
            <p className="text-slate-700 text-center max-w-md">{message}</p>
            {detail && (
                <p className="text-sm text-slate-500 text-center max-w-md">{detail}</p>
            )}
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    Retry
                </Button>
            )}
        </div>
    );
}

import React, { useEffect } from 'react';
import { ShieldAlert, X, ShieldCheck, CreditCard, Ban } from 'lucide-react';

interface SafetyPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Pro-level payment security notice — compact corner card (bottom-left).
 * Non-blocking: no body scroll lock, no backdrop overlay.
 */
export const SafetyPopup: React.FC<SafetyPopupProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed z-[200] bottom-5 left-4 right-4 sm:right-auto sm:w-[22rem] pointer-events-none animate-in slide-in-from-bottom-3 fade-in duration-300"
            role="dialog"
            aria-modal="false"
            aria-labelledby="safety-popup-title"
        >
            <div className="pointer-events-auto overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.45)]">

                {/* Gradient top bar */}
                <div className="h-[3px] bg-gradient-to-r from-amber-400 via-red-500 to-rose-600" />

                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/60">
                            <ShieldAlert className="h-4 w-4 text-red-600" aria-hidden />
                        </div>
                        <div>
                            <h2
                                id="safety-popup-title"
                                className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none"
                            >
                                Payment Security
                            </h2>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 tracking-wide uppercase">
                                MakeMyStay Official Notice
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        aria-label="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-3 space-y-2.5">
                    {/* Rule rows */}
                    <div className="flex items-start gap-2.5">
                        <Ban className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" aria-hidden />
                        <p className="text-[12px] text-slate-700 font-semibold leading-snug">
                            No cash · No third-party links · No personal UPI transfers
                        </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
                        <p className="text-[12px] text-slate-700 leading-snug">
                            Pay only through{' '}
                            <span className="font-extrabold text-brand-red">MakeMyStay verified channels</span>.
                        </p>
                    </div>

                    {/* Warning callout */}
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/70 px-3 py-2">
                        <span className="text-amber-500 text-[13px] shrink-0 leading-none mt-0.5">⚠</span>
                        <p className="text-[11px] text-amber-900 font-medium leading-snug">
                            We will <strong>never</strong> ask for payment via cash or unauthorized platforms. Report suspicious requests immediately.
                        </p>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="px-4 pb-4 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-[13px] font-bold tracking-wide shadow-md shadow-slate-900/15 transition-all"
                    >
                        I understand, proceed safely
                    </button>

                    <div className="mt-2.5 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <ShieldCheck className="w-3 h-3" aria-hidden />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                        </div>
                        <div className="w-px h-2.5 bg-slate-200" aria-hidden />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Razorpay encrypted
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

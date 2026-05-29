import { useEffect, useState } from 'react';
import { useLocation } from '@/lib/navigation';

const WHATSAPP_NUMBER = '8150099911'; // +91 81500 99911
const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi MakeMyStay! 👋 I'm interested in finding a property. Can you help me?"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export function WhatsAppWidget() {
    const { pathname } = useLocation();
    /** Avoid hover-expand + overlap with PropertyStickyActions (Call / Book visit). */
    const isPropertyDetailPage = pathname.startsWith('/properties/') || /^\/pg\/\d+/.test(pathname);

    const [isOpen, setIsOpen] = useState(false);
    const [showBounce, setShowBounce] = useState(false);

    // Auto-show a subtle bounce after 3s to catch attention
    useEffect(() => {
        const t = setTimeout(() => setShowBounce(true), 3000);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {/* ── Popupcard ── */}
            <div
                className="fixed z-[999] hidden md:block"
                style={{
                    bottom: '90px',
                    right: '24px',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
                    transition: 'opacity 0.28s ease, transform 0.28s ease',
                }}
            >
                <div
                    className="w-72 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ background: '#075E54' }}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: '#25D366' }}
                            >
                                MS
                            </div>
                            {/* Online dot */}
                            <span
                                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                                style={{ background: '#4ADE80' }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm leading-tight">MakeMyStay.ai</p>
                            <p className="text-green-200 text-xs">Typically replies instantly</p>
                        </div>
                        {/* Close */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors text-lg leading-none cursor-pointer"
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    {/* Chat bubble */}
                    <div className="px-4 py-4" style={{ background: '#ECE5DD' }}>
                        <div
                            className="relative bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm max-w-[90%]"
                        >
                            {/* Tail */}
                            <div
                                className="absolute -left-2 top-0 w-0 h-0"
                                style={{
                                    borderTop: '0px solid transparent',
                                    borderBottom: '10px solid transparent',
                                    borderRight: '10px solid white',
                                }}
                            />
                            <p className="text-slate-800 text-sm leading-snug">
                                👋 Hi there! Looking for your perfect stay?
                            </p>
                            <p className="text-slate-600 text-sm mt-1">
                                Chat with us on WhatsApp — we'll find the best property for you! 🏡
                            </p>
                            <p className="text-right text-[10px] text-slate-400 mt-1">now</p>
                        </div>
                    </div>

                    {/* CTA button */}
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ background: '#25D366' }}
                    >
                        {/* WhatsApp SVG icon */}
                        <svg viewBox="0 0 32 32" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.46.65 4.87 1.88 6.99L2 30l7.19-1.87A13.93 13.93 0 0016.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.43c-2.3 0-4.56-.62-6.52-1.79l-.47-.28-4.27 1.11 1.13-4.15-.3-.48a11.43 11.43 0 01-1.73-6.1c0-6.3 5.13-11.43 11.43-11.43 6.3 0 11.43 5.13 11.43 11.43S22.3 27.43 16 27.43zm6.28-8.56c-.34-.17-2.03-1-2.34-1.12-.32-.11-.55-.17-.78.17-.23.34-.89 1.12-1.09 1.35-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.02-1.89-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.56.11-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.57-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.17-1.19 2.84 0 1.68 1.22 3.3 1.39 3.53.17.23 2.4 3.66 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.65-.1 2.03-.83 2.31-1.63.29-.8.29-1.48.2-1.63-.08-.15-.31-.23-.65-.4z" />
                        </svg>
                        Start Chat on WhatsApp
                    </a>
                </div>
            </div>

            {/* ── Floating WhatsApp button ── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Chat with us on WhatsApp"
                className={`fixed z-[999] hidden md:flex items-center gap-0 rounded-full shadow-xl cursor-pointer transition-all duration-300 active:scale-95 group overflow-hidden ${isPropertyDetailPage ? '' : 'hover:scale-105'}`}
                style={{
                    bottom: '24px',
                    right: '24px',
                    background: '#25D366',
                    width: '54px',
                    height: '54px',
                    padding: '0 14px',
                    boxShadow: '0 4px 24px rgba(37,211,102,0.5)',
                    animation: showBounce && !isOpen ? 'waBounce 1s ease' : 'none',
                    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                    if (!isPropertyDetailPage) (e.currentTarget as HTMLButtonElement).style.width = '172px';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.width = '54px';
                }}
            >
                {/* WhatsApp icon — always visible */}
                <svg viewBox="0 0 32 32" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.46.65 4.87 1.88 6.99L2 30l7.19-1.87A13.93 13.93 0 0016.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.43c-2.3 0-4.56-.62-6.52-1.79l-.47-.28-4.27 1.11 1.13-4.15-.3-.48a11.43 11.43 0 01-1.73-6.1c0-6.3 5.13-11.43 11.43-11.43 6.3 0 11.43 5.13 11.43 11.43S22.3 27.43 16 27.43zm6.28-8.56c-.34-.17-2.03-1-2.34-1.12-.32-.11-.55-.17-.78.17-.23.34-.89 1.12-1.09 1.35-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.02-1.89-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.56.11-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.57-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.17-1.19 2.84 0 1.68 1.22 3.3 1.39 3.53.17.23 2.4 3.66 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.65-.1 2.03-.83 2.31-1.63.29-.8.29-1.48.2-1.63-.08-.15-.31-.23-.65-.4z" />
                </svg>
                {!isPropertyDetailPage && (
                    <span
                        className="text-white font-semibold text-sm whitespace-nowrap overflow-hidden"
                        style={{
                            maxWidth: '0px',
                            opacity: 0,
                            marginLeft: '0px',
                            transition: 'max-width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, margin-left 0.3s ease',
                        }}
                        ref={(el) => {
                            if (!el) return;
                            const btn = el.closest('button');
                            if (!btn) return;
                            const show = () => {
                                el.style.maxWidth = '110px';
                                el.style.opacity = '1';
                                el.style.marginLeft = '8px';
                            };
                            const hide = () => {
                                el.style.maxWidth = '0px';
                                el.style.opacity = '0';
                                el.style.marginLeft = '0px';
                            };
                            btn.addEventListener('mouseenter', show);
                            btn.addEventListener('mouseleave', hide);
                        }}
                    >
                        Chat with us
                    </span>
                )}
            </button>


            {/* Bounce keyframe */}
            <style>{`
                @keyframes waBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    30%       { transform: translateY(-8px) scale(1.05); }
                    60%       { transform: translateY(-4px) scale(1.02); }
                }
            `}</style>
        </>
    );
}

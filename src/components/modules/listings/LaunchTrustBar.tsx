import { Ban, Headphones, Lock, ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
    {
        icon: ShieldCheck,
        iconClass: 'text-brand-red bg-red-50',
        title: 'Verified Properties',
        description: 'Every home is physically inspected by our team.',
    },
    {
        icon: Ban,
        iconClass: 'text-violet-600 bg-violet-50',
        title: 'Zero Brokerage',
        description: 'No hidden fees or middlemen during booking.',
    },
    {
        icon: Headphones,
        iconClass: 'text-emerald-600 bg-emerald-50',
        title: '24/7 Support',
        description: 'Dedicated help from search to move-in.',
    },
    {
        icon: Lock,
        iconClass: 'text-sky-600 bg-sky-50',
        title: 'Secure Payments',
        description: 'Safe, transparent rent & deposit flows.',
    },
] as const;

export function LaunchTrustBar() {
    return (
        <div className="mb-10 md:mb-12 rounded-2xl border border-slate-100 bg-white px-4 py-5 sm:px-6 sm:py-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.12)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {TRUST_ITEMS.map((item) => (
                    <div
                        key={item.title}
                        className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-3"
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                        >
                            <item.icon className="h-5 w-5" strokeWidth={2.2} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{item.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

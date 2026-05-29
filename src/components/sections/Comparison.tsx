import { comparisonData } from '@/data/content';
import { Check, X } from 'lucide-react';

export function Comparison() {
    const getValueIcon = (value: string) => {
        if (value === 'No' || value === 'None' || value === 'N/A') {
            return <X className="w-4 h-4 text-red-500" />;
        }
        if (value === 'Full' || value === 'Yes') {
            return <Check className="w-4 h-4 text-brand-red" />;
        }
        return null;
    };

    return (
        <section id="market" className="py-14 md:py-24 bg-slate-50 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red font-semibold tracking-wide uppercase text-sm rounded-full mb-4">Competitive Analysis</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal mt-2 mb-6 font-heading">
                        Why We Win – <span className="text-brand-red">Competitive Moat</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Compare us properly. We aren't just a tool, we are an outcome partner.
                    </p>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-6">
                    {comparisonData.map((row, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">{row.label}</h3>

                            {/* MakeMyStay - Highlighted Row */}
                            <div className="flex items-center justify-between mb-4 bg-red-50 p-4 rounded-xl border border-red-100">
                                <span className="font-bold text-brand-red text-sm">MakeMyStay</span>
                                <div className="text-lg font-bold text-brand-red flex items-center gap-2">
                                    {getValueIcon(row.m)} {row.m}
                                </div>
                            </div>

                            {/* Others - Vertical List for readability */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500 text-xs font-medium">Brokers</span>
                                    <span className="font-semibold text-slate-700 text-sm">{row.b}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500 text-xs font-medium">Portals</span>
                                    <span className="font-semibold text-slate-700 text-sm">{row.l}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500 text-xs font-medium">CRM</span>
                                    <span className="font-semibold text-slate-700 text-sm">{row.c}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto pb-4 relative">
                    <div className="min-w-[800px] w-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
                        {/* Dark Header Section */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-6">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="text-lg font-bold text-white pl-8">Feature</div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Brokers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Listing Portals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-medium text-slate-300">Generic CRM</div>
                                </div>
                                {/* Winner column header */}
                                <div className="text-center pr-8 relative">
                                    <div className="absolute inset-0 -top-6 bg-amber-400/8 rounded-t-xl" />
                                    <div className="px-5 py-2 rounded-full inline-block relative" style={{ background: 'linear-gradient(135deg,#C5A021,#A8761A)', boxShadow: '0 4px 16px rgba(197,160,33,0.4)' }}>
                                        <span className="text-white font-bold text-sm">MakeMyStay.ai</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* White Table Body */}
                        <div className="py-4">
                            {comparisonData.map((row, idx) => (
                                <div
                                    key={idx}
                                    className={`grid grid-cols-5 gap-4 py-5 items-center hover:bg-slate-50 transition-colors ${idx !== comparisonData.length - 1 ? 'border-b border-slate-100' : ''}`}
                                >
                                    <div className="font-semibold text-slate-900 pl-8">{row.label}</div>
                                    <div className="text-center">
                                        <span className="text-slate-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.b)}
                                            {row.b}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-slate-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.l)}
                                            {row.l}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-slate-500 text-sm flex items-center justify-center gap-2 font-medium">
                                            {getValueIcon(row.c)}
                                            {row.c}
                                        </span>
                                    </div>
                                    <div className="text-center pr-8 relative">
                                        {/* Persistent gold tint column */}
                                        <div className="absolute inset-y-0 -inset-x-1 rounded-lg -z-10" style={{ background: 'rgba(197,160,33,0.06)' }} />
                                        <span className="inline-flex items-center gap-2 font-bold py-2 px-4 rounded-full text-sm" style={{ color: '#B11226', background: 'rgba(177,18,38,0.08)', border: '1px solid rgba(177,18,38,0.15)' }}>
                                            {getValueIcon(row.m)}
                                            {row.m}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

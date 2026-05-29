import { problemCards } from '@/data/content';

export function Problem() {
    const getBgColor = (theme: string) => {
        if (theme === 'red') return 'bg-red-50 text-red-500';
        if (theme === 'orange') return 'bg-orange-50 text-orange-500';
        return 'bg-purple-50 text-purple-500';
    }

    return (
        <section id="problem" className="py-14 md:py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 mb-4">The Problem in India's Rental Market</h2>
                    <p className="text-base md:text-lg text-slate-600 mb-3">A ₹5,000+ Cr market growing 25% YoY, yet plagued by inefficiencies.</p>
                    <p className="text-base md:text-lg font-semibold text-slate-800 italic">
                        "Operators lose profits not because of demand — but because of inefficiency."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {problemCards.map((card, idx) => (
                        <div key={idx}
                            className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
                            style={{ borderTop: `4px solid ${card.theme === 'red' ? '#EF4444' : card.theme === 'orange' ? '#F97316' : '#A855F7'}` }}
                        >
                            <div className={`${getBgColor(card.theme || '')} w-12 h-12 rounded-full flex items-center justify-center mb-6`}>
                                {card.val ? <span className="font-bold text-xl">{card.val}</span> : card.icon && <card.icon className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                            <p className="text-slate-600 mb-4" dangerouslySetInnerHTML={{ __html: card.desc.replace(/(₹\d+-\d+K|\d+%)/g, '<span class="font-semibold text-slate-900">$1</span>') }}></p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

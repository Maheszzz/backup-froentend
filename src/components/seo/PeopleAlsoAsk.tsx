import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FaqItem {
    question: string;
    answer: string;
}

interface PeopleAlsoAskProps {
    items: FaqItem[];
}

export function PeopleAlsoAsk({ items }: PeopleAlsoAskProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="space-y-6" aria-labelledby="paa-heading">
            <h3 id="paa-heading" className="text-2xl font-bold text-slate-900 border-l-4 border-brand-red pl-4">
                People Also Ask
            </h3>
            
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="group border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all hover:border-slate-300 shadow-sm"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
                            aria-expanded={openIndex === idx}
                        >
                            <span className="font-semibold text-slate-800 pr-8">{item.question}</span>
                            <span className="shrink-0 text-slate-400 group-hover:text-slate-600">
                                {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </span>
                        </button>
                        
                        <div 
                            className={`transition-all duration-300 ease-in-out ${
                                openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

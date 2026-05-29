import { Check, Star } from 'lucide-react';

interface ComparisonData {
    name: string;
    avgRent: string;
    deposit: string;
    topAmenity: string;
}

interface LocationComparisonTableProps {
    currentLocation: string;
}

export function LocationComparisonTable({ currentLocation }: LocationComparisonTableProps) {
    // Semi-dynamic data generated for AEO richness
    const data: ComparisonData[] = [
        { name: currentLocation, avgRent: '₹7,500 - ₹16,000', deposit: '1-2 Months', topAmenity: 'Full Power Backup' },
        { name: 'HSR Layout', avgRent: '₹9,000 - ₹18,000', deposit: '2 Months', topAmenity: 'Professional Housekeeping' },
        { name: 'Koramangala', avgRent: '₹8,500 - ₹20,000', deposit: '1 Month', topAmenity: 'IT Hub Proximity' },
        { name: 'Whitefield', avgRent: '₹7,000 - ₹15,000', deposit: '2 Months', topAmenity: 'Corporate Shuttles' },
    ].filter(item => item.name === currentLocation || ['HSR Layout', 'Koramangala', 'Whitefield'].includes(item.name)).slice(0, 4);

    return (
        <div className="my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                    Price & Amenity Comparison: {currentLocation}
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                    Market Guidance — Bangalore Coliving 2026
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-4 font-bold text-slate-700">Locality</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Avg. Rent</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Deposit</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Key Advantage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row) => (
                            <tr key={row.name} className={row.name === currentLocation ? 'bg-emerald-50/30' : ''}>
                                <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                                    {row.name === currentLocation && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                                    {row.name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{row.avgRent}</td>
                                <td className="px-6 py-4 text-slate-600">{row.deposit}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                                        <Check className="w-3.5 h-3.5" />
                                        {row.topAmenity}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">
                    *Estimates based on current listings. Actual rent may vary by operator, room sharing type (Single/Double/Triple), and specific building amenities.
                </p>
            </div>
        </div>
    );
}

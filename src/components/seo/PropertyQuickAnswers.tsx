import type { Property } from '@/types/api';
import { propertyLikelyHasAc } from '@/lib/propertySeoUtils';
import { 
    Clock, 
    MapPin, 
    Home, 
    Wifi, 
    Utensils, 
    Wind, 
    CheckCircle2, 
    IndianRupee 
} from 'lucide-react';

interface PropertyQuickAnswersProps {
    property: Property;
}

export function PropertyQuickAnswers({ property }: PropertyQuickAnswersProps) {
    const food = property.food === true ? 'Included' : 'Varies';
    const wifi = property.wifi ? 'High-Speed' : 'Enquire';
    const ac = propertyLikelyHasAc(property) ? 'Available' : 'Check listing';
    const avail = property.is_available === false ? 'Limited' : 'Available Now';

    const items = [
        { label: 'Starting Price', value: property.price || 'On request', icon: IndianRupee, color: 'text-emerald-500' },
        { label: 'Location Area', value: property.location, icon: MapPin, color: 'text-blue-500' },
        { label: 'Property Type', value: property.type, icon: Home, color: 'text-purple-500' },
        { label: 'WiFi Status', value: wifi, icon: Wifi, color: 'text-indigo-500' },
        { label: 'Food Plan', value: food, icon: Utensils, color: 'text-orange-500' },
        { label: 'AC Feature', value: ac, icon: Wind, color: 'text-cyan-500' },
        { label: 'Availability', value: avail, icon: CheckCircle2, color: 'text-rose-500' },
        { label: 'Posted Date', value: 'Today', icon: Clock, color: 'text-slate-400' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <div 
                    key={idx} 
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{item.value}</p>
                </div>
            ))}
        </div>
    );
}

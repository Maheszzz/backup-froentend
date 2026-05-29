import type { ReactNode } from 'react';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import {
    HERO_CITY_TABS,
    patchFromPriceRangeValue,
    priceRangeSelectValue,
} from '@/lib/heroFilterUtils';
import { ArrowRight, Calendar, ChevronDown, MapPin, SlidersHorizontal } from 'lucide-react';

interface FeaturedPropertyFiltersBarProps {
    filters: HeroSearchFilters;
    onFiltersChange: (next: HeroSearchFilters) => void;
    onExplore: () => void;
}

function FilterSelect({
    label,
    value,
    onChange,
    children,
    leadingIcon,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
    leadingIcon?: ReactNode;
}) {
    return (
        <div className="relative hidden md:block">
            <label className="sr-only">{label}</label>
            {leadingIcon && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-slate-500">
                    {leadingIcon}
                </span>
            )}
            <select
                aria-label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`appearance-none rounded-full border border-slate-300 bg-white py-2 pr-9 text-sm font-medium text-slate-700 hover:border-slate-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/25 ${
                    leadingIcon ? 'pl-9' : 'pl-3.5'
                }`}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
    );
}

export function FeaturedPropertyFiltersBar({
    filters,
    onFiltersChange,
    onExplore,
}: FeaturedPropertyFiltersBarProps) {
    const patch = (next: Partial<HeroSearchFilters>) => onFiltersChange({ ...filters, ...next });

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 md:mb-8">
            {HERO_CITY_TABS.map((tab) => {
                const active = tab.key === filters.city;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => patch({ city: tab.key })}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold transition-all ${
                            active
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                    >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {tab.label}
                    </button>
                );
            })}

            <div className="hidden md:block h-7 w-px bg-slate-200 mx-1" />

            <FilterSelect
                label="Move-in date"
                value={filters.move_in || 'any'}
                onChange={(val) =>
                    patch({ move_in: val === 'any' ? '' : (val as HeroSearchFilters['move_in']) })
                }
                leadingIcon={<Calendar className="w-3.5 h-3.5" />}
            >
                <option value="any">Move-in Date</option>
                <option value="immediate">Immediate</option>
                <option value="7days">Within 7 days</option>
                <option value="30days">Within 30 days</option>
            </FilterSelect>

            <FilterSelect
                label="Room type"
                value={filters.property_type || 'any'}
                onChange={(val) =>
                    patch({
                        property_type: val === 'any' ? '' : (val as HeroSearchFilters['property_type']),
                    })
                }
            >
                <option value="any">Room Type</option>
                <option value="PG">PG</option>
                <option value="1RK">1RK</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
            </FilterSelect>

            <FilterSelect
                label="Price range"
                value={priceRangeSelectValue(filters)}
                onChange={(val) => patch(patchFromPriceRangeValue(val))}
            >
                <option value="any">Price Range</option>
                <option value="0-10000">Below ₹10k</option>
                <option value="10000-15000">₹10k – ₹15k</option>
                <option value="15000-25000">₹15k – ₹25k</option>
                <option value="25000-0">₹25k+</option>
            </FilterSelect>

            <FilterSelect
                label="Amenities"
                value={filters.amenity || 'any'}
                onChange={(val) =>
                    patch({ amenity: val === 'any' ? '' : (val as HeroSearchFilters['amenity']) })
                }
                leadingIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            >
                <option value="any">Amenities</option>
                <option value="wifi">WiFi</option>
                <option value="food">Food included</option>
                <option value="ac">AC rooms</option>
                <option value="parking">Parking</option>
            </FilterSelect>

            <button
                type="button"
                onClick={onExplore}
                className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
                Explore Properties
                <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex md:hidden w-full flex-col gap-2 mt-1">
                <div className="grid grid-cols-2 gap-2">
                    <select
                        aria-label="Move-in date"
                        value={filters.move_in || 'any'}
                        onChange={(e) =>
                            patch({
                                move_in:
                                    e.target.value === 'any'
                                        ? ''
                                        : (e.target.value as HeroSearchFilters['move_in']),
                            })
                        }
                        className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                    >
                        <option value="any">Move-in</option>
                        <option value="immediate">Immediate</option>
                        <option value="7days">7 days</option>
                        <option value="30days">30 days</option>
                    </select>
                    <select
                        aria-label="Room type"
                        value={filters.property_type || 'any'}
                        onChange={(e) =>
                            patch({
                                property_type:
                                    e.target.value === 'any'
                                        ? ''
                                        : (e.target.value as HeroSearchFilters['property_type']),
                            })
                        }
                        className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                    >
                        <option value="any">Room type</option>
                        <option value="PG">PG</option>
                        <option value="1RK">1RK</option>
                        <option value="1BHK">1BHK</option>
                        <option value="2BHK">2BHK</option>
                        <option value="3BHK">3BHK</option>
                    </select>
                    <select
                        aria-label="Price range"
                        value={priceRangeSelectValue(filters)}
                        onChange={(e) => patch(patchFromPriceRangeValue(e.target.value))}
                        className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                    >
                        <option value="any">Price</option>
                        <option value="0-10000">Below ₹10k</option>
                        <option value="10000-15000">₹10k – ₹15k</option>
                        <option value="15000-25000">₹15k – ₹25k</option>
                        <option value="25000-0">₹25k+</option>
                    </select>
                    <select
                        aria-label="Amenities"
                        value={filters.amenity || 'any'}
                        onChange={(e) =>
                            patch({
                                amenity:
                                    e.target.value === 'any'
                                        ? ''
                                        : (e.target.value as HeroSearchFilters['amenity']),
                            })
                        }
                        className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                    >
                        <option value="any">Amenities</option>
                        <option value="wifi">WiFi</option>
                        <option value="food">Food</option>
                        <option value="ac">AC</option>
                        <option value="parking">Parking</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

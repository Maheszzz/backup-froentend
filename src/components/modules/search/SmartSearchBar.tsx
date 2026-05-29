"use client";

import { propertyApi } from '@/lib/api';
import type { HomeHeroNavigateTab } from '@/lib/listingsCategoryHubs';
import { mergeSuggestionGroups, type SearchSuggestionGroups } from '@/lib/searchPlaces';
import { Building2, ChevronDown, MapPin, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SmartSearchBarProps {
    category?: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    setCategory?: (category: 'pg' | 'rent' | 'buy' | 'plot' | 'all') => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    /**
     * Homepage hero: navigate to category hubs (legacy). Omit when using `filterTabsInPlace`.
     */
    listingsNavigate?: (tab: HomeHeroNavigateTab, query: string) => void;
    /** Homepage: tabs filter results below without leaving `/`. */
    filterTabsInPlace?: boolean;
    activeHubTab?: HomeHeroNavigateTab;
    onHubTabChange?: (tab: HomeHeroNavigateTab) => void;
    onFilterSearch?: (tab: HomeHeroNavigateTab, query: string) => void;
    filters?: HeroSearchFilters;
    setFilters?: (next: HeroSearchFilters) => void;
}

export interface HeroSearchFilters {
    city: 'bangalore' | 'pune' | 'hyderabad';
    property_type: '' | 'PG' | '1RK' | '1BHK' | '2BHK' | '3BHK';
    min_price?: number;
    max_price?: number;
    amenity: '' | 'wifi' | 'food' | 'ac' | 'parking';
    gender: '' | 'male' | 'female' | 'unisex';
    /** Immediate → API `is_available=true`; other values are reserved for future backend support. */
    move_in?: '' | 'immediate' | '7days' | '30days';
}

function mergeCommittedQuery(searchQuery: string | undefined, pendingInput: string): string {
    const parts = (searchQuery || '').split(',').map((s) => s.trim()).filter(Boolean);
    const t = pendingInput.trim();
    if (t && !parts.includes(t)) parts.push(t);
    return parts.join(',');
}

const HUB_TAB_CONFIG: { id: HomeHeroNavigateTab; label: string }[] = [
    { id: 'pg', label: 'PG / Hostel' },
    { id: 'rent', label: 'Rent' },
    { id: 'buy', label: 'Buy' },
    { id: 'plot', label: 'Plot & Land' },
    { id: 'commercial', label: 'Commercial' },
];

const LEGACY_TAB_CONFIG = [
    { id: 'all' as const, label: 'ALL' },
    { id: 'pg' as const, label: 'PG' },
    { id: 'rent' as const, label: 'RENT' },
    { id: 'buy' as const, label: 'BUY' },
    { id: 'plot' as const, label: 'PLOT' },
];

export function SmartSearchBar({
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    listingsNavigate,
    filterTabsInPlace = false,
    activeHubTab: activeHubTabProp,
    onHubTabChange,
    onFilterSearch,
    filters,
    setFilters,
}: SmartSearchBarProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionGroups, setSuggestionGroups] = useState<SearchSuggestionGroups>({
        properties: [],
        places: [],
    });
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [internalHubTab, setInternalHubTab] = useState<HomeHeroNavigateTab>('pg');
    const [activeLegacyTab, setActiveLegacyTab] = useState<'pg' | 'rent' | 'buy' | 'plot' | 'all'>(category ?? 'all');

    const hubTabsUi = filterTabsInPlace || Boolean(listingsNavigate);
    const hubMode = Boolean(listingsNavigate) && !filterTabsInPlace;

    useEffect(() => {
        if (hubTabsUi) return;
        setActiveLegacyTab(category ?? 'all');
    }, [category, hubTabsUi]);

    useEffect(() => {
        if (activeHubTabProp) setInternalHubTab(activeHubTabProp);
    }, [activeHubTabProp]);

    const setHubTab = (tab: HomeHeroNavigateTab) => {
        if (activeHubTabProp === undefined) setInternalHubTab(tab);
        onHubTabChange?.(tab);
    };

    const effectiveHubTab = activeHubTabProp ?? internalHubTab;
    const effectiveLegacyTab = activeLegacyTab;

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue && inputValue.trim().length >= 1) {
                try {
                    setIsLoadingSuggestions(true);
                    const apiResults = await propertyApi.getSuggestions(inputValue);
                    const merged = mergeSuggestionGroups(apiResults, inputValue);
                    setSuggestionGroups(merged);
                    setShowSuggestions(merged.properties.length > 0 || merged.places.length > 0);
                } catch (error) {
                    console.error('Failed to fetch suggestions:', error);
                    setSuggestionGroups({ properties: [], places: [] });
                    setShowSuggestions(false);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestionGroups({ properties: [], places: [] });
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (suggestion: string) => {
        const parts = (searchQuery || '').split(',').filter(Boolean);
        if (!parts.includes(suggestion.trim())) {
            setSearchQuery?.([...parts, suggestion].join(','));
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const activeFilters: HeroSearchFilters = filters ?? {
        city: 'bangalore',
        property_type: '',
        min_price: undefined,
        max_price: undefined,
        amenity: '',
        gender: '',
    };
    const updateFilters = (patch: Partial<HeroSearchFilters>) => {
        setFilters?.({ ...activeFilters, ...patch });
    };

    const mergedForSubmit = mergeCommittedQuery(searchQuery, inputValue);

    const onSearchClick = () => {
        const merged = mergedForSubmit;
        if (filterTabsInPlace) {
            if (merged !== (searchQuery || '').trim()) {
                setSearchQuery?.(merged);
            }
            onFilterSearch?.(effectiveHubTab, merged);
            setInputValue('');
            setShowSuggestions(false);
            return;
        }
        if (hubMode && listingsNavigate) {
            listingsNavigate(effectiveHubTab, merged);
            if (merged !== (searchQuery || '').trim()) {
                setSearchQuery?.(merged);
            }
            setInputValue('');
            setShowSuggestions(false);
            return;
        }
        if (inputValue.trim()) {
            const parts = (searchQuery || '').split(',').filter(Boolean);
            if (!parts.includes(inputValue.trim())) {
                setSearchQuery?.([...parts, inputValue.trim()].join(','));
            }
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    return (
        <div
            className={
                hubTabsUi
                    ? 'bg-white rounded-2xl md:rounded-[2rem] shadow-sm p-3 md:p-7 w-full relative border border-slate-200'
                    : 'bg-white rounded-2xl md:rounded-[2rem] shadow-md p-3 md:p-7 w-full relative border border-slate-200'
            }
        >
            {hubTabsUi ? (
                <div className="mb-4 md:mb-5 overflow-x-auto hide-scrollbar flex gap-1.5 sm:gap-3 border-b border-slate-100 pb-px -mx-0.5 px-0.5">
                    {HUB_TAB_CONFIG.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setHubTab(tab.id)}
                            className={`shrink-0 pb-2.5 px-1.5 sm:px-2 text-[11px] sm:text-xs font-semibold tracking-wide transition-colors border-b-[3px] -mb-[2px] ${
                                effectiveHubTab === tab.id
                                    ? 'text-slate-900 border-brand-red'
                                    : 'text-slate-500 border-transparent hover:text-slate-800'
                            }`}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex w-full overflow-x-auto sm:overflow-visible max-w-[380px] sm:max-w-none sm:w-fit mx-auto gap-1 mb-2.5 md:mb-5 bg-slate-100 rounded-full p-1 border border-slate-200 hide-scrollbar flex-nowrap justify-start sm:justify-center items-stretch">
                    {LEGACY_TAB_CONFIG.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                const id = tab.id;
                                setActiveLegacyTab(id);
                                setCategory?.(id);
                            }}
                            className={`shrink-0 min-w-[60px] sm:min-w-0 sm:flex-none py-1.5 px-2 sm:px-4 md:px-6 rounded-full text-[9px] sm:text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 min-h-[36px] md:min-h-[42px] whitespace-nowrap flex items-center justify-center ${
                                effectiveLegacyTab === tab.id
                                    ? 'bg-brand-red text-white shadow-sm'
                                    : 'bg-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {hubTabsUi && (
                <div className="flex items-center gap-2 mb-4 md:mb-5">
                    <div className="flex flex-1 min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 min-h-[44px] md:min-h-[48px]">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" aria-hidden />
                        <select
                            aria-label="City (Bangalore)"
                            title="City"
                            value={activeFilters.city}
                            onChange={(e) => updateFilters({ city: e.target.value as HeroSearchFilters['city'] })}
                            className="flex-1 min-w-0 bg-transparent text-slate-900 text-sm font-medium outline-none appearance-none"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            <option value="bangalore">Bangalore</option>
                            <option value="pune">Pune</option>
                            <option value="hyderabad">Hyderabad</option>
                        </select>
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 pointer-events-none" aria-hidden />
                    </div>
                </div>
            )}

            {/* Search row + CTA */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch relative">
                <div className="relative flex flex-1 min-w-0 items-stretch bg-slate-50 border border-slate-200 rounded-2xl md:rounded-xl group focus-within:ring-2 focus-within:ring-brand-red/20 focus-within:border-brand-red/40 transition-all min-h-[46px] md:min-h-[52px] pl-10 md:pl-12 pr-3">
                    <MapPin className="absolute left-3 md:left-4 top-1/2 z-[1] -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-red transition-colors duration-300 pointer-events-none" />

                    <div className="flex flex-1 min-w-0 min-h-[46px] md:min-h-[52px] flex-wrap items-center content-center gap-1.5 py-2 md:py-2.5 pr-2">
                        {(searchQuery || '').split(',').filter(Boolean).map((loc, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-slate-200 text-slate-800 text-[11px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full shrink-0">
                                <span className="truncate max-w-[120px] md:max-w-xs font-medium">{loc}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLocations = (searchQuery || '').split(',').filter(Boolean).filter((_, i) => i !== idx);
                                        setSearchQuery?.(newLocations.join(','));
                                    }}
                                    className="hover:text-brand-red transition-colors text-slate-500"
                                >
                                    <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                            </div>
                        ))}

                        <input
                            type="text"
                            aria-label="Search properties"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => {
                                if (inputValue && inputValue.length > 0) setShowSuggestions(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !inputValue && searchQuery) {
                                    const newLocations = searchQuery.split(',').filter(Boolean).slice(0, -1);
                                    setSearchQuery?.(newLocations.join(','));
                                }
                                if (e.key === 'Enter') {
                                    const merged = mergeCommittedQuery(searchQuery, inputValue);
                                    if (filterTabsInPlace) {
                                        if (merged !== (searchQuery || '').trim()) {
                                            setSearchQuery?.(merged);
                                        }
                                        onFilterSearch?.(effectiveHubTab, merged);
                                        setInputValue('');
                                        setShowSuggestions(false);
                                    } else if (hubMode && listingsNavigate) {
                                        if (inputValue.trim()) {
                                            listingsNavigate(effectiveHubTab, merged);
                                            setSearchQuery?.(merged);
                                            setInputValue('');
                                        } else {
                                            listingsNavigate(effectiveHubTab, (searchQuery || '').trim());
                                        }
                                        setShowSuggestions(false);
                                    } else if (inputValue.trim()) {
                                        const parts = (searchQuery || '').split(',').filter(Boolean);
                                        if (!parts.includes(inputValue.trim())) {
                                            setSearchQuery?.([...parts, inputValue.trim()].join(','));
                                        }
                                        setInputValue('');
                                        setShowSuggestions(false);
                                    }
                                    e.preventDefault();
                                }
                            }}
                            placeholder={
                                (searchQuery || '').trim()
                                    ? ''
                                    : hubMode
                                      ? 'Search property, area or landmark...'
                                      : 'Search property or location...'
                            }
                            className="flex-1 min-w-[80px] min-h-0 self-center bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-[13px] md:text-sm leading-normal font-medium"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        />
                    </div>

                    {(searchQuery || inputValue) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery?.('');
                                setInputValue('');
                                setShowSuggestions(false);
                                setSuggestionGroups({ properties: [], places: [] });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:self-center text-slate-400 hover:text-slate-700 transition-colors p-1"
                            aria-label="Clear all"
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    aria-label="Search listings"
                    onClick={onSearchClick}
                    className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 px-6 py-2.5 min-h-[46px] md:min-h-[52px] rounded-xl md:rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-sm font-bold tracking-wide shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    <Search className="w-4 h-4 md:w-5 md:h-5 pointer-events-none opacity-95" aria-hidden />
                    Search
                </button>
            </div>

            {hubTabsUi && (
                <div className="mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2.5" role="group" aria-label="Additional filters">
                    <div className="relative w-full lg:w-auto">
                        <select
                            aria-label="Budget"
                            value={
                                activeFilters.min_price === undefined && activeFilters.max_price === undefined
                                    ? 'any'
                                    : `${activeFilters.min_price ?? 0}-${activeFilters.max_price ?? 0}`
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'any') updateFilters({ min_price: undefined, max_price: undefined });
                                else if (val === '0-10000') updateFilters({ min_price: undefined, max_price: 10000 });
                                else if (val === '10000-15000') updateFilters({ min_price: 10000, max_price: 15000 });
                                else if (val === '15000-25000') updateFilters({ min_price: 15000, max_price: 25000 });
                                else if (val === '25000-0') updateFilters({ min_price: 25000, max_price: undefined });
                            }}
                            className="w-full lg:w-auto appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 pr-9 py-2 text-[13px] sm:text-[13px] lg:text-[11px] font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30"
                        >
                            <option value="any">Budget</option>
                            <option value="0-10000">Below ₹10k</option>
                            <option value="10000-15000">₹10k - ₹15k</option>
                            <option value="15000-25000">₹15k - ₹25k</option>
                            <option value="25000-0">₹25k+</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="relative w-full lg:w-auto">
                        <select
                            aria-label="Room type"
                            value={activeFilters.property_type || 'any'}
                            onChange={(e) => updateFilters({ property_type: e.target.value === 'any' ? '' : (e.target.value as HeroSearchFilters['property_type']) })}
                            className="w-full lg:w-auto appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 pr-9 py-2 text-[13px] sm:text-[13px] lg:text-[11px] font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30"
                        >
                            <option value="any">Room type</option>
                            <option value="PG">PG</option>
                            <option value="1RK">1RK</option>
                            <option value="1BHK">1BHK</option>
                            <option value="2BHK">2BHK</option>
                            <option value="3BHK">3BHK</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="relative w-full lg:w-auto">
                        <select
                            aria-label="Amenities"
                            value={activeFilters.amenity || 'any'}
                            onChange={(e) => updateFilters({ amenity: e.target.value === 'any' ? '' : (e.target.value as HeroSearchFilters['amenity']) })}
                            className="w-full lg:w-auto appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 pr-9 py-2 text-[13px] sm:text-[13px] lg:text-[11px] font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30"
                        >
                            <option value="any">Amenities</option>
                            <option value="wifi">WiFi</option>
                            <option value="food">Food included</option>
                            <option value="ac">AC rooms</option>
                            <option value="parking">Parking</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="relative w-full lg:w-auto">
                        <select
                            aria-label="Gender preference"
                            value={activeFilters.gender || 'any'}
                            onChange={(e) => updateFilters({ gender: e.target.value === 'any' ? '' : (e.target.value as HeroSearchFilters['gender']) })}
                            className="w-full lg:w-auto appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 pr-9 py-2 text-[13px] sm:text-[13px] lg:text-[11px] font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30"
                        >
                            <option value="any">Gender preference</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div
                    ref={suggestionRef}
                    className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-h-60 overflow-y-auto"
                >
                    {isLoadingSuggestions ? (
                        <div className="px-6 py-4 text-center text-slate-500 flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-brand-red rounded-full animate-spin" />
                            <span className="text-sm font-medium">Searching...</span>
                        </div>
                    ) : (
                        <>
                            {suggestionGroups.properties.length > 0 && (
                                <div className="border-b border-slate-100">
                                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Properties
                                    </p>
                                    {suggestionGroups.properties.map((suggestion) => (
                                        <button
                                            key={`p-${suggestion}`}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors group"
                                        >
                                            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors shrink-0" />
                                            <span className="text-sm font-medium group-hover:text-slate-900 transition-colors truncate">
                                                {suggestion}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {suggestionGroups.places.length > 0 && (
                                <div>
                                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Areas &amp; landmarks
                                    </p>
                                    {suggestionGroups.places.map((suggestion) => (
                                        <button
                                            key={`l-${suggestion}`}
                                            type="button"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors group border-t border-slate-50 first:border-t-0"
                                        >
                                            <MapPin className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors shrink-0" />
                                            <span className="text-sm font-medium group-hover:text-slate-900 transition-colors truncate">
                                                {suggestion}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {suggestionGroups.properties.length === 0 &&
                                suggestionGroups.places.length === 0 && (
                                    <div className="px-6 py-4 text-center text-slate-500 text-sm font-medium">
                                        No results found
                                    </div>
                                )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

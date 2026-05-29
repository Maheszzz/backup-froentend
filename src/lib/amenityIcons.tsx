import {
    Wifi, Utensils, Sparkles, Zap, ShieldCheck, WashingMachine,
    Refrigerator, Droplets, Lock, ParkingSquare, Flame, Archive,
    Wind, Tv, Dumbbell, Trees, Cctv, Thermometer, Users, Bath,
    Coffee, Waves, Check, Bed, ArrowUpDown, Armchair, Fingerprint,
    Bike, Shirt, Building2, Star, BedDouble, AirVent,
    Maximize2, Droplet, MapPin, VolumeX, Layers, Home, ChefHat, Mountain,
    BookOpen, Globe, ShowerHead, BrickWall, Heart, Newspaper,
    Palette, CookingPot, Wrench, ArrowUpCircle,
    Laptop, EyeOff, Layout, Shield, Coins, Gamepad2
} from 'lucide-react';

/**
 * Maps a lower-cased amenity string → a React icon element (size w-4 h-4).
 * Falls back to a generic Check icon if the key is not found.
 * Add new entries here — they will automatically appear on ALL cards & detail pages.
 */
export const amenityIconMap: Record<string, React.ReactNode> = {
    // ── WiFi ─────────────────────────────────────────────
    'wifi': <Wifi className="w-4 h-4" />,
    'high-speed wifi': <Wifi className="w-4 h-4" />,
    'wi-fi': <Wifi className="w-4 h-4" />,
    '100 mbps wi-fi in each room': <Wifi className="w-4 h-4" />,
    '100 mbps wifi router per room': <Wifi className="w-4 h-4" />,
    'high-speed internet': <Wifi className="w-4 h-4" />,
    'internet': <Wifi className="w-4 h-4" />,
    'broadband': <Wifi className="w-4 h-4" />,

    // ── Food & Dining ────────────────────────────────────
    'food': <Utensils className="w-4 h-4" />,
    'nutritious food': <Utensils className="w-4 h-4" />,
    'food included': <Utensils className="w-4 h-4" />,
    'meals included': <Utensils className="w-4 h-4" />,
    '3x hygienic meals': <ChefHat className="w-4 h-4" />,
    '3x hygienic meals (north & south)': <ChefHat className="w-4 h-4" />,
    'in-house cafeteria': <Coffee className="w-4 h-4" />,

    // ── Housekeeping & Maintenance ────────────────────────
    'housekeeping': <Sparkles className="w-4 h-4" />,
    'daily housekeeping': <Sparkles className="w-4 h-4" />,
    'professional housekeeping': <Sparkles className="w-4 h-4" />,
    'service': <Sparkles className="w-4 h-4" />,
    'room maintenance': <Wrench className="w-4 h-4" />,
    'daily room maintenance': <Wrench className="w-4 h-4" />,

    // ── Laundry ──────────────────────────────────────────
    'laundry service': <Shirt className="w-4 h-4" />,
    'laundry': <Shirt className="w-4 h-4" />,
    'washing machine': <WashingMachine className="w-4 h-4" />,
    'washing machines & laundry': <WashingMachine className="w-4 h-4" />,

    // ── Power & Utilities ─────────────────────────────────
    'power backup': <Zap className="w-4 h-4" />,
    'backup': <Zap className="w-4 h-4" />,
    'hot water': <Flame className="w-4 h-4" />,
    'geyser': <Thermometer className="w-4 h-4" />,
    'hot water geyser': <Thermometer className="w-4 h-4" />,
    'hot & cold aqua water': <Droplet className="w-4 h-4" />,
    'hot & cold aqua water - per floor': <Droplet className="w-4 h-4" />,
    '24/7 water supply': <Droplet className="w-4 h-4" />,
    '24x7 water supply': <Droplet className="w-4 h-4" />,
    'water supply': <Droplet className="w-4 h-4" />,

    // ── Security & Safety ─────────────────────────────────
    'security': <ShieldCheck className="w-4 h-4" />,
    '24/7 security': <ShieldCheck className="w-4 h-4" />,
    '24/7 security & power backup': <Shield className="w-4 h-4" />,
    'fingerprint access': <Fingerprint className="w-4 h-4" />,
    'fingerprint': <Fingerprint className="w-4 h-4" />,
    'biometric access': <Fingerprint className="w-4 h-4" />,
    'cctv': <Cctv className="w-4 h-4" />,
    'cctv security': <Cctv className="w-4 h-4" />,
    'complete privacy': <EyeOff className="w-4 h-4" />,

    // ── Appliances ────────────────────────────────────────
    'refrigerator': <Refrigerator className="w-4 h-4" />,
    'fridge': <Refrigerator className="w-4 h-4" />,
    'ro water purifier': <Droplets className="w-4 h-4" />,
    'ro water': <Droplets className="w-4 h-4" />,
    'water purifier': <Droplets className="w-4 h-4" />,
    'tv': <Tv className="w-4 h-4" />,
    'smart tv': <Tv className="w-4 h-4" />,
    'television': <Tv className="w-4 h-4" />,
    'ac': <AirVent className="w-4 h-4" />,
    'air conditioning': <AirVent className="w-4 h-4" />,
    'air conditioner': <AirVent className="w-4 h-4" />,

    // ── Parking ───────────────────────────────────────────
    'parking': <ParkingSquare className="w-4 h-4" />,
    'bike parking': <Bike className="w-4 h-4" />,
    'car parking': <ParkingSquare className="w-4 h-4" />,
    'indoor & outdoor parking': <ParkingSquare className="w-4 h-4" />,

    // ── Storage & Furniture ──────────────────────────────
    'cupboards': <Archive className="w-4 h-4" />,
    'locker': <Lock className="w-4 h-4" />,
    'furniture': <Armchair className="w-4 h-4" />,
    'premium furniture': <Armchair className="w-4 h-4" />,
    'ergonomic furniture': <Armchair className="w-4 h-4" />,
    'furnished': <Armchair className="w-4 h-4" />,
    'fully furnished': <Armchair className="w-4 h-4" />,
    'furnished rooms': <Layout className="w-4 h-4" />,
    'semi furnished': <Armchair className="w-4 h-4" />,
    'unfurnished': <Home className="w-4 h-4" />,

    // ── Gym & Fitness ────────────────────────────────────
    'gym': <Dumbbell className="w-4 h-4" />,
    'gym & play area on terrace': <Dumbbell className="w-4 h-4" />,
    'indoor games & gym': <Gamepad2 className="w-4 h-4" />,
    'pool': <Waves className="w-4 h-4" />,
    'swimming pool': <Waves className="w-4 h-4" />,

    // ── Common Areas & Features ──────────────────────────
    'garden': <Trees className="w-4 h-4" />,
    'lounge': <Coffee className="w-4 h-4" />,
    'community lounge': <Users className="w-4 h-4" />,
    'society': <Building2 className="w-4 h-4" />,
    'gated society': <Building2 className="w-4 h-4" />,
    'balcony': <Wind className="w-4 h-4" />,
    'lift': <ArrowUpDown className="w-4 h-4" />,
    'elevator': <ArrowUpDown className="w-4 h-4" />,
    'lift access (4-5 people)': <ArrowUpCircle className="w-4 h-4" />,
    'common kitchen': <ChefHat className="w-4 h-4" />,
    'shared kitchen': <ChefHat className="w-4 h-4" />,
    'self kitchen': <CookingPot className="w-4 h-4" />,
    'self kitchen (fridge, oven, stove)': <CookingPot className="w-4 h-4" />,
    'terrace': <Mountain className="w-4 h-4" />,
    'terrace access': <Mountain className="w-4 h-4" />,
    'rooftop': <Layers className="w-4 h-4" />,

    // ── Rooms & Bathrooms ────────────────────────────────
    'rooms': <Home className="w-4 h-4" />,
    'spacious rooms': <Maximize2 className="w-4 h-4" />,
    'spacious room': <Maximize2 className="w-4 h-4" />,
    'designer rooms + study table': <Palette className="w-4 h-4" />,
    'beds': <Bed className="w-4 h-4" />,
    'double bed': <BedDouble className="w-4 h-4" />,
    'att. bath': <Bath className="w-4 h-4" />,
    'attached bathroom': <Bath className="w-4 h-4" />,
    'attached washroom': <ShowerHead className="w-4 h-4" />,
    'washroom': <ShowerHead className="w-4 h-4" />,

    // ── Study & Work ──────────────────────────────────────
    'study table': <BookOpen className="w-4 h-4" />,
    'study room': <BookOpen className="w-4 h-4" />,
    'study area': <BookOpen className="w-4 h-4" />,
    'work desk': <BookOpen className="w-4 h-4" />,
    'computer table': <Laptop className="w-4 h-4" />,

    // ── Misc & Perks ──────────────────────────────────────
    'couple friendly': <Heart className="w-4 h-4" />,
    'premium': <Star className="w-4 h-4" />,
    'free newspaper': <Newspaper className="w-4 h-4" />,
    'complimentary newspaper': <Newspaper className="w-4 h-4" />,
    'no hidden charges': <Coins className="w-4 h-4" />,
    'online support': <Globe className="w-4 h-4" />,
    '24/7 support': <Globe className="w-4 h-4" />,
    'near parks': <Trees className="w-4 h-4" />,
    'near metro': <MapPin className="w-4 h-4" />,
    'near market': <MapPin className="w-4 h-4" />,
    'near school': <MapPin className="w-4 h-4" />,
    'quiet neighborhood': <VolumeX className="w-4 h-4" />,
    'quiet neighbourhood': <VolumeX className="w-4 h-4" />,
    'peaceful environment': <VolumeX className="w-4 h-4" />,
    'boundary wall': <BrickWall className="w-4 h-4" />,
    'compound wall': <BrickWall className="w-4 h-4" />,
};

/** Returns the icon for a given amenity label, or a default Check icon. */
export function getAmenityIcon(label: string): React.ReactNode {
    const icon = amenityIconMap[label.toLowerCase()];
    return icon ?? <Check className="w-4 h-4" />;
}

// API Entity Types matching backend schema

export interface Contact {
    id?: number;
    name: string; // Used for frontend state
    name_?: string; // Backend uses name_
    email: string;
    phone: string;
    message?: string;
    location?: string;
    property_type?: string;
    status?: 'new' | 'contacted' | 'closed';
    created_at?: string;
    updated_at?: string;
}

export interface DemoBooking {
    id: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    units?: string;
    selected_slot: string;
    status: string;
    meeting_link?: string;
    created_at: string;
}

// Raw ID from backend might be number or string depending on implementation
export type PropertyId = string | number;

export interface RealtyProperty {
    id?: number;
    slug?: string;
    property_name: string;
    location: string;
    phone?: string;
    map_link?: string;
    property_type: 'PG' | '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Villa' | 'Plot'; // Extended list
    furnishing: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
    private_price?: number;
    single_price?: number;
    double_price?: number;
    triple_price?: number;
    starting_price?: number;
    listing_type: 'buy' | 'rent' | 'sale' | string;
    is_available: boolean;
    description?: string; // Optional in DB response??
    /** Long-form PDP copy (~500 words), server-generated when present */
    seo_about?: string | null;
    features?: string[];
    images?: PropertyImage[];
    parking?: boolean;
    lift?: boolean;
    area_sqft?: number;
    reviews?: Review[];
    average_rating?: number;
    review_count?: number;
    /** When admin API adds optional marketing / inventory fields, map them through. */
    listing_badge?: string;
    units_remaining?: number | null;
    /** UI tab from API (pg | rent | buy | plot); matches backend PropertyListItem.derive_category. */
    category?: 'pg' | 'rent' | 'buy' | 'plot' | string;
    city?: string;
    is_deleted?: boolean | 0 | 1;
    last_verified_at?: string;
    last_booked_at?: string;
    last_review_at?: string;
    created_at?: string;
    updated_at?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
    id: number;
    property_id: number;
    rating: number;
    user_name: string;
    comment?: string;
    review_text?: string;
    cleanliness_rating?: number;
    wifi_rating?: number;
    food_rating?: number;
    safety_rating?: number;
    owner_response?: string;
    review_images?: string[];
    verified_stay?: boolean;
    status?: ReviewStatus;
    created_at: string;
    updated_at?: string;
}

export interface PropertyImage {
    id: number;
    property_id: number;
    image_url: string;
    content_type?: string;
    mime_validated?: boolean;
    file_size?: number | null;
    is_primary: boolean;
    sort_order: number;
    created_at: string;
}

export interface Property {
    id: PropertyId;
    slug?: string;
    title: string;
    location: string;
    city?: string;
    price: string;
    type: string;
    beds: number;
    baths: number;
    sqft: string;
    parking?: boolean;
    lift?: boolean;
    area?: number;
    wifi?: boolean;
    ac?: boolean;
    housekeeping?: boolean;
    power_backup?: boolean;
    gym?: boolean;
    lounge?: boolean;
    cctv?: boolean;
    washing_machine?: boolean;
    geyser?: boolean;
    image: string;
    modern_kitchen?: boolean;
    balcony?: boolean;
    attached_bathroom?: boolean;
    pool?: boolean;
    smart_home?: boolean;
    images?: string[];
    tag?: string;
    category: 'pg' | 'rent' | 'buy' | 'plot';
    description: string;
    /** From GET /properties/:id — long SEO narrative when API provides it */
    seo_about?: string;
    features?: string[];
    rating?: number;
    reviews?: number;
    average_rating?: number;
    review_count?: number;
    reviews_list?: Review[];
    last_verified_at?: string;
    last_booked_at?: string;
    last_review_at?: string;
    created_at?: string;
    updated_at?: string;
    postedDate?: string;

    sharing?: string[];
    food?: boolean;

    // Original Realty fields preserved for reference
    map_link?: string;
    furnishing?: string;
    contact_phone?: string;
    is_available?: boolean;
    /** Optional listing badge from admin/backend when supported (e.g. "New", "Verified"). */
    listing_badge?: string;
    /** Optional remaining units when backend provides it. */
    units_remaining?: number | null;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiListResponse<T> {
    data: T[];
    total?: number;
    page?: number;
    page_size?: number;
}

export interface ApiError {
    message: string;
    status: number;
    detail?: string;
}

// Request Types
export interface PaginationParams {
    page?: number;
    page_size?: number;
    skip?: number;
    limit?: number;
    location?: string;
    property_type?: string;
    listing_type?: string;
    /** Server-side tab filter (aligned with GET /realty/properties?category=) */
    category?: 'pg' | 'rent' | 'buy' | 'plot';
    search?: string;
    exclude_property_type?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    sort_by?: string;
    is_available?: boolean;
}

export interface ContactCreateRequest {
    name: string;
    email: string;
    phone: string;
    message?: string;
    location?: string;
    property_type?: string;
}

export interface ContactUpdateRequest {
    name?: string;
    email?: string;
    phone?: string;
    status?: 'new' | 'contacted' | 'closed';
}

// ... existing PropertyCreate/Update requests can remain or be updated if we build admin UI
export interface PropertyCreateRequest {
    title: string;
    location: string;
    // ... simpler to keep as is for now until we build admin
    [key: string]: any;
}

export interface PropertyUpdateRequest {
    [key: string]: any;
}



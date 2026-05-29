import { api } from './client';
import type {
    Contact,
    ContactCreateRequest,
    ContactUpdateRequest,
    PaginationParams
} from '@/types/api';

export interface ScheduleDemoRequest {
    name: string;
    email: string;
    phone: string;
    company?: string;
    units?: string;
    selected_slot: string; // ISO string
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

export interface ScheduleDemoResponse {
    message: string;
    meet_link: string;
    scheduled_at: string;
}

const BASE_PATH = '/contacts';
const REALTY_CONTACT_PATH = '/realty/contacts';

// Interface for contact form submission (realty endpoint)
export interface ContactFormSubmission {
    name: string;
    phone: string;
    email: string;
    message: string;
    source?: string;
    location?: string;
    property_type?: string;
}

/**
 * Contact API Service
 * Provides methods for CRUD operations on contacts
 */
export const contactApi = {
    /**
     * Get all contacts
     * @param params - Optional pagination parameters
     * @returns Array of contacts
     */
    getAll: async (params?: PaginationParams): Promise<Contact[]> => {
        const response = await api.get<Contact[]>(BASE_PATH, { params });
        return response;
    },

    /**
     * Get a single contact by ID
     * @param id - Contact ID
     * @returns Contact object
     */
    getById: async (id: number | string): Promise<Contact> => {
        const response = await api.get<Contact>(`${BASE_PATH}/${id}`);
        return response;
    },

    /**
     * Create a new contact
     * @param data - Contact data
     * @returns Created contact
     */
    create: async (data: ContactCreateRequest): Promise<Contact> => {
        const response = await api.post<Contact>(BASE_PATH, data);
        return response;
    },

    /**
     * Update an existing contact
     * @param id - Contact ID
     * @param data - Updated contact data
     * @returns Updated contact
     */
    update: async (id: number | string, data: ContactUpdateRequest): Promise<Contact> => {
        const response = await api.put<Contact>(`${BASE_PATH}/${id}`, data);
        return response;
    },

    /**
     * Delete a contact
     * @param id - Contact ID
     * @returns Deletion confirmation
     */
    delete: async (id: number | string): Promise<void> => {
        await api.delete(`${BASE_PATH}/${id}`);
    },

    /**
     * Submit contact form (realty endpoint)
     * @param data - Contact form data with name, phone, email, message
     * @returns Success response
     */
    submitContactForm: async (data: ContactFormSubmission): Promise<any> => {
        const response = await api.post<any>(REALTY_CONTACT_PATH, data);
        return response;
    },

    /**
     * Schedule a demo
     * @param data - Schedule demo request data
     * @returns Success message and booking details
     */
    scheduleDemo: async (data: ScheduleDemoRequest): Promise<ScheduleDemoResponse> => {
        const response = await api.post<ScheduleDemoResponse>('/schedule-demo', data);
        return response;
    },

    /**
     * Get all scheduled demos (Admin only)
     */
    getDemos: async (): Promise<DemoBooking[]> => {
        const response = await api.get<DemoBooking[]>('/schedule-demo');
        return response;
    },
};

export default contactApi;

import { useState, useEffect } from 'react';
import { contactApi } from '@/lib/api';
import type { Contact, ContactCreateRequest, ContactUpdateRequest, ApiError } from '@/types/api';

interface UseContactsResult {
    contacts: Contact[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
    createContact: (data: ContactCreateRequest) => Promise<Contact | null>;
    updateContact: (id: number | string, data: ContactUpdateRequest) => Promise<Contact | null>;
    deleteContact: (id: number | string) => Promise<boolean>;
}

/**
 * Custom hook to manage contacts with CRUD operations
 * @returns Contacts data, loading state, error state, and CRUD functions
 */
export function useContacts(): UseContactsResult {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await contactApi.getAll();
            setContacts(data);
        } catch (err) {
            setError(err as ApiError);
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    const createContact = async (data: ContactCreateRequest): Promise<Contact | null> => {
        try {
            setError(null);
            const newContact = await contactApi.create(data);
            setContacts(prev => [...prev, newContact]);
            return newContact;
        } catch (err) {
            setError(err as ApiError);
            console.error('Error creating contact:', err);
            return null;
        }
    };

    const updateContact = async (
        id: number | string,
        data: ContactUpdateRequest
    ): Promise<Contact | null> => {
        try {
            setError(null);
            const updatedContact = await contactApi.update(id, data);
            setContacts(prev =>
                prev.map(contact => contact.id === id ? updatedContact : contact)
            );
            return updatedContact;
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error updating contact ${id}:`, err);
            return null;
        }
    };

    const deleteContact = async (id: number | string): Promise<boolean> => {
        try {
            setError(null);
            await contactApi.delete(id);
            setContacts(prev => prev.filter(contact => contact.id !== id));
            return true;
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error deleting contact ${id}:`, err);
            return false;
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return {
        contacts,
        loading,
        error,
        refetch: fetchContacts,
        createContact,
        updateContact,
        deleteContact,
    };
}

interface UseContactResult {
    contact: Contact | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single contact by ID
 * @param id - Contact ID
 * @returns Contact data, loading state, error state, and refetch function
 */
export function useContact(id: number | string): UseContactResult {
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchContact = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const data = await contactApi.getById(id);
            setContact(data);
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error fetching contact ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
    }, [id]);

    return {
        contact,
        loading,
        error,
        refetch: fetchContact,
    };
}

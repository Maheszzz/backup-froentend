import { getWhatsAppPhone } from '@/lib/env';

/** WhatsApp Business number for pre-filled chat links (digits only, country code included). */
export function getWhatsappDigits(): string {
    const env = getWhatsAppPhone();
    const raw = env?.replace(/\D/g, '');
    if (raw && raw.length >= 10) return raw;
    return '918150099911';
}

export function buildPropertyWhatsappUrl(propertyTitle: string, location: string): string {
    const phone = getWhatsappDigits();
    const text = `Hi! I'm interested in ${propertyTitle} at ${location}. Please share more details.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

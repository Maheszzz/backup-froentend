/**
 * Image Optimization Utility
 * 
 * Handles dynamic resizing and formatting for Unsplash images to improve Core Web Vitals (LCP).
 */

export type ImageSize = 'thumbnail' | 'medium' | 'large' | 'hero' | 'hero_mobile';

const SIZE_MAP: Record<ImageSize, { w: number; q: number }> = {
    thumbnail: { w: 400, q: 75 },
    medium: { w: 800, q: 80 },
    large: { w: 1200, q: 85 },
    hero: { w: 1920, q: 80 },
    hero_mobile: { w: 640, q: 75 },
};

/**
 * Transforms an Unsplash URL with optimal size and format parameters.
 */
export function getOptimizedImageUrl(url: string | undefined, size: ImageSize = 'medium'): string {
    if (!url) return '';
    
    // Only apply optimization to Unsplash URLs
    if (!url.includes('images.unsplash.com')) return url;

    // Remove existing query params to avoid conflicts
    const baseUrl = url.split('?')[0];
    const { w, q } = SIZE_MAP[size];

    return `${baseUrl}?auto=format,compress&fit=crop&q=${q}&w=${w}`;
}

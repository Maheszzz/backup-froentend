'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getOptimizedImageUrl, type ImageSize } from '@/lib/utils/images';

export type OptimizedImageProps = {
    src: string;
    alt: string;
    /** Use with a `position: relative` + explicit height parent */
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    className?: string;
    /** Unsplash resize preset */
    size?: ImageSize;
    ariaHidden?: boolean;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: () => void;
    style?: React.CSSProperties;
};

function isOptimizableSrc(src: string): boolean {
    if (!src || src.startsWith('data:')) return false;
    if (src.startsWith('/')) return true;
    try {
        const host = new URL(src).hostname;
        return (
            host === 'images.unsplash.com' ||
            host.endsWith('.amazonaws.com') ||
            host.endsWith('makemystay.ai')
        );
    } catch {
        return false;
    }
}

/**
 * next/image wrapper: WebP/AVIF, lazy load, responsive sizes.
 * Falls back to unoptimized for CDN URLs outside remotePatterns.
 */
export function OptimizedImage({
    src,
    alt,
    fill,
    width,
    height,
    priority = false,
    quality,
    sizes,
    className,
    size = 'medium',
    ariaHidden = false,
    onLoad,
    onError,
    style,
}: OptimizedImageProps) {
    const [failed, setFailed] = useState(false);
    const resolved = getOptimizedImageUrl(src, size) || src;

    if (!resolved || failed) {
        return null;
    }

    const unoptimized = !isOptimizableSrc(resolved);

    return (
        <Image
            src={resolved}
            alt={ariaHidden ? '' : alt}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            priority={priority}
            quality={quality ?? (priority ? 60 : 75)}
            sizes={sizes ?? (fill ? '(max-width: 768px) 100vw, 33vw' : undefined)}
            className={className}
            style={style}
            unoptimized={unoptimized}
            onLoad={onLoad}
            onError={() => {
                setFailed(true);
                onError?.();
            }}
            aria-hidden={ariaHidden || undefined}
        />
    );
}

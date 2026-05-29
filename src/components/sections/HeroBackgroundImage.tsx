'use client';

import Image from 'next/image';
import { useState } from 'react';

const HERO = {
    mobile: { avif: '/images/blog/hero-sunset-mobile.avif', webp: '/images/blog/hero-sunset-mobile.webp' },
    desktop: { avif: '/images/blog/hero-sunset.avif', webp: '/images/blog/hero-sunset.webp' },
} as const;

interface HeroBackgroundImageProps {
    onError?: () => void;
}

function HeroLayer({
    avif,
    webp,
    className,
    onHardFail,
}: {
    avif: string;
    webp: string;
    className: string;
    onHardFail: () => void;
}) {
    const [src, setSrc] = useState(avif);

    return (
        <Image
            src={src}
            alt=""
            fill
            priority
            quality={55}
            sizes="100vw"
            className={className}
            aria-hidden
            onError={() => {
                if (src.endsWith('.avif')) {
                    setSrc(webp);
                    return;
                }
                onHardFail();
            }}
        />
    );
}

/**
 * LCP hero — pre-compressed AVIF/WebP (<150 KB). Falls back to WebP if AVIF is missing on the server.
 */
export function HeroBackgroundImage({ onError }: HeroBackgroundImageProps) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        onError?.();
        return null;
    }

    const hardFail = () => {
        setFailed(true);
        onError?.();
    };

    return (
        <>
            <HeroLayer
                avif={HERO.mobile.avif}
                webp={HERO.mobile.webp}
                className="object-cover object-center lg:hidden"
                onHardFail={hardFail}
            />
            <HeroLayer
                avif={HERO.desktop.avif}
                webp={HERO.desktop.webp}
                className="hidden object-cover object-center lg:block"
                onHardFail={hardFail}
            />
        </>
    );
}

import { useState } from 'react';

export function SkipLink() {
    const [focused, setFocused] = useState(false);

    return (
        <a
            href="#main-content"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`fixed top-4 left-4 z-50 bg-brand-charcoal text-white px-6 py-3 rounded-lg font-bold shadow-xl transition-transform duration-200 ${focused ? 'translate-y-0' : '-translate-y-[150%]'
                }`}
        >
            Skip to content
        </a>
    );
}

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildXml(userCode: string): string {
    return `<?xml version="1.0"?>\n<users>\n\t<user>${userCode}</user>\n</users>\n`;
}

function loadBingAuthXml(): string | null {
    const publicPath = join(process.cwd(), 'public', 'BingSiteAuth.xml');
    if (existsSync(publicPath)) {
        const raw = readFileSync(publicPath, 'utf8').trim();
        if (raw.includes('<user>')) return raw.endsWith('\n') ? raw : `${raw}\n`;
    }

    const user = process.env.BING_SITE_AUTH_USER?.trim();
    if (user) return buildXml(user);

    return null;
}

/** Bing Webmaster Tools ownership verification (must not hit the SEO catch-all). */
export function GET() {
    const body = loadBingAuthXml();
    if (!body) {
        return new NextResponse(
            'BingSiteAuth.xml is not configured. Download the file from Bing Webmaster Tools and save it as public/BingSiteAuth.xml, or set BING_SITE_AUTH_USER.',
            { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
        );
    }

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}

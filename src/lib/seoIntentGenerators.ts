import type { PageSEOInput } from '@/lib/seo';
import { SITE_NAME } from '@/lib/siteConfig';

/** Reusable SEO title/description builders for programmatic expansion (landmarks, budgets, personas). */

export function buildBudgetSeo(areaName: string, maxInr: number): PageSEOInput {
    return {
        title: `Budget PG under ₹${maxInr.toLocaleString('en-IN')} in ${areaName}`,
        description: `Affordable verified PG in ${areaName}, Bangalore under ₹${maxInr.toLocaleString('en-IN')}/mo — compare WiFi, meals, and deposits on ${SITE_NAME}.`,
        path: `/pg-in-${areaName.toLowerCase().replace(/\s+/g, '-')}-under-${maxInr}`,
    };
}

export function buildStudentSeo(areaName: string): PageSEOInput {
    return {
        title: `Student PG in ${areaName} | Near colleges & metro`,
        description: `Student-friendly PG in ${areaName}, Bangalore — verified listings, meal plans, and transparent rent on ${SITE_NAME}.`,
        path: `/pg/${areaName.toLowerCase().replace(/\s+/g, '-')}`,
    };
}

export function buildNearbyLandmarkSeo(landmarkLabel: string, hubAreaName: string, path: string): PageSEOInput {
    return {
        title: `PG near ${landmarkLabel} | Stay in ${hubAreaName}`,
        description: `Find PG and coliving near ${landmarkLabel} (${hubAreaName}, Bangalore). Verified photos and zero brokerage on many listings — ${SITE_NAME}.`,
        path,
    };
}

export function buildSingleRoomSeo(areaName: string): PageSEOInput {
    return {
        title: `Single room PG in ${areaName} | Private occupancy`,
        description: `Private single occupancy PG in ${areaName}, Bangalore — compare verified listings, WiFi, and meals on ${SITE_NAME}.`,
        path: '/pg-single-room',
    };
}

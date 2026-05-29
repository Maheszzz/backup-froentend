import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const FRONTEND_ROOT = '/Users/maheswaranm/make-my-stay';
const ENV_LOCAL_PATH = path.join(FRONTEND_ROOT, '.env.local');

function parseDotEnvLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return null;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return null;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    return [key, value];
}

async function readEnvLocal() {
    try {
        const raw = await readFile(ENV_LOCAL_PATH, 'utf8');
        const entries = raw
            .split('\n')
            .map(parseDotEnvLine)
            .filter(Boolean);
        return Object.fromEntries(entries);
    } catch {
        return {};
    }
}

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });
    const text = await response.text();
    let json = null;
    try {
        json = JSON.parse(text);
    } catch {
        // Keep raw body handling below.
    }
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}${text ? `: ${text.slice(0, 180)}` : ''}`);
    }
    return json;
}

function logSection(title) {
    console.log(`\n== ${title} ==`);
}

async function main() {
    const envLocal = await readEnvLocal();
    const configuredBase =
        process.env.VITE_API_BASE_URL ||
        process.env.VITE_API_URL ||
        envLocal.VITE_API_BASE_URL ||
        envLocal.VITE_API_URL ||
        'http://localhost:8000/api/v1';

    const apiBaseUrl = configuredBase.replace(/\/+$/, '');
    const healthUrl = `${apiBaseUrl}/health`;
    const propertiesUrl = `${apiBaseUrl}/realty/properties?category=pg&limit=1`;

    logSection('Frontend API Base');
    console.log(`Using ${apiBaseUrl}`);

    logSection('Backend Health');
    let health;
    try {
        health = await fetchJson(healthUrl);
        console.log(`status=${health?.status ?? 'unknown'}`);
        console.log(`env=${health?.env ?? 'unknown'}`);
        console.log(`database=${health?.database ?? 'unknown'}`);
        console.log(`scheduler=${health?.scheduler ?? 'unknown'}`);
    } catch (error) {
        console.error(`Failed to reach backend health endpoint: ${error.message}`);
        console.error('Start the backend on port 8000 and confirm VITE_API_BASE_URL points to the same host.');
        process.exitCode = 1;
        return;
    }

    logSection('Properties Endpoint');
    try {
        const properties = await fetchJson(propertiesUrl);
        const items = Array.isArray(properties?.items) ? properties.items : [];
        console.log(`items_returned=${items.length}`);
        if (items[0]) {
            const sample = items[0];
            console.log(`sample_property=${sample.property_name ?? sample.title ?? sample.name ?? 'unknown'}`);
        }
    } catch (error) {
        console.error(`Properties endpoint failed: ${error.message}`);
        process.exitCode = 1;
        return;
    }

    logSection('Diagnosis');
    if (health?.env !== 'development') {
        console.warn('Backend is not in development mode. Local CORS can fail unless ENV=development is set.');
        process.exitCode = 1;
    }
    if (health?.database !== 'connected') {
        console.warn('Backend is up, but the database is disconnected. Listings may fail or return stale/incomplete data.');
        process.exitCode = 1;
    }
    if (!process.exitCode) {
        console.log('Local frontend/backend wiring looks healthy.');
    }
}

await main();

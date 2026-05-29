#!/usr/bin/env node
/**
 * Converts a tab-separated property export into src/data/hardcodedProperties.json
 * Usage: node scripts/import-properties-tsv.mjs [input.tsv]
 * Default input: scripts/properties-export.tsv
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const defaultInput = path.join(__dirname, 'properties-export.tsv');
const outputPath = path.join(root, 'src/data/hardcodedProperties.json');

const HEADERS = [
  'id',
  'property_name',
  'location',
  'phone',
  'map_link',
  'property_type',
  'furnishing',
  'private_price',
  'single_price',
  'double_price',
  'triple_price',
  'starting_price',
  'listing_type',
  'is_available',
  'created_at',
  'updated_at',
  'description',
  'features',
  'slug',
  'is_deleted',
  'avg_rating',
  'review_count',
  'city',
  'last_verified_at',
  'last_booked_at',
  'last_review_at',
];

function isNullish(v) {
  if (v == null) return true;
  const s = String(v).trim();
  return s === '' || s.toUpperCase() === 'NULL';
}

function parseNumber(v) {
  if (isNullish(v)) return null;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function parseBool01(v) {
  if (isNullish(v)) return false;
  return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
}

function parseFeatures(raw) {
  if (isNullish(raw)) return null;
  const s = String(raw).trim();
  if (s === '[]' || s.toLowerCase() === 'null') return null;
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  return [s];
}

function normalizePropertyType(v) {
  if (isNullish(v)) return 'PG';
  const s = String(v).trim();
  const upper = s.toUpperCase();
  if (upper === 'PLOT') return 'Plot';
  if (/^\d/.test(s)) return s.toUpperCase().replace(/\s+/g, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function rowToObject(cells) {
  const get = (key) => {
    const i = HEADERS.indexOf(key);
    return i >= 0 ? cells[i] : undefined;
  };

  const id = parseNumber(get('id'));
  if (id == null) return null;

  const features = parseFeatures(get('features'));
  const slugRaw = get('slug');
  const slug = isNullish(slugRaw) ? undefined : String(slugRaw).trim();

  const avg = parseNumber(get('avg_rating'));
  const reviewCount = parseNumber(get('review_count'));

  const row = {
    id: Math.trunc(id),
    property_name: isNullish(get('property_name')) ? 'Untitled' : String(get('property_name')).trim(),
    location: isNullish(get('location')) ? '' : String(get('location')).trim(),
    property_type: normalizePropertyType(get('property_type')),
    furnishing: isNullish(get('furnishing')) ? 'unfurnished' : String(get('furnishing')).trim(),
    listing_type: isNullish(get('listing_type')) ? 'rent' : String(get('listing_type')).trim().toLowerCase(),
    is_available: parseBool01(get('is_available')),
    is_deleted: parseBool01(get('is_deleted')) ? 1 : 0,
  };

  const phone = get('phone');
  if (!isNullish(phone)) row.phone = String(phone).trim();

  const mapLink = get('map_link');
  if (!isNullish(mapLink)) row.map_link = String(mapLink).trim();

  const desc = get('description');
  if (!isNullish(desc)) row.description = String(desc).trim();

  if (slug) row.slug = slug;
  if (features && features.length) row.features = features;

  for (const priceKey of ['private_price', 'single_price', 'double_price', 'triple_price', 'starting_price']) {
    const n = parseNumber(get(priceKey));
    if (n != null) row[priceKey] = n;
  }

  if (avg != null) row.average_rating = avg;
  if (reviewCount != null) row.review_count = Math.trunc(reviewCount);

  const city = get('city');
  if (!isNullish(city)) row.city = String(city).trim().toLowerCase();

  for (const ts of ['created_at', 'updated_at', 'last_verified_at', 'last_booked_at', 'last_review_at']) {
    const v = get(ts);
    if (!isNullish(v)) row[ts] = String(v).trim();
  }

  return row;
}

function parseTsv(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];

  let start = 0;
  const first = lines[0].split('\t');
  if (first[0]?.trim().toLowerCase() === 'id' || first.includes('property_name')) {
    start = 1;
  }

  const rows = [];
  for (let i = start; i < lines.length; i++) {
    const cells = lines[i].split('\t');
    if (cells.length < 5) continue;
    // Pad short rows
    while (cells.length < HEADERS.length) cells.push('');
    const obj = rowToObject(cells);
    if (obj) rows.push(obj);
  }
  return rows;
}

function main() {
  const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(inputPath, 'utf8');
  const rows = parseTsv(content);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2) + '\n');
  console.log(`Wrote ${rows.length} properties to ${outputPath}`);
}

main();

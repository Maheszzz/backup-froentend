/**
 * Generates thin app route page.tsx wrappers. Run: node scripts/generate-next-pages.mjs
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'src', 'app');

function write(rel, body) {
    const full = join(app, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, `export const dynamic = 'force-dynamic';\n\n${body}\n`);
}

const exp = (p) => "export { default } from '@/" + p + "';";

write('contact-us/page.tsx', exp('views/Contact'));
write('properties/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="all" initialCity="Bangalore" />;
}`);
write('properties/in/[city]/page.tsx', `import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={\`all-\${city}\`} initialCategory="all" initialCity={city} pageTitle={\`Properties in \${t}\`} pageSubtitle={\`Explore verified homes in \${t}\`} />;
}`);
write('rent/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="rent" initialCategory="rent" initialCity="Bangalore" pageTitle="Properties for Rent" pageSubtitle="Find your perfect rental home in Bangalore" />;
}`);
write('rent/in/[city]/page.tsx', `import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={\`rent-\${city}\`} initialCategory="rent" initialCity={city} pageTitle={\`Rent in \${t}\`} pageSubtitle={\`Explore verified rentals in \${t}\`} />;
}`);
write('rent/[slug]/page.tsx', exp('routes/RentSlugRoute'));
write('pg/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="pg" initialCategory="pg" initialCity="Bangalore" pageTitle="PG Accommodations" pageSubtitle="Comfortable & verified PG options in Bangalore" />;
}`);
write('pg/[slug]/page.tsx', exp('routes/PgSlugRoute'));
write('property/[slug]/page.tsx', exp('views/PropertyDetails'));
write('properties/[slug]/page.tsx', exp('views/PropertyDetails'));
write('blog/page.tsx', exp('views/BlogIndex'));
write('blog/[slug]/page.tsx', exp('views/BlogPost'));
write('terms/page.tsx', exp('views/Terms'));
write('privacy/page.tsx', exp('views/Privacy'));
write('refund-policy/page.tsx', exp('views/RefundPolicy'));
write('quick-pay/page.tsx', exp('views/QuickPay'));
write('wishlist/page.tsx', exp('views/Wishlist'));
write('faq/page.tsx', exp('views/FAQ'));
write('about/page.tsx', exp('views/About'));
write('how-we-verify/page.tsx', exp('views/HowWeVerify'));
write('schedule-demo/page.tsx', exp('views/ScheduleDemo'));
write('pg-with-wifi/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-with-food/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-with-ac/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-for-girls/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-for-boys/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-single-room/page.tsx', exp('views/PgFeatureLandingPage'));
write('pg-near-me/page.tsx', exp('views/PgNearMe'));
write('pg-vs-flat-bangalore/page.tsx', exp('views/PgVsFlatBangalore'));
write('flats-in-bangalore/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="flats-bangalore" initialCategory="rent" pageTitle="Flats for Rent in Bangalore" />;
}`);
write('plots/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="plots" initialCategory="plot" initialCity="Bangalore" pageTitle="Plots & Land for Sale" pageSubtitle="Find plots and land to build your dream home in Bangalore" />;
}`);
write('plots/in/bangalore/page.tsx', exp('views/PlotBangaloreHub'));
write('plots/in/[city]/page.tsx', `import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={\`plot-\${city}\`} initialCategory="plot" initialCity={city} pageTitle={\`Plots in \${t}\`} pageSubtitle={\`Explore verified plots in \${t}\`} />;
}`);
write('buy/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="buy" initialCategory="buy" initialCity="Bangalore" pageTitle="Properties for Sale" pageSubtitle="Find your dream home to buy in Bangalore" />;
}`);
write('buy/in/bangalore/page.tsx', exp('views/BuyBangaloreHub'));
write('buy/in/[city]/page.tsx', `import Properties from '@/views/Properties';
import { useParams } from '@/lib/navigation';
export default function Page() {
  const { city } = useParams();
  const t = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  return <Properties key={\`buy-\${city}\`} initialCategory="buy" initialCity={city} pageTitle={\`Buy in \${t}\`} pageSubtitle={\`Explore verified homes for sale in \${t}\`} />;
}`);
write('1bhk/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="1bhk" initialTypeFilter="1BHK" initialCity="Bangalore" pageTitle="1 BHK Properties in Bangalore" pageSubtitle="Perfect homes for singles and couples" />;
}`);
write('2bhk/page.tsx', `import Properties from '@/views/Properties';
export default function Page() {
  return <Properties key="2bhk" initialTypeFilter="2BHK" initialCity="Bangalore" pageTitle="2 BHK Properties in Bangalore" pageSubtitle="Ideal spaces for small families" />;
}`);
write('pg-for-boys-in/[slug]/page.tsx', exp('views/PgGenderLocalityPage'));
write('pg-for-girls-in/[slug]/page.tsx', exp('views/PgGenderLocalityPage'));
write('pg-for-men-in/[slug]/page.tsx', exp('views/PgGenderLocalityPage'));
write('pg-for-women-in/[slug]/page.tsx', exp('views/PgGenderLocalityPage'));
write('services/[serviceId]/page.tsx', exp('views/ServiceDetail'));
write('not-found.tsx', exp('views/NotFound'));

for (const p of [
    'pg-near-ecospace', 'pg-near-rmz-ecoworld', 'pg-near-wipro-ecity', 'pg-near-manyata',
    'pg-near-itpl', 'pg-near-embassy-techvillage', 'pg-near-ecity-phase-2', 'pg-near-prestige-tech-park',
]) {
    write(`${p}/page.tsx`, exp('views/PgNearLandmarkPage'));
}

// Programmatic SEO uses required catch-all `src/app/[...path]/` (see SeoCatchAllClient.tsx).
// Do not add `[[...path]]` — it conflicts with `[...path]` and with `app/page.tsx` for `/`.

console.log('Next.js app routes generated.');

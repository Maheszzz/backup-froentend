import { redirect } from 'next/navigation';

/** Consolidate generic `/pg` into the primary city hub (stronger content, one canonical URL). */
export default function PgIndexPage() {
    redirect('/pg/bangalore');
}

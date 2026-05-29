import { Fragment } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbNavItem {
    name: string;
    path?: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbNavItem[];
}

/** Visible breadcrumbs (matches BreadcrumbList JSON-LD). */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-slate-500" aria-label="Breadcrumb">
            {items.map((it, i) => {
                const isLast = i === items.length - 1;
                return (
                    <Fragment key={`${it.name}-${i}`}>
                        {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />}
                        {!isLast && it.path ? (
                            <Link to={it.path} className="hover:text-brand-red font-medium text-slate-600">
                                {it.name}
                            </Link>
                        ) : (
                            <span className={isLast ? 'font-semibold text-slate-800' : undefined}>{it.name}</span>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}

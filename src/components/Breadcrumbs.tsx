'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';

export interface Crumb {
  href?: string;
  label: string;
  /** If provided, we translate this key via the dictionary at render time. */
  labelKey?: keyof typeof dict.nav | keyof typeof dict.breadcrumbs;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useT();

  function resolve(c: Crumb) {
    if (!c.labelKey) return c.label;
    if (c.labelKey in dict.nav) {
      return t((dict.nav as any)[c.labelKey]);
    }
    if (c.labelKey in dict.breadcrumbs) {
      return t((dict.breadcrumbs as any)[c.labelKey]);
    }
    return c.label;
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6">
      <ol
        className="flex flex-wrap items-center gap-1.5"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((c, i) => {
          const label = resolve(c);
          return (
            <li
              key={i}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {c.href ? (
                <Link
                  href={c.href}
                  className="no-underline hover:text-accent transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{label}</span>
                </Link>
              ) : (
                <span itemProp="name" className="text-fg">
                  {label}
                </span>
              )}
              <meta itemProp="position" content={String(i + 1)} />
              {i < items.length - 1 && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

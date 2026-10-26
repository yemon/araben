/**
 * Small building blocks shared by the admin screens, in the trace builder's
 * style: rounded inputs on the surface colour, accent on focus.
 */
import Link from 'next/link';
import { Icon } from './icons';

export const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-fg outline-none transition-colors focus:border-accent';

// Arabic needs room: a larger size, its own font, right to left.
export const arabicInputClass = `${inputClass} font-arabic text-xl leading-relaxed`;

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <Link
            href={back.href}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label={back.label}
            title={back.label}
          >
            <Icon name="arrowLeft" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-fg">{title}</h1>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
      {error}
    </p>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-muted">
        {label}
        {required && ' *'}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 rounded-3xl border-2 border-dashed border-border bg-surface p-8 text-center text-muted">
      {children}
    </p>
  );
}

const iconButton =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-colors';

export function EditLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={`${iconButton} hover:border-accent hover:text-accent`} aria-label={label} title="Edit">
      <Icon name="pencil" size={16} />
    </Link>
  );
}

export { iconButton };

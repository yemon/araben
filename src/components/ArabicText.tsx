import { clsx } from '@/lib/clsx';

export function ArabicText({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <span
      lang="ar"
      dir="rtl"
      className={clsx(size === 'lg' ? 'ar-lg' : 'ar', className)}
    >
      {children}
    </span>
  );
}

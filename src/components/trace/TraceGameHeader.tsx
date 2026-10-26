'use client';

/**
 * The trace player's controls, carried over from kids-hub's GameHeader,
 * StudentBackButton, StudentHomeButton and CandyButton: round "candy"
 * buttons — a bright fill over a hard offset shadow the button drops into
 * when pressed — and a title bar beside them.
 *
 * kids-hub's icons come from lucide-react, which araben doesn't ship, so
 * the two it needs (ArrowLeft, Home) are inlined with lucide's own paths.
 */

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

const CANDY = {
  grape: { fill: '#9B5DE5', shadow: '#7a3fc4' },
  sky: { fill: '#4D96FF', shadow: '#2f6fd6' },
};

// The resting shadow has to be a class: set inline it would win over the
// `:active` rule and the button would never look pressed.
const CANDY_BASE =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ' +
  'bg-[var(--candy-fill)] [box-shadow:0_5px_0_var(--candy-shadow)] ' +
  'transition-[transform,box-shadow,filter] duration-75 hover:brightness-105 ' +
  'active:translate-y-[4px] active:[box-shadow:0_1px_0_var(--candy-shadow)] ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70';

function CandyLink({
  color,
  label,
  href,
  children,
}: {
  color: { fill: string; shadow: string };
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={CANDY_BASE}
      style={{ '--candy-fill': color.fill, '--candy-shadow': color.shadow } as CSSProperties}
    >
      {children}
    </Link>
  );
}

const ICON = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** Back to the word list, and Home — the way out of the section entirely. */
export function TraceNavButtons({ backHref }: { backHref: string }) {
  return (
    <>
      <CandyLink color={CANDY.grape} label="Back" href={backHref}>
        <svg {...ICON}>
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </CandyLink>
      <CandyLink color={CANDY.sky} label="Home" href="/">
        <svg {...ICON}>
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      </CandyLink>
    </>
  );
}

/** Back + Home + title bar, the wide-screen header above the paper. */
export default function TraceGameHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: ReactNode;
  backHref: string;
}) {
  return (
    <div className="w-full flex items-center gap-3 shrink-0">
      <TraceNavButtons backHref={backHref} />
      <div className="flex-1 min-w-0 bg-surface/70 backdrop-blur-sm rounded-2xl px-4 py-2 shadow border-2 border-[#b8ddd8]">
        {/* truncate + min-w-0 keeps the title on one line, so a long name
            shortens with an ellipsis instead of doubling the header. */}
        <p className="text-base font-black text-accent text-center truncate min-w-0">
          🍃 {title}
        </p>
        {subtitle && <p className="text-xs text-muted text-center">{subtitle}</p>}
      </div>
    </div>
  );
}

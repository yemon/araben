/**
 * The frame the trace player expects to be inside — kids-hub's
 * trace/[slug]/layout.jsx. The player's markup assumes this `max-w-7xl`
 * cap; without it the content card stretches to the full viewport and the
 * trace surface comes out far wider than it was designed for. The site Nav
 * and Footer hide themselves on this route (isFullscreenRoute in
 * lib/nav.ts). On a phone the player switches to `fixed inset-0` and
 * escapes this wrapper entirely.
 */
export default function TracePlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-3 pb-4 md:px-6 lg:px-8 lg:pt-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Video timecodes as people type them: "12", "12.5", "0:12.5", "1:02:03".
 * Stored as whole milliseconds.
 */

const MAX_MS = 6 * 60 * 60 * 1000; // six hours is plenty for a scenario video

/** Milliseconds for a timecode; null for an empty one; NaN if unreadable. */
export function parseTimecode(input: string): number | null {
  const s = input.trim();
  if (!s) return null;
  const m = /^(?:(?:(\d+):)?([0-5]?\d):)?(\d+(?:\.\d{1,3})?)$/.exec(s);
  if (!m) return NaN;
  const [, h, min, sec] = m;
  // Plain seconds may exceed 59 ("75" = 1:15); after a colon they may not.
  if ((h !== undefined || min !== undefined) && Number(sec) >= 60) return NaN;
  const ms = Math.round(((Number(h ?? 0) * 60 + Number(min ?? 0)) * 60 + Number(sec)) * 1000);
  return ms <= MAX_MS ? ms : NaN;
}

/** "m:ss.s" (or "h:mm:ss.s"), tenths only when they aren't zero. */
export function formatTimecode(ms: number): string {
  const tenths = Math.round(ms / 100);
  const totalSec = Math.floor(tenths / 10);
  const frac = tenths % 10 ? `.${tenths % 10}` : '';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const sec = String(totalSec % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}${frac}` : `${m}:${sec}${frac}`;
}

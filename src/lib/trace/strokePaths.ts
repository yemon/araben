/**
 * Stroke-path geometry for the trace player.
 *
 * Strokes are polylines resampled every SP pixels so the engine can walk a
 * child's crayon along them. fontTrace.ts builds Arabic strokes from the trace
 * font with these helpers.
 */

// Spacing between resampled points on a stroke, in CSS pixels.
export const SP = 3;

export type Pt = { x: number; y: number };

// One stroke to trace: a line of resampled points, or a dot tapped once.
// `road` is the stroke's own road width; `len` its share of the progress.
export type Stroke =
  | { pts: Pt[]; dot: null; len: number; road: number }
  | { pts: null; dot: Pt; len: number; road: number };

// A word's strokes as laid out for one canvas size. strokeChar is each
// stroke's letter; U is the ruled band's unit height, R how far the finger
// may stray from the line, ROAD the letters' road width.
export type StrokeSet = {
  strokes: Stroke[];
  strokeChar: number[];
  totalLen: number;
  U: number;
  R: number;
  ROAD: number;
};

export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function densify(pts: Pt[], step: number): Pt[] {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    const d = dist(a, b);
    if (d < 1e-9) continue;
    const n = Math.ceil(d / step);
    for (let j = 1; j <= n; j++) {
      out.push({
        x: a.x + ((b.x - a.x) * j) / n,
        y: a.y + ((b.y - a.y) * j) / n,
      });
    }
  }
  return out;
}

export function resample(pts: Pt[], step: number): Pt[] {
  const out = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const d = dist(a, b);
    if (d < 1e-9) continue;
    let rem = d;
    let t0 = 0;
    while (acc + rem >= step) {
      const need = step - acc;
      const t = t0 + (1 - t0) * (need / rem);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      rem -= need;
      t0 = t;
      acc = 0;
    }
    acc += rem;
  }
  const last = pts[pts.length - 1];
  if (dist(out[out.length - 1], last) > step * 0.4) out.push(last);
  return out;
}

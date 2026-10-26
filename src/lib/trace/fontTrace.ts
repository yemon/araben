/**
 * Arabic strokes, derived from the trace font.
 *
 * Arabic can't be traced from hand-drawn letter skeletons: its letters join
 * and change shape with their neighbours, so a word isn't a row of fixed
 * letter shapes. Instead the browser shapes the word in the trace font, and
 * the strokes are read back off that rendering:
 *
 *   1. thin     the ink is thinned to a one-pixel centre line (Zhang–Suen)
 *   2. graph    the centre line becomes a graph — line ends and junctions
 *               are nodes, the runs between them edges — with the short
 *               spurs thinning leaves in corners pruned away
 *   3. strokes  each piece of ink is walked into strokes the way Arabic is
 *               written: starting in its rightmost letter, top first; a
 *               branch that leads nowhere (a tooth, a joined lam's stem) is
 *               written up and back down as the pen passes it;
 *               junctions are crossed smoothly, loops finished before the
 *               pen leaves them
 *   4. letters  the strokes are cut where they cross from one letter into
 *               the next, so the word is traced a letter at a time, right
 *               to left: each letter's line, then its dots and hamza, then
 *               its harakat, before the next letter starts
 *
 * The result is a StrokeSet (strokePaths.ts), which StrokeTraceSurface
 * plays — numbered start dots, direction arrows and all.
 *
 * Browser-only: it draws on an offscreen canvas.
 */

import {
  SP,
  densify,
  resample,
  type Pt,
  type Stroke,
  type StrokeSet,
} from "./strokePaths";
import { stripHarakat } from "./traceLanguages";

type Ctx2D = CanvasRenderingContext2D;

export type TraceLayout = ReturnType<typeof layoutWord>;

// The word as the canvas draws it.
export type TraceWord = {
  word: string;
  family: string;
  weight: number;
  layout: TraceLayout;
};

export type ArabicStrokes = StrokeSet & { trace: TraceWord };

type Box = { x0: number; y0: number; x1: number; y1: number };

// Skeleton graph: a node is a set of pixels, an edge the pixel run between
// two nodes (a === b for a loop). Edges gain CSS-pixel points once placed.
type GraphNode = { pixels: number[] };
type RawEdge = { a: number; b: number; pix: number[] };
type Edge = RawEdge & { pts: Pt[] };

// One 8-connected piece of ink, measured in CSS pixels.
type Piece = {
  area: number;
  sx: number;
  sy: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  edges: Edge[];
  length: number;
  nodes: Pt[];
  isDot: boolean;
  isMark: boolean;
  cx: number;
  cy: number;
};

// Measuring size. Layout is worked out here, then scaled to fit.
const REF_SIZE = 100;

// Letters whose isolated forms reach highest, lowest, and the top of the
// letter body. They fix where the ruled lines sit, so every word gets the
// same paper no matter which letters it happens to contain.
const ASCENDERS = ["ا", "ل", "ك", "ط"];
const DESCENDERS = ["ج", "ع", "ن", "م", "ي", "و", "ر"];
const BODY = "س";

// Share of the canvas the ruled band and the word may take up.
const BAND_HEIGHT = 0.8;
const WORD_WIDTH = 0.84;

// The skeleton is computed on a scaled-down rendering in which a stroke is
// about WORK_STROKE pixels wide — plenty for a clean centre line, and it
// keeps thinning fast on any screen. STROKE_EM is the trace font's stroke
// width as a share of its size, at the weight the player uses.
const WORK_STROKE = 12;
const STROKE_EM = 0.13;

// A piece of ink whose centre line is shorter than this many working
// pixels (about half a stroke width) is a dot: one tap, not a stroke.
const DOT_POINTS = 6;

// Pieces smaller than this (as a share of the font size, both ways) are
// marks that belong to a letter — hamza, and the dots — and are written
// after it rather than taking a turn of their own.
const MARK_EM = 0.3;

// A stroke is split into one piece per letter; a piece shorter than this
// (share of the font size) is a join grazing the next letter, not a letter.
const LETTER_RUN_EM = 0.12;

function fontString(weight: number, size: number, family: string) {
  return `${weight} ${size}px ${family}`;
}

function inkBox(ctx: Ctx2D, text: string) {
  const m = ctx.measureText(text);
  return {
    asc: m.actualBoundingBoxAscent,
    desc: m.actualBoundingBoxDescent,
    left: m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
  };
}

/**
 * Size and place the word inside W×H: the ruled band is centred
 * vertically, the word's ink is centred horizontally, and the font is as
 * large as both allow.
 */
function layoutWord(
  ctx: Ctx2D,
  word: string,
  family: string,
  weight: number,
  W: number,
  H: number,
) {
  ctx.save();
  ctx.font = fontString(weight, REF_SIZE, family);
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const ruleAsc = Math.max(...ASCENDERS.map((ch) => inkBox(ctx, ch).asc));
  const ruleDesc = Math.max(...DESCENDERS.map((ch) => inkBox(ctx, ch).desc));
  const bodyAsc = inkBox(ctx, BODY).asc;
  const box = inkBox(ctx, word);
  // Advance width of each prefix. Arabic runs right to left, so letter i
  // sits between prefixes i and i + 1, measured in from the right edge.
  // A trailing kashida (ـ) makes a prefix's last letter take the joined
  // form it has in the word, not its wider standalone one; the kashida's
  // own width is then taken back off. (A zero-width joiner would be the
  // textbook way, but the font's Arabic subset has no glyph for it and
  // the fallback measures wide.)
  // Harakat take no width, so letters are measured bare.
  const bare = stripHarakat(word);
  const kashida = ctx.measureText("ـ").width;
  const advances = [0];
  for (let i = 1; i < bare.length; i++) {
    const w = ctx.measureText(bare.slice(0, i) + "ـ").width - kashida;
    advances.push(Math.max(advances[i - 1], w));
  }
  advances.push(ctx.measureText(bare).width);
  ctx.restore();

  const asc = Math.max(ruleAsc, box.asc);
  const desc = Math.max(ruleDesc, box.desc);
  const inkWidth = Math.max(1, box.left + box.right);

  const scale = Math.min(
    (H * BAND_HEIGHT) / (asc + desc),
    (W * WORD_WIDTH) / inkWidth,
  );
  const size = REF_SIZE * scale;
  const bandTop = (H - (asc + desc) * scale) / 2;
  const baseline = Math.round(bandTop + asc * scale);
  // With textAlign "center" the ink runs from x - left to x + right; shift
  // x so that span, rather than the advance width, sits in the middle.
  const x = W / 2 + ((box.left - box.right) * scale) / 2;
  const right = x + (advances[bare.length] * scale) / 2;

  return {
    // [left, right] of each letter on the canvas, first letter rightmost.
    letters: advances.slice(0, -1).map((a, i): [number, number] => [
      right - advances[i + 1] * scale,
      right - a * scale,
    ]),
    size,
    x,
    baseline,
    inkLeft: x - box.left * scale,
    inkRight: x + box.right * scale,
    // Everything the word inks — ascenders, dots, descenders — lies within
    // the band, so the canvas above and below it is free for other marks.
    band: { top: bandTop, bottom: baseline + desc * scale },
    rules: {
      top: baseline - ruleAsc * scale,
      body: baseline - bodyAsc * scale,
      base: baseline,
      bottom: baseline + ruleDesc * scale,
    },
  };
}

/**
 * Draw the word as laid out. `grow` fattens it by that many pixels on every
 * side — used for the mask the crayon is clipped to, so ink reaches the
 * very edge of the letter instead of stopping a hair short of it.
 */
export function drawTraceWord(
  ctx: Ctx2D,
  trace: TraceWord,
  color: string,
  grow = 0,
) {
  const { word, family, weight, layout } = trace;
  ctx.save();
  ctx.font = fontString(weight, layout.size, family);
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = color;
  ctx.fillText(word, layout.x, layout.baseline);
  if (grow > 0) {
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineWidth = grow * 2;
    ctx.strokeText(word, layout.x, layout.baseline);
  }
  ctx.restore();
}

// Zhang–Suen thinning, confined to the ink's bounding box. Peels boundary
// pixels off in two alternating sub-passes until only a one-pixel centre
// line is left. A dot can thin away entirely (it erases 2×2 blocks), which
// is why dots are placed from their ink's centre, not their skeleton.
function thin(ink: Uint8Array, w: number, box: Box) {
  const out = ink.slice();
  const doomed: number[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let pass = 0; pass < 2; pass++) {
      doomed.length = 0;
      for (let y = box.y0; y <= box.y1; y++) {
        for (let x = box.x0; x <= box.x1; x++) {
          const i = y * w + x;
          if (!out[i]) continue;
          const p2 = out[i - w];
          const p3 = out[i - w + 1];
          const p4 = out[i + 1];
          const p5 = out[i + w + 1];
          const p6 = out[i + w];
          const p7 = out[i + w - 1];
          const p8 = out[i - 1];
          const p9 = out[i - w - 1];
          const neighbours = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (neighbours < 2 || neighbours > 6) continue;
          const transitions =
            (!p2 && p3 ? 1 : 0) +
            (!p3 && p4 ? 1 : 0) +
            (!p4 && p5 ? 1 : 0) +
            (!p5 && p6 ? 1 : 0) +
            (!p6 && p7 ? 1 : 0) +
            (!p7 && p8 ? 1 : 0) +
            (!p8 && p9 ? 1 : 0) +
            (!p9 && p2 ? 1 : 0);
          if (transitions !== 1) continue;
          if (pass === 0 ? p2 * p4 * p6 || p4 * p6 * p8 : p2 * p4 * p8 || p2 * p6 * p8)
            continue;
          doomed.push(i);
        }
      }
      if (doomed.length) {
        changed = true;
        for (const i of doomed) out[i] = 0;
      }
    }
  }
  return out;
}

// Label each 8-connected piece of ink. Returns per-pixel labels (-1 for
// paper) and how many pieces there are.
function labelParts(ink: Uint8Array, w: number, h: number) {
  const labels = new Int32Array(w * h).fill(-1);
  const stack: number[] = [];
  let count = 0;
  for (let start = 0; start < ink.length; start++) {
    if (!ink[start] || labels[start] !== -1) continue;
    labels[start] = count;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop()!;
      const x = i % w;
      const y = (i - x) / w;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const j = ny * w + nx;
          if (ink[j] && labels[j] === -1) {
            labels[j] = count;
            stack.push(j);
          }
        }
      }
    }
    count++;
  }
  return { labels, count };
}

// The centre line as a graph. Nodes are line ends and junctions (adjacent
// junction pixels merged into one node); edges are the pixel runs between
// them. Neighbours use mixed adjacency — a diagonal step counts only when
// no shared side-neighbour already links the two pixels — so the staircase
// corners thinning leaves don't read as junctions.
function skeletonGraph(skel: Uint8Array, w: number, h: number) {
  const STEPS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const cache = new Map<number, number[]>();
  const nbrs = (i: number): number[] => {
    let out = cache.get(i);
    if (out) return out;
    out = [];
    const x = i % w;
    const y = (i - x) / w;
    for (const [dx, dy] of STEPS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (!skel[j]) continue;
      if (dx && dy && (skel[y * w + nx] || skel[ny * w + x])) continue;
      out.push(j);
    }
    cache.set(i, out);
    return out;
  };

  const pixels: number[] = [];
  for (let i = 0; i < skel.length; i++) if (skel[i]) pixels.push(i);

  const nodeOf = new Int32Array(w * h).fill(-1);
  const nodes: GraphNode[] = [];
  for (const p of pixels) {
    if (nbrs(p).length === 2 || nodeOf[p] !== -1) continue;
    const id = nodes.length;
    const members = [p];
    nodeOf[p] = id;
    if (nbrs(p).length >= 3) {
      const stack = [p];
      while (stack.length) {
        for (const q of nbrs(stack.pop()!)) {
          if (nbrs(q).length >= 3 && nodeOf[q] === -1) {
            nodeOf[q] = id;
            members.push(q);
            stack.push(q);
          }
        }
      }
    }
    nodes.push({ pixels: members });
  }

  const edges: RawEdge[] = [];
  const used = new Uint8Array(w * h);
  const pairs = new Set<string>();
  nodes.forEach((node, id) => {
    for (const p of node.pixels) {
      for (const q of nbrs(p)) {
        if (nodeOf[q] === id) continue;
        if (nodeOf[q] !== -1) {
          const key = p < q ? `${p},${q}` : `${q},${p}`;
          if (!pairs.has(key)) {
            pairs.add(key);
            edges.push({ a: id, b: nodeOf[q], pix: [p, q] });
          }
          continue;
        }
        if (used[q]) continue;
        const pix = [p];
        let prev = p;
        let cur = q;
        for (;;) {
          used[cur] = 1;
          pix.push(cur);
          const next = nbrs(cur).find((r) => r !== prev);
          if (next === undefined) break;
          if (nodeOf[next] !== -1) {
            pix.push(next);
            edges.push({ a: id, b: nodeOf[next], pix });
            break;
          }
          if (used[next]) break;
          prev = cur;
          cur = next;
        }
      }
    }
  });

  // Closed rings with no end and no junction — an o-shaped loop on its own.
  for (const p of pixels) {
    if (used[p] || nodeOf[p] !== -1) continue;
    const id = nodes.length;
    nodes.push({ pixels: [p] });
    nodeOf[p] = id;
    const pix = [p];
    let prev = p;
    let cur: number | undefined = nbrs(p)[0];
    while (cur !== undefined && cur !== p && !used[cur]) {
      used[cur] = 1;
      pix.push(cur);
      const next: number | undefined = nbrs(cur).find((r) => r !== prev);
      prev = cur;
      cur = next;
    }
    pix.push(p);
    edges.push({ a: id, b: id, pix });
  }

  return { nodes, edges };
}

function degrees(nodes: GraphNode[], edges: RawEdge[]) {
  const d: number[] = new Array(nodes.length).fill(0);
  for (const e of edges) {
    d[e.a]++;
    d[e.b]++;
  }
  return d;
}

// Drop the short spurs thinning grows into a stroke's corners, then fuse
// the edges either side of any node left with just two.
function tidyGraph(
  nodes: GraphNode[],
  edges: RawEdge[],
  spurLength: number,
): RawEdge[] {
  let live = edges.slice();
  for (let changed = true; changed; ) {
    changed = false;
    const d = degrees(nodes, live);
    const spur = live.find(
      (e) =>
        e.a !== e.b &&
        e.pix.length < spurLength &&
        ((d[e.a] === 1 && d[e.b] >= 3) || (d[e.b] === 1 && d[e.a] >= 3)),
    );
    if (spur) {
      live = live.filter((e) => e !== spur);
      changed = true;
    }
  }
  for (let changed = true; changed; ) {
    changed = false;
    const d = degrees(nodes, live);
    for (let n = 0; n < nodes.length && !changed; n++) {
      if (d[n] !== 2) continue;
      const [e1, e2] = live.filter((e) => e.a === n || e.b === n);
      if (!e2 || e1 === e2) continue;
      const into = e1.b === n ? e1.pix : e1.pix.slice().reverse();
      const from = e2.a === n ? e2.pix : e2.pix.slice().reverse();
      const merged = {
        a: e1.b === n ? e1.a : e1.b,
        b: e2.a === n ? e2.b : e2.a,
        pix: into.concat(from.slice(1)),
      };
      live = live.filter((e) => e !== e1 && e !== e2).concat(merged);
      changed = true;
    }
  }
  return live;
}

const unit = (dx: number, dy: number): Pt => {
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
};

// Direction a run of points sets off in (or, from its end, arrives in).
function heading(pts: Pt[], fromEnd = false) {
  const n = pts.length;
  const look = Math.min(n - 1, 6);
  return fromEnd
    ? unit(
        pts[n - 1].x - pts[n - 1 - look].x,
        pts[n - 1].y - pts[n - 1 - look].y,
      )
    : unit(pts[look].x - pts[0].x, pts[look].y - pts[0].y);
}

/**
 * Walk one piece of ink's edges into strokes. Each stroke starts at the
 * best free line end (or junction, if the piece is all loops): inside the
 * piece's first — rightmost — letter if possible, and there the highest,
 * then rightmost. From there it follows the Fleury rule (never cross a
 * bridge while another way on exists, so a loop is finished before the pen
 * leaves it), takes the straightest way through a junction, and writes a
 * dead-end branch (a tooth, a stem) up and back down on the way past.
 */
function walkPiece(
  edges: Edge[],
  nodes: Pt[],
  firstLetter: readonly number[],
): Pt[][] {
  const left = new Set(edges);
  const ends = (n: number) => [...left].filter((e) => e.a === n || e.b === n);
  const other = (e: Edge, n: number) => (e.a === n ? e.b : e.a);
  const oriented = (e: Edge, n: number) =>
    e.a === n ? e.pts : e.pts.slice().reverse();

  // Would taking e from n cut n off from edges still to trace?
  const isBridge = (e: Edge, n: number) => {
    if (e.a === e.b) return false;
    const target = other(e, n);
    const seen = new Set([target]);
    const stack = [target];
    while (stack.length) {
      const m = stack.pop()!;
      for (const f of left) {
        if (f === e || (f.a !== m && f.b !== m)) continue;
        const k = other(f, m);
        if (k === n) return false;
        if (!seen.has(k)) {
          seen.add(k);
          stack.push(k);
        }
      }
    }
    return true;
  };

  const isDeadEnd = (e: Edge, n: number) => {
    const far = other(e, n);
    return far !== n && ends(far).length === 1;
  };

  const strokes: Pt[][] = [];
  while (left.size) {
    const counts = new Map<number, number>();
    for (const e of left) {
      counts.set(e.a, (counts.get(e.a) || 0) + 1);
      counts.set(e.b, (counts.get(e.b) || 0) + 1);
    }
    let starts = [...counts.keys()].filter((n) => counts.get(n)! % 2 === 1);
    if (!starts.length) starts = [...counts.keys()];
    const inFirst = starts.filter((n) => nodes[n].x >= firstLetter[0]);
    if (inFirst.length) starts = inFirst;
    const rank = (n: number) => nodes[n].x - 2 * nodes[n].y;
    let cur = starts.reduce((best, n) => (rank(n) > rank(best) ? n : best));

    let pts: Pt[] = [];
    let dir: Pt | null = null;
    for (;;) {
      const options = ends(cur);
      if (!options.length) break;
      // A branch that goes nowhere — a tooth, or the stem of a joined lam or
      // kaf — is written up and straight back down, then the pen carries
      // on. Arabic only ever moves on leftward, so the way on is the branch
      // that leads further on or, when every branch is a dead end, the one
      // that reaches furthest left; the others are written first, the
      // rightmost first. The pen never heads off left and then comes back.
      let tooth: Edge | null = null;
      if (pts.length && options.length > 1) {
        const reach = (e: Edge) => Math.min(...e.pts.map((p) => p.x));
        const deadEnds = options.filter((e) => isDeadEnd(e, cur));
        const allDead = deadEnds.length === options.length;
        const onward = allDead
          ? deadEnds.reduce((a, b) => (reach(b) < reach(a) ? b : a))
          : null;
        const detours = deadEnds.filter((e) => e !== onward);
        if (detours.length) {
          tooth = detours.reduce((a, b) => (reach(b) > reach(a) ? b : a));
        }
      }
      if (tooth) {
        const out = oriented(tooth, cur);
        pts = pts.concat(out.slice(1), out.slice().reverse().slice(1));
        left.delete(tooth);
        continue;
      }
      let usable = options.filter((e) => !isBridge(e, cur));
      if (!usable.length) usable = options;
      // Every way out, with loops offered in both directions.
      const ways: { e: Edge; pts: Pt[] }[] = [];
      for (const e of usable) {
        ways.push({ e, pts: oriented(e, cur) });
        if (e.a === e.b) ways.push({ e, pts: e.pts.slice().reverse() });
      }
      // Straightest continuation; from a standing start, the way that
      // heads most upward (Arabic letters begin at their top).
      const score = (way: { pts: Pt[] }) => {
        const h = heading(way.pts);
        return dir ? h.x * dir.x + h.y * dir.y : -h.y + 0.3 * h.x;
      };
      const pick = ways.reduce((a, b) => (score(b) > score(a) ? b : a));
      pts = pts.length ? pts.concat(pick.pts.slice(1)) : pick.pts.slice();
      dir = heading(pick.pts, true);
      left.delete(pick.e);
      cur = other(pick.e, cur);
    }
    if (pts.length > 1) strokes.push(pts);
  }
  return strokes;
}

/**
 * Cut one stroke where it passes from one letter into the next, so a joined
 * word is traced a letter at a time. Each point takes the letter whose
 * span it lies in — but never an earlier one than the point before it, so
 * a bowl sweeping back under the letters it follows still belongs to its
 * own letter. Runs shorter than minRun (a sliver where a join grazes a
 * neighbour's span) fold into the run beside them. Neighbouring pieces
 * share their boundary point, so the strokes meet end to start.
 */
function splitByLetter(
  pts: Pt[],
  letterOf: (x: number) => number,
  minRun: number,
): { letter: number; pts: Pt[] }[] {
  const letters: number[] = [];
  let cur = -1;
  for (const p of pts) {
    cur = Math.max(cur, letterOf(p.x));
    letters.push(cur);
  }
  type Run = { letter: number; from: number; to: number };
  let runs: Run[] = [];
  let from = 0;
  for (let i = 1; i <= pts.length; i++) {
    if (i === pts.length || letters[i] !== letters[i - 1]) {
      runs.push({ letter: letters[i - 1], from, to: i - 1 });
      from = i;
    }
  }
  const length = (r: Run) => {
    let d = 0;
    for (let i = r.from + 1; i <= r.to; i++) {
      d += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return d;
  };
  while (runs.length > 1) {
    const shortest = runs.reduce((a, b) => (length(b) < length(a) ? b : a));
    if (length(shortest) >= minRun) break;
    const i = runs.indexOf(shortest);
    const into = i > 0 ? i - 1 : 1;
    const merged = {
      letter: runs[into].letter,
      from: Math.min(runs[into].from, shortest.from),
      to: Math.max(runs[into].to, shortest.to),
    };
    runs = runs.filter((_, j) => j !== i && j !== into);
    runs.splice(Math.min(i, into), 0, merged);
  }
  return runs.map((r, j) => ({
    letter: r.letter,
    pts: pts.slice(r.from, (j < runs.length - 1 ? runs[j + 1].from : r.to) + 1),
  }));
}

// Soften the pixel staircase so the road and the crayon run smoothly.
function smooth(pts: Pt[], reach = 2): Pt[] {
  if (pts.length < 2 * reach + 2) return pts;
  return pts.map((p, i) => {
    if (i < reach || i >= pts.length - reach) return p;
    let x = 0;
    let y = 0;
    for (let j = i - reach; j <= i + reach; j++) {
      x += pts[j].x;
      y += pts[j].y;
    }
    return { x: x / (2 * reach + 1), y: y / (2 * reach + 1) };
  });
}

// Draw `text` with the word's layout at working scale, as a 0/1 ink mask.
function rasterise(
  trace: TraceWord,
  text: string,
  w: number,
  h: number,
  k: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(k, k);
  drawTraceWord(ctx, { ...trace, word: text }, "#000");
  const rgba = ctx.getImageData(0, 0, w, h).data;
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < ink.length; i++) ink[i] = rgba[i * 4 + 3] >= 128 ? 1 : 0;
  return ink;
}

// Grow a mask by one pixel in every direction.
function dilate(ink: Uint8Array, w: number, h: number) {
  const out = ink.slice();
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i]) continue;
    const x = i % w;
    const y = (i - x) / w;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) out[ny * w + nx] = 1;
      }
    }
  }
  return out;
}

/**
 * One layer of ink, analysed: thinned, split into pieces, and each piece's
 * centre line turned into graph edges ready for walkPiece. Every piece
 * carries its area, extent and centre (CSS pixels), and the node list its
 * edges refer to.
 */
function analyseInk(
  ink: Uint8Array,
  w: number,
  h: number,
  k: number,
): Piece[] {
  const box = { x0: w, y0: h, x1: -1, y1: -1 };
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i]) continue;
    const x = i % w;
    const y = (i - x) / w;
    box.x0 = Math.min(box.x0, x);
    box.x1 = Math.max(box.x1, x);
    box.y0 = Math.min(box.y0, y);
    box.y1 = Math.max(box.y1, y);
  }
  if (box.x1 < 0) return [];
  // Thinning reads a one-pixel ring around each pixel; keep it in bounds.
  box.x0 = Math.max(1, box.x0);
  box.y0 = Math.max(1, box.y0);
  box.x1 = Math.min(w - 2, box.x1);
  box.y1 = Math.min(h - 2, box.y1);

  const skel = thin(ink, w, box);
  const { labels, count } = labelParts(ink, w, h);

  // nodes, isDot, cx and cy are filled in once every pixel is counted.
  const pieces = Array.from(
    { length: count },
    (): Piece => ({
      area: 0,
      sx: 0,
      sy: 0,
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      edges: [],
      length: 0,
      nodes: [],
      isDot: false,
      isMark: false,
      cx: 0,
      cy: 0,
    }),
  );
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i]) continue;
    const pc = pieces[labels[i]];
    const x = ((i % w) + 0.5) / k;
    const y = (Math.floor(i / w) + 0.5) / k;
    pc.area++;
    pc.sx += x;
    pc.sy += y;
    pc.minX = Math.min(pc.minX, x);
    pc.maxX = Math.max(pc.maxX, x);
    pc.minY = Math.min(pc.minY, y);
    pc.maxY = Math.max(pc.maxY, y);
  }

  const toCss = (i: number): Pt => {
    const x = i % w;
    return { x: (x + 0.5) / k, y: ((i - x) / w + 0.5) / k };
  };
  const graph = skeletonGraph(skel, w, h);
  const nodes = graph.nodes.map((n) => {
    const ps = n.pixels.map(toCss);
    return {
      x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
      y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
    };
  });
  for (const e of tidyGraph(graph.nodes, graph.edges, WORK_STROKE * 0.75)) {
    const pc = pieces[labels[e.pix[0]]];
    pc.edges.push({ ...e, pts: e.pix.map(toCss) });
    pc.length += e.pix.length;
  }
  pieces.forEach((pc) => {
    pc.nodes = nodes;
    pc.isDot = pc.length < DOT_POINTS;
    pc.cx = pc.sx / pc.area;
    pc.cy = pc.sy / pc.area;
  });
  return pieces;
}

// Road half-width = ink area / centre-line length / 2, from the strokes
// only: a dot is all area and no length, and would inflate it. Area and
// length are in working pixels; the result is in CSS pixels.
function halfWidthOf(pieces: Piece[], k: number): number | null {
  let area = 0;
  let length = 0;
  for (const pc of pieces) {
    if (pc.isDot) continue;
    area += pc.area;
    length += pc.length;
  }
  return length ? area / length / 2 / k : null;
}

/**
 * Lay `word` out in W×H (CSS pixels) and derive its strokes: a StrokeSet,
 * plus `trace` for drawing the word itself. strokeChar is each stroke's
 * letter, so numbering and crayon colour restart per letter. Returns null
 * if the font draws nothing.
 *
 * Harakat are separated from the letters before anything is traced: the
 * word is drawn with and without them, and whatever only the first drawing
 * inks is the harakat. That way a kasra brushing its letter, or a shadda
 * touching an alif, can never be mistaken for part of the letter's shape.
 * Each is traced last in its letter — the letter and its dots first, then
 * the vowel — on a road sized to the marks themselves rather than to the
 * letters.
 */
export function buildArabicStrokes({
  word,
  family,
  weight,
  W,
  H,
}: {
  word: string;
  family: string;
  weight: number;
  W: number;
  H: number;
}): ArabicStrokes | null {
  if (!word || W < 20 || H < 20) return null;
  const measure = document.createElement("canvas").getContext("2d")!;
  const layout = layoutWord(measure, word, family, weight, W, H);
  const trace: TraceWord = { word, family, weight, layout };
  const size = layout.size;

  // Render at a scale where a stroke is ~WORK_STROKE pixels wide.
  const k = Math.min(1, WORK_STROKE / (size * STROKE_EM));
  const w = Math.max(3, Math.ceil(W * k));
  const h = Math.max(3, Math.ceil(H * k));

  const bare = stripHarakat(word);
  const full = rasterise(trace, word, w, h, k);
  const letterInk = bare === word ? full : rasterise(trace, bare, w, h, k);
  const pieces = analyseInk(letterInk, w, h, k);
  if (!pieces.length) return null;

  let harakat: Piece[] = [];
  if (bare !== word) {
    // Grown by a pixel first, so the letters' anti-aliased edge doesn't
    // leave a hairline of "extra" ink around every letter.
    const grown = dilate(letterInk, w, h);
    const markInk = full.map((v, i) => (v && !grown[i] ? 1 : 0));
    // Crumbs where a mark was clipped by a letter it overlaps.
    const crumb = (WORK_STROKE * 0.35) ** 2;
    harakat = analyseInk(markInk, w, h, k).filter((pc) => pc.area >= crumb);
  }

  const halfWidth = halfWidthOf(pieces, k) ?? size * STROKE_EM * 0.5;
  const ROAD = Math.max(8, halfWidth * 2);
  // Harakat are drawn thinner than letters; so is their road, or it would
  // swallow them. Never so thin a finger can't stay on it.
  const markRoad = Math.min(
    ROAD,
    Math.max(12, (halfWidthOf(harakat, k) ?? halfWidth * 0.6) * 2),
  );

  pieces.forEach((pc) => {
    pc.isMark =
      pc.isDot ||
      (pc.maxX - pc.minX < size * MARK_EM &&
        pc.maxY - pc.minY < size * MARK_EM);
  });
  // A word of nothing but marks (a lone ء) still needs something to trace.
  let bodies = pieces.filter((pc) => !pc.isMark);
  if (!bodies.length) {
    pieces.forEach((pc) => (pc.isMark = pc.isDot));
    bodies = pieces.filter((pc) => !pc.isMark);
  }
  if (!bodies.length) {
    pieces.forEach((pc) => (pc.isMark = false));
    bodies = pieces.slice();
  }
  bodies.sort((a, b) => b.maxX - a.maxX);

  // Which letter an x position falls in: the one whose span holds it, or
  // failing that the nearest.
  const letterIndexAt = (x: number) => {
    let best = 0;
    let bestGap = Infinity;
    layout.letters.forEach(([l, r], i) => {
      const gap = x < l ? l - x : x > r ? x - r : 0;
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    });
    return best;
  };

  const U = (layout.band.bottom - layout.band.top) / 3;
  // Every stroke, tagged with its letter and its place within that letter:
  // the letter's own line first (kind 0), then its dots and hamza (1),
  // then its harakat (2). Sorting on that turns a word into one letter
  // after another, each finished before the next begins.
  const items: { letter: number; kind: number; seq: number; stroke: Stroke }[] =
    [];
  const push = (letter: number, kind: number, stroke: Stroke) =>
    items.push({ letter, kind, seq: items.length, stroke });
  const line = (pts: Pt[], road: number): Stroke => ({
    pts,
    len: (pts.length - 1) * SP,
    dot: null,
    road,
  });

  bodies.forEach((body) => {
    const first = layout.letters[letterIndexAt(body.maxX - halfWidth)];
    for (const raw of walkPiece(body.edges, body.nodes, first)) {
      const runs = splitByLetter(smooth(raw), letterIndexAt, size * LETTER_RUN_EM);
      for (const run of runs) {
        const pts = resample(densify(run.pts, SP), SP);
        if (pts.length >= 2) push(run.letter, 0, line(pts, ROAD));
      }
    }
  });

  const addMark = (pc: Piece, kind: number, road: number) => {
    const letter = letterIndexAt(pc.cx);
    if (pc.isDot) {
      push(letter, kind, {
        dot: { x: pc.cx, y: pc.cy },
        len: U * 0.5,
        pts: null,
        road,
      });
      return;
    }
    // A mark is its own first letter: start at its own top right.
    for (const raw of walkPiece(pc.edges, pc.nodes, [pc.minX, pc.maxX])) {
      const pts = resample(densify(smooth(raw), SP), SP);
      if (pts.length >= 2) push(letter, kind, line(pts, road));
    }
  };
  // Right to left, then top to bottom.
  const rightToLeft = (p: Piece, q: Piece) => q.cx - p.cx || p.cy - q.cy;
  pieces
    .filter((pc) => pc.isMark)
    .sort(rightToLeft)
    .forEach((pc) => addMark(pc, 1, ROAD));
  harakat
    .slice()
    .sort(rightToLeft)
    .forEach((pc) => addMark(pc, 2, markRoad));

  items.sort((p, q) => p.letter - q.letter || p.kind - q.kind || p.seq - q.seq);
  const strokes = items.map((it) => it.stroke);
  // Numbering and crayon colour restart per letter.
  const strokeChar = items.map((it) => it.letter);

  if (!strokes.length) return null;
  const totalLen = strokes.reduce((s, st) => s + st.len, 0) || 1;
  return {
    strokes,
    strokeChar,
    totalLen,
    U,
    ROAD,
    R: Math.max(19, ROAD * 1.3),
    trace,
  };
}

"use client";

/**
 * The trace surface: numbered start badges, an arrow showing which way the
 * next stroke runs, a road to stay on, and a crayon that only advances
 * while the child follows the stroke from its start to its end, one stroke
 * after another.
 *
 * It knows nothing about letters. `build(W, H)` hands it the strokes laid
 * out for a W×H canvas — Arabic from the trace font via fontTrace.ts — and
 * `drawPaper` draws the ruled lines underneath. The engine is Joyo's,
 * lifted out of its English player, with two changes: leaving the line pauses a stroke rather than
 * wiping it — the child carries on from where the crayon stopped — and a
 * press in the wrong place makes the right place blink, instead of drawing
 * a dashed line to it.
 *
 * Renders the inside of the paper card: the canvas area and the footer
 * with "Start over". The player owns the card and the finish screen.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  SP,
  dist,
  type Pt,
  type Stroke,
  type StrokeSet,
} from "@/lib/trace/strokePaths";
import TraceProgressRing from "./TraceProgressRing";
import { CRAYON_COLORS, GUIDE_COLORS } from "@/lib/trace/traceTheme";

// How many resampled points ahead of the crayon the engine looks for the
// child's finger.
const LOOK = 7;

// How long the place to press blinks after a press in the wrong place, and
// how long one blink takes.
const BLINK_MS = 1600;
const BLINK_PERIOD = 550;

// The tracing state: the strokes for the current canvas size, which stroke
// (si) and point along it (pi) the crayon has reached, and where the finger
// last was.
type Engine<B extends StrokeSet> = StrokeSet & {
  size: { W: number; H: number };
  built: B | null;
  si: number;
  pi: number;
  active: boolean;
  lastPt: Pt | null;
  done: boolean;
};

// A stroke's number within its letter (or joined group of letters). The
// numbering restarts per group: a child following "1, 2, 3" for one letter
// would find "9, 10, 11" for the last letter of "cat" confusing.
function localNumber(eng: StrokeSet, k: number) {
  const group = eng.strokeChar[k] ?? 0;
  let n = 1;
  for (let j = 0; j < k; j++) if (eng.strokeChar[j] === group) n++;
  return n;
}

const colorFor = (eng: StrokeSet, k: number) =>
  CRAYON_COLORS[(eng.strokeChar[k] ?? 0) % CRAYON_COLORS.length];

// Where a stroke's numbered badge sits, and how big it is. The badge is
// sized to the stroke's own road, so a small mark (an Arabic haraka) gets a
// small badge; and a mark's badge is set back from its start, just off
// the mark, so the child can still see the shape they're about to trace.
// Letter strokes keep their badge on the start itself, as in Joyo.
function badgeFor(eng: StrokeSet, st: Stroke) {
  const road = st.road ?? eng.ROAD;
  const r = Math.min(Math.max(11, eng.U * 0.19), Math.max(9, road * 0.7));
  const start = st.dot ? st.dot : st.pts[0];
  if (!st.pts || road >= eng.ROAD) return { x: start.x, y: start.y, r };
  const next = st.pts[Math.min(st.pts.length - 1, 3)];
  const back = Math.hypot(start.x - next.x, start.y - next.y) || 1;
  return {
    x: start.x + ((start.x - next.x) / back) * r * 1.15,
    y: start.y + ((start.y - next.y) / back) * r * 1.15,
    r,
  };
}

// Draws one stroke's numbered start-dot, plus — for the stroke that is next
// up — the little arrow showing which way the crayon should travel.
function drawBadge(
  ctx: CanvasRenderingContext2D,
  eng: StrokeSet,
  k: number,
  isNow: boolean,
  scale = 1,
) {
  const st = eng.strokes[k];
  const start = st.dot ? st.dot : st.pts[0];
  const badge = badgeFor(eng, st);
  const p = { x: badge.x, y: badge.y };
  const rr = badge.r * scale;
  const col = colorFor(eng, k);

  if (isNow && st.pts) {
    const pts = st.pts;
    const aheadIdx = Math.min(pts.length - 1, Math.round((eng.U * 0.55) / SP));
    const ahead = pts[aheadIdx];
    if (ahead) {
      // Point the way the line itself runs there, not straight from the
      // start — on a tooth or a curl the two can differ a lot.
      const back = pts[Math.max(0, aheadIdx - 3)];
      const on = pts[Math.min(pts.length - 1, aheadIdx + 3)];
      const ang =
        on === back
          ? Math.atan2(ahead.y - start.y, ahead.x - start.x)
          : Math.atan2(on.y - back.y, on.x - back.x);
      ctx.save();
      ctx.translate(ahead.x, ahead.y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(rr * 0.55, 0);
      ctx.lineTo(-rr * 0.35, rr * 0.42);
      ctx.lineTo(-rr * 0.35, -rr * 0.42);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
  ctx.beginPath();
  ctx.arc(p.x, p.y, rr, 0, 6.2832);
  ctx.fillStyle = isNow ? col : GUIDE_COLORS.roadLine;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${Math.round(
    rr * 1.15,
  )}px "Nunito Sans", system-ui, sans-serif`;
  ctx.globalAlpha = isNow ? 1 : 0.75;
  ctx.fillText(String(localNumber(eng, k)), p.x, p.y + rr * 0.06);
  ctx.globalAlpha = 1;
}

// An expanding, fading ring around the place to press — one blink's worth
// at phase t (0 → 1).
function drawBlinkRing(
  ctx: CanvasRenderingContext2D,
  p: Pt,
  r: number,
  color: string,
  t: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r * (1 + 0.9 * t), 0, 6.2832);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 1 - t;
  ctx.stroke();
  ctx.restore();
}

interface StrokeTraceSurfaceProps<B extends StrokeSet> {
  build: (W: number, H: number) => B | null;
  drawPaper: (g: CanvasRenderingContext2D, built: B, W: number, H: number) => void;
  ready?: boolean;
  celebrating?: boolean;
  onComplete?: () => void;
  onRestart?: () => void;
  ringSide?: 'left' | 'right';
}

export default function StrokeTraceSurface<B extends StrokeSet>({
  build,
  drawPaper,
  ready = true,
  celebrating = false,
  onComplete,
  onRestart,
  ringSide = "right",
}: StrokeTraceSurfaceProps<B>) {
  const boxRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const engineRef = useRef<Engine<B>>({
    size: { W: 0, H: 0 },
    built: null,
    strokes: [],
    strokeChar: [],
    totalLen: 1,
    R: 24,
    ROAD: 20,
    U: 40,
    si: 0,
    pi: 0,
    active: false,
    lastPt: null,
    done: false,
  });
  const blinkRef = useRef({ until: 0, raf: 0 });

  const [progress, setProgress] = useState(0);
  const [crayonColor, setCrayonColor] = useState(CRAYON_COLORS[0]);
  const [hint, setHint] = useState({ text: "", warn: false });

  useEffect(() => () => clearTimeout(hintTimerRef.current), []);

  const defaultHint = useCallback(() => {
    const eng = engineRef.current;
    if (eng.done) return "";
    const total = eng.strokes.length;
    const n = localNumber(eng, eng.si);
    if (total > 1)
      return `Stroke ${eng.si + 1} of ${total}: start on the ${n} and follow the line`;
    return "Start on the 1 and follow the line to the end";
  }, []);

  const setHintMsg = useCallback(
    (text: string, warn: boolean) => {
      setHint({ text, warn: !!warn });
      clearTimeout(hintTimerRef.current);
      if (warn) {
        hintTimerRef.current = setTimeout(() => {
          if (!engineRef.current.done) {
            setHint({ text: defaultHint(), warn: false });
          }
        }, 1900);
      }
    },
    [defaultHint],
  );

  // Draw guide (paper + numbered stroke roads) -----------------------------
  const drawGuide = useCallback(() => {
    const g = guideRef.current?.getContext("2d");
    if (!g) return;
    const eng = engineRef.current;
    const { W, H } = eng.size;
    g.clearRect(0, 0, W, H);
    g.save();
    if (eng.built) drawPaper?.(g, eng.built, W, H);
    g.restore();

    const { strokes, ROAD } = eng;
    g.setLineDash([]);
    g.lineCap = "round";
    g.lineJoin = "round";
    strokes.forEach((st) => {
      // A stroke may bring its own road width — Arabic harakat are much
      // thinner than the letters they sit on.
      const road = st.road ?? ROAD;
      if (st.dot) {
        g.beginPath();
        g.arc(st.dot.x, st.dot.y, road * 0.5, 0, 6.2832);
        g.fillStyle = GUIDE_COLORS.road;
        g.fill();
        return;
      }
      g.beginPath();
      g.moveTo(st.pts[0].x, st.pts[0].y);
      for (let i = 1; i < st.pts.length; i++)
        g.lineTo(st.pts[i].x, st.pts[i].y);
      g.strokeStyle = GUIDE_COLORS.road;
      g.lineWidth = road;
      g.stroke();
      g.strokeStyle = GUIDE_COLORS.roadLine;
      g.lineWidth = 1.8;
      g.setLineDash([5, 7]);
      g.stroke();
      g.setLineDash([]);
    });
  }, [drawPaper]);

  const repaint = useCallback(() => {
    const ctx = inkRef.current?.getContext("2d");
    if (!ctx) return;
    const eng = engineRef.current;
    const { W, H } = eng.size;
    ctx.clearRect(0, 0, W, H);

    for (let k = 0; k < eng.strokes.length; k++) {
      const st = eng.strokes[k];
      if (k > eng.si) break;
      const col = colorFor(eng, k);
      const road = st.road ?? eng.ROAD;
      if (st.dot) {
        if (k < eng.si) {
          ctx.beginPath();
          ctx.arc(st.dot.x, st.dot.y, road * 0.42, 0, 6.2832);
          ctx.fillStyle = col;
          ctx.fill();
        }
        continue;
      }
      const to = k < eng.si ? st.pts.length - 1 : eng.pi;
      if (to < 1) continue;
      ctx.beginPath();
      ctx.moveTo(st.pts[0].x, st.pts[0].y);
      for (let i = 1; i <= to; i++) ctx.lineTo(st.pts[i].x, st.pts[i].y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.26;
      ctx.lineWidth = road * 0.98;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = road * 0.66;
      ctx.stroke();
    }

    const st = eng.strokes[eng.si];
    if (!eng.done && st) {
      const now = performance.now();
      const blinking = now < blinkRef.current.until;
      const t = (now % BLINK_PERIOD) / BLINK_PERIOD;
      const col = colorFor(eng, eng.si);
      // Part-way through a stroke, the place to carry on from is where
      // the crayon stopped; otherwise it is the numbered start.
      const resumeAt = st.pts && eng.pi > 0 ? st.pts[eng.pi] : null;
      if (resumeAt) {
        const r = (st.road ?? eng.ROAD) * 0.45;
        ctx.beginPath();
        ctx.arc(resumeAt.x, resumeAt.y, r, 0, 6.2832);
        ctx.fillStyle = col;
        ctx.fill();
        if (blinking) drawBlinkRing(ctx, resumeAt, r * 1.4, col, t);
        drawBadge(ctx, eng, eng.si, true);
      } else {
        const badge = badgeFor(eng, st);
        if (blinking) drawBlinkRing(ctx, badge, badge.r * 1.15, col, t);
        drawBadge(
          ctx,
          eng,
          eng.si,
          true,
          blinking ? 1 + 0.18 * Math.sin(t * 2 * Math.PI) : 1,
        );
      }
    }
  }, []);

  // Make the place to press blink for a moment, repainting every frame
  // until it stops.
  const blink = useCallback(() => {
    const b = blinkRef.current;
    b.until = performance.now() + BLINK_MS;
    if (b.raf) return;
    const tick = () => {
      repaint();
      if (performance.now() < b.until) {
        b.raf = requestAnimationFrame(tick);
      } else {
        b.raf = 0;
        repaint();
      }
    };
    b.raf = requestAnimationFrame(tick);
  }, [repaint]);
  useEffect(() => () => cancelAnimationFrame(blinkRef.current.raf), []);

  const paintProgress = useCallback(() => {
    const eng = engineRef.current;
    if (eng.done) {
      setProgress(1);
      return;
    }
    let d = 0;
    for (let k = 0; k < eng.si; k++) d += eng.strokes[k].len;
    if (eng.strokes[eng.si] && eng.strokes[eng.si].pts) d += eng.pi * SP;
    setProgress(Math.min(1, d / eng.totalLen));
    // Track the crayon colour for the ring so it matches the current letter.
    setCrayonColor(colorFor(eng, eng.si));
  }, []);

  const setup = useCallback(() => {
    const box = boxRef.current;
    if (!box || !ready) return;
    const rect = box.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return;
    const W = Math.round(rect.width);
    const H = Math.round(rect.height);
    const DPR = Math.min(window.devicePixelRatio || 1, 2.5);

    const built = build(W, H);
    if (!built || !built.strokes.length) return;

    [guideRef.current, inkRef.current].forEach((c) => {
      if (!c) return;
      c.width = Math.round(W * DPR);
      c.height = Math.round(H * DPR);
      c.getContext("2d")?.setTransform(DPR, 0, 0, DPR, 0, 0);
    });

    setCrayonColor(CRAYON_COLORS[0]);
    engineRef.current = {
      ...engineRef.current,
      size: { W, H },
      built,
      strokes: built.strokes,
      strokeChar: built.strokeChar,
      totalLen: built.totalLen,
      R: built.R,
      ROAD: built.ROAD,
      U: built.U,
      si: 0,
      pi: 0,
      active: false,
      lastPt: null,
      done: false,
    };

    drawGuide();
    repaint();
    paintProgress();
    setHint({ text: defaultHint(), warn: false });
  }, [ready, build, drawGuide, repaint, paintProgress, defaultHint]);

  useEffect(() => {
    if (!ready) return;
    const raf = requestAnimationFrame(setup);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && boxRef.current) {
      ro = new ResizeObserver(() => setup());
      ro.observe(boxRef.current);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [ready, setup]);

  // Tracing math -------------------------------------------------------------
  const endSlack = () => {
    const eng = engineRef.current;
    return Math.max(2, Math.round((eng.R * 0.5) / SP));
  };

  const winWord = useCallback(() => {
    const eng = engineRef.current;
    eng.done = true;
    eng.active = false;
    drawGuide();
    repaint();
    paintProgress();
    setHint({ text: "", warn: false });
    onComplete?.();
  }, [drawGuide, repaint, paintProgress, onComplete]);

  const finishStroke = useCallback(() => {
    const eng = engineRef.current;
    eng.si += 1;
    eng.pi = 0;
    eng.active = false;
    if (eng.si >= eng.strokes.length) {
      winWord();
      return true;
    }
    drawGuide();
    repaint();
    paintProgress();
    setHintMsg(`Good! Now start on the ${localNumber(eng, eng.si)}`, false);
    return true;
  }, [drawGuide, repaint, paintProgress, setHintMsg, winWord]);

  const step = useCallback(
    (p: Pt) => {
      const eng = engineRef.current;
      const st = eng.strokes[eng.si];
      if (!st || !st.pts) return false;
      const pts = st.pts;
      const n = pts.length;
      let best = -1;
      let bestD = 1e9;
      const top = Math.min(n - 1, eng.pi + LOOK);
      for (let j = eng.pi; j <= top; j++) {
        const d = dist(p, pts[j]);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0 && bestD <= eng.R) {
        eng.pi = Math.max(eng.pi, best);
        if (eng.pi >= n - 1 - endSlack()) {
          eng.pi = n - 1;
          return finishStroke();
        }
      } else if (bestD > eng.R * 1.8) {
        // Off the line: the crayon stops where it is, and the child picks
        // up from there — what's already traced stays traced.
        eng.active = false;
        blink();
        setHintMsg(
          eng.pi > 0
            ? "Oops! Carry on from where the crayon stopped"
            : `Start on the ${localNumber(eng, eng.si)} and stay on the line`,
          true,
        );
        return true;
      }
      return false;
    },
    [finishStroke, setHintMsg, blink],
  );

  // The handlers sit on the ink canvas, so currentTarget is that canvas.
  const posFromEvent = (e: PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const eng = engineRef.current;
    if (eng.done) return;
    inkRef.current?.setPointerCapture?.(e.pointerId);
    const p = posFromEvent(e);
    const st = eng.strokes[eng.si];
    if (!st) return;
    // Always carry on from where the crayon is: pressing back on a
    // stroke's start part-way through doesn't wipe it ("Start over" does).
    const anchor = st.dot ? st.dot : st.pts[eng.pi];
    if (dist(p, anchor) > eng.R * 1.7) {
      blink();
      setHintMsg(
        eng.pi > 0
          ? "Carry on from where the crayon stopped"
          : `Start on the ${localNumber(eng, eng.si)}`,
        true,
      );
      return;
    }
    if (st.dot) {
      finishStroke();
      repaint();
      paintProgress();
      return;
    }
    eng.active = true;
    eng.lastPt = p;
    blinkRef.current.until = 0;
    step(p);
    repaint();
    paintProgress();
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const eng = engineRef.current;
    const last = eng.lastPt;
    if (!eng.active || eng.done || !last) return;
    const p = posFromEvent(e);
    const d = dist(last, p);
    if (d < 1.2) return;
    const n = Math.max(1, Math.ceil(d / 4));
    let stop = false;
    for (let i = 1; i <= n && !stop; i++) {
      stop = step({
        x: last.x + ((p.x - last.x) * i) / n,
        y: last.y + ((p.y - last.y) * i) / n,
      });
    }
    eng.lastPt = p;
    repaint();
    paintProgress();
  };

  const handlePointerUp = () => {
    const eng = engineRef.current;
    if (!eng.active) return;
    eng.active = false;
    repaint();
    const st = eng.strokes[eng.si];
    if (!eng.done && st?.pts && eng.pi > 0 && eng.pi < st.pts.length - 1) {
      setHintMsg("Keep going from where the crayon stopped", false);
    }
  };

  const handleRestart = () => {
    onRestart?.();
    setup();
  };

  return (
    <>
      <div
        ref={boxRef}
        className={`relative w-full flex-1 min-h-0 ${
          celebrating ? "writing-game-pulse" : ""
        }`}
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={guideRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />
        <canvas
          ref={inkRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full block"
          style={{ cursor: celebrating ? "default" : "crosshair" }}
          aria-label="Tracing area. Follow the numbered strokes."
        />
        <TraceProgressRing
          progress={progress}
          color={crayonColor}
          side={ringSide}
        />
        {!!hint.text && (
          <div
            className={`absolute left-0 right-0 bottom-0 py-2 px-4 text-sm font-bold text-center pointer-events-none bg-gradient-to-t from-[#FDFBF4] to-transparent ${
              hint.warn ? "text-[#E24A3C]" : "text-slate-500"
            }`}
          >
            {hint.text}
          </div>
        )}
      </div>
      <div className="flex gap-2 p-3 border-t-2 border-dashed border-[#E7E1D2]">
        <button
          onClick={handleRestart}
          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 bg-white text-slate-700 font-bold text-sm hover:border-blue-400 transition-colors"
        >
          Start over
        </button>
      </div>
    </>
  );
}

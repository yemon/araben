"use client";

/**
 * Arabic trace surface: strokes come from the trace font (fontTrace.ts),
 * laid on ruled paper whose margin runs down the right, the side Arabic
 * is written from.
 */

import { useCallback, useEffect, useState } from "react";
import { arabicTraceFont, ARABIC_TRACE_WEIGHT } from "@/lib/fonts";
import {
  buildArabicStrokes,
  drawTraceWord,
  type ArabicStrokes,
} from "@/lib/trace/fontTrace";
import StrokeTraceSurface from "./StrokeTraceSurface";
import { GUIDE_COLORS } from "@/lib/trace/traceTheme";

const FAMILY = arabicTraceFont.style.fontFamily;

function drawArabicPaper(
  g: CanvasRenderingContext2D,
  built: ArabicStrokes,
  W: number,
  H: number,
) {
  const { rules } = built.trace.layout;
  const line = (y: number, width: number, style: string, dash: number[] = []) => {
    g.setLineDash(dash);
    g.lineWidth = width;
    g.strokeStyle = style;
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  };
  line(rules.top, 1.5, GUIDE_COLORS.rule);
  line(rules.bottom, 1.5, GUIDE_COLORS.rule);
  line(rules.body, 1.6, GUIDE_COLORS.rule, [7, 9]);
  line(rules.base, 2.2, GUIDE_COLORS.ruleStrong);
  g.setLineDash([]);
  g.lineWidth = 1.6;
  g.strokeStyle = GUIDE_COLORS.margin;
  g.beginPath();
  g.moveTo(W - 30, 0);
  g.lineTo(W - 30, H);
  g.stroke();
  // The letters' true shape under the stroke roads, so tapered ends and
  // round dots look like the font rather than like tubes.
  drawTraceWord(g, built.trace, GUIDE_COLORS.road);
}

interface ArabicTraceSurfaceProps {
  word: string;
  celebrating?: boolean;
  onComplete?: () => void;
  onRestart?: () => void;
}

export default function ArabicTraceSurface({
  word,
  ...surfaceProps
}: ArabicTraceSurfaceProps) {
  // The canvas can't use the font until the browser has fetched it, and
  // building too early would trace the fallback font's letter shapes. A
  // failed load (offline) still proceeds — the fallback is traceable.
  const [fontReadyFor, setFontReadyFor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    document.fonts
      .load(`${ARABIC_TRACE_WEIGHT} 100px ${FAMILY}`, word)
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFontReadyFor(word);
      });
    return () => {
      cancelled = true;
    };
  }, [word]);

  const build = useCallback(
    (W: number, H: number) =>
      buildArabicStrokes({
        word,
        family: FAMILY,
        weight: ARABIC_TRACE_WEIGHT,
        W,
        H,
      }),
    [word],
  );

  return (
    <StrokeTraceSurface
      {...surfaceProps}
      ready={fontReadyFor === word}
      build={build}
      drawPaper={drawArabicPaper}
      ringSide="left"
    />
  );
}

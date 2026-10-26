// Self-hosted Google Fonts via next/font — no runtime requests to gstatic.
// Each font exposes a CSS variable that our global stylesheet consumes.

import {
  Amiri,
  Anek_Bangla,
  Baloo_Bhaijaan_2,
  Inter,
  Playfair_Display,
  Source_Serif_4,
} from 'next/font/google';

export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic-next',
  display: 'swap',
  preload: true,
});

export const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-bangla-next',
  display: 'swap',
  preload: true,
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-latin-next',
  display: 'swap',
  preload: true,
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-next',
  display: 'swap',
  preload: true,
});

export const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-read-next',
  display: 'swap',
  preload: true,
});

/**
 * The Arabic trace font — Baloo Bhaijaan 2. Rounded, nearly even stroke
 * width (so the road a child colours along is the same width all the way
 * round), and built on the Naskh letter shapes children are taught to
 * write. Variable, so every weight comes from one file.
 * 
 * `arabicTraceFont.className` styles Arabic text in the UI;
 * `arabicTraceFont.style.fontFamily` is what the trace canvas draws with.
 */
export const arabicTraceFont = Baloo_Bhaijaan_2({
  subsets: ['arabic'],
  display: 'swap',
});

// The weight the trace canvas draws at. fontTrace.ts's STROKE_EM is
// measured at this weight — change them together.
export const ARABIC_TRACE_WEIGHT = 600;

export const fontVariables = [
  amiri.variable,
  anekBangla.variable,
  inter.variable,
  playfair.variable,
  sourceSerif.variable,
].join(' ');

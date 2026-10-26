/**
 * Colours for the trace game
 * Shared visual theme for paper, crayons, and guidelines
 */

// One crayon colour per character slot. In a word, adjacent letters use
// different colours so the trace reads as N segments even before the child
// has drawn on it.
export const CRAYON_COLORS = [
  "#E24A3C",
  "#F0821E",
  "#EFC02A",
  "#3F9C55",
  "#2A7FC4",
  "#8A5CC0",
];

export const GUIDE_COLORS = {
  paper: "#FDFBF4",
  paperEdge: "#E7E1D2",
  rule: "#A9C8DC",
  ruleStrong: "#6FA0C0",
  margin: "#DE8C86",
  road: "#DDE4E7",
  roadLine: "#B4C3CB",
  inkSoft: "#65747F",
};

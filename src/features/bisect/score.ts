/**
 * Keeping score over a run: the order the shapes come in, and what the cuts
 * that counted add up to.
 */

import { SITE_URL } from "@/config/site";

import type { Cut, Verdict } from "./board";

export interface Summary {
  /** How many shapes have had their first cut. */
  played: number;
  /** Cuts of 48:52 or better, perfect ones included. */
  wins: number;
  perfect: number;
  /** The average miss in tenths of a percent, or null before the first cut. */
  averageOffBy: number | null;
  /** The closest cut's miss in tenths of a percent, or null before the first. */
  bestOffBy: number | null;
}

/** A copy of the list in a random order, by Fisher and Yates. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function summarize(scores: readonly Cut[]): Summary {
  const misses = scores.map((cut) => cut.offBy);
  return {
    played: scores.length,
    wins: scores.filter((cut) => cut.verdict !== "miss").length,
    perfect: scores.filter((cut) => cut.verdict === "perfect").length,
    averageOffBy: misses.length
      ? Math.round(misses.reduce((sum, offBy) => sum + offBy, 0) / misses.length)
      : null,
    bestOffBy: misses.length ? Math.min(...misses) : null,
  };
}

const TILES: Record<Verdict, string> = { perfect: "🟩", win: "🟨", miss: "⬛" };

/**
 * The run as a few lines to paste somewhere: the score, one tile per shape in
 * the order they were cut, and where to play. Five tiles to a row.
 */
export function shareText(scores: readonly Cut[], total: number): string {
  const { wins } = summarize(scores);
  const tiles = scores.map((cut) => TILES[cut.verdict]);
  const rows = Array.from({ length: Math.ceil(tiles.length / 5) }, (_, i) =>
    tiles.slice(i * 5, i * 5 + 5).join(""),
  );
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return [`bisect ${wins}/${total}`, ...rows, host].join("\n");
}

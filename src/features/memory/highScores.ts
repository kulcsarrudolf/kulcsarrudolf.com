/**
 * The high score lists, one per skill, kept in localStorage. A cleared board
 * is scored by its time first and the pairs it took second, so of two players
 * who took as long, the one who remembered better ranks higher.
 */

import { SKILLS, type Skill } from "./engine";

export const SCORES_STORAGE_KEY = "kulcsarrudolf-memory-blocks-scores";

/** The name typed for the last high score, offered again for the next. */
export const NAME_STORAGE_KEY = "kulcsarrudolf-memory-blocks-name";

/** As many as the original's list showed. */
export const MAX_SCORES = 5;

export const MAX_NAME_LENGTH = 20;

export interface Score {
  name: string;
  seconds: number;
  pairs: number;
}

export type HighScores = Record<Skill, Score[]>;

export const emptyScores = (): HighScores => ({ beginner: [], intermediate: [], expert: [] });

const isScore = (value: unknown): value is Score => {
  if (!value || typeof value !== "object") return false;
  const { name, seconds, pairs } = value as Record<string, unknown>;
  return (
    typeof name === "string" &&
    Number.isInteger(seconds) &&
    (seconds as number) >= 0 &&
    Number.isInteger(pairs) &&
    (pairs as number) >= 0
  );
};

/** Faster first, then fewer pairs. */
const compare = (a: Score, b: Score) => a.seconds - b.seconds || a.pairs - b.pairs;

/** What was stored, with anything missing or malformed left out rather than trusted. */
export function parseScores(raw: string | null): HighScores {
  const scores = emptyScores();
  if (!raw) return scores;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return scores;
    for (const skill of SKILLS) {
      const list = (parsed as Record<string, unknown>)[skill];
      if (!Array.isArray(list)) continue;
      scores[skill] = list
        .filter(isScore)
        .map(({ name, seconds, pairs }) => ({
          name: name.slice(0, MAX_NAME_LENGTH),
          seconds,
          pairs,
        }))
        .sort(compare)
        .slice(0, MAX_SCORES);
    }
  } catch {
    // Unreadable storage is an empty list, not a broken game.
  }

  return scores;
}

/**
 * Where the score would stand on the list, counted from naught. A tie goes
 * after the score already there, which got there first.
 */
export function placeOf(list: readonly Score[], score: Omit<Score, "name">): number {
  const index = list.findIndex((each) => compare({ ...score, name: "" }, each) < 0);
  return index === -1 ? list.length : index;
}

/** Whether the score earns a place on the list: a tie with the last place does not push it off. */
export const qualifies = (list: readonly Score[], score: Omit<Score, "name">): boolean =>
  placeOf(list, score) < MAX_SCORES;

/** The list with the score in its place, cut back to the five best. */
export function insertScore(list: readonly Score[], score: Score): Score[] {
  const name = score.name.trim().slice(0, MAX_NAME_LENGTH);
  const at = placeOf(list, score);
  return [...list.slice(0, at), { ...score, name }, ...list.slice(at)].slice(0, MAX_SCORES);
}

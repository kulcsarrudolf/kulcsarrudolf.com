/**
 * The rules of Memory Blocks, as pure steps from one board to the next, so the
 * hook only has to hold the board and the clock.
 *
 * The blocks are dealt picture side down. Two are flipped at a time: a pair
 * that matches disappears, a pair that does not is turned back down. The
 * board is cleared when every block has gone. Turning a flipped pair back is
 * its own step, `settle`, so the two pictures stay up long enough to be seen
 * and remembered before they go.
 */

import { PICTURES } from "./pictures";

export type Skill = "beginner" | "intermediate" | "expert";

export const SKILLS: readonly Skill[] = ["beginner", "intermediate", "expert"];

/** How many pairs each skill deals: a 4×4, a 6×6 and a 10×6 board. */
export const PAIRS: Record<Skill, number> = { beginner: 8, intermediate: 18, expert: 30 };

export type BlockState = "down" | "up" | "gone";

export interface Block {
  /** Index into `PICTURES`. */
  picture: number;
  state: BlockState;
}

export interface Board {
  skill: Skill;
  blocks: Block[];
  /** The blocks face up and not yet settled, in the order they were flipped: none, one or two. */
  open: number[];
  /** Every second block flipped is a pair, matching or not: the score besides the time. */
  pairsFlipped: number;
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

/** A fresh board: as many pictures as the skill has pairs, each twice, shuffled face down. */
export function deal(skill: Skill, random: () => number = Math.random): Board {
  const chosen = shuffle(
    PICTURES.map((_, index) => index),
    random,
  ).slice(0, PAIRS[skill]);
  const blocks = shuffle([...chosen, ...chosen], random).map((picture): Block => ({
    picture,
    state: "down",
  }));
  return { skill, blocks, open: [], pairsFlipped: 0 };
}

/** Whether the two open blocks show the same picture. */
export function isMatch(board: Board): boolean {
  const [first, second] = board.open;
  return second !== undefined && board.blocks[first].picture === board.blocks[second].picture;
}

/** A flipped pair put away: gone if it matched, face down again if it did not. */
export function settle(board: Board): Board {
  if (board.open.length < 2) return board;

  const state: BlockState = isMatch(board) ? "gone" : "down";
  const blocks = board.blocks.map((block, index) =>
    board.open.includes(index) ? { ...block, state } : block,
  );
  return { ...board, blocks, open: [] };
}

/**
 * Turns a block picture side up. A pair still showing from the last turn is
 * settled first, so a quick player never has to wait for it. A block that is
 * already up or gone stays as it is.
 */
export function flip(board: Board, index: number): Board {
  const settled = board.open.length === 2 ? settle(board) : board;
  const block = settled.blocks[index];
  if (!block || block.state !== "down") return settled;

  const blocks = settled.blocks.map((each, i) =>
    i === index ? { ...each, state: "up" as const } : each,
  );
  const open = [...settled.open, index];
  const pairsFlipped = settled.pairsFlipped + (open.length === 2 ? 1 : 0);
  return { ...settled, blocks, open, pairsFlipped };
}

/** Whether every block has been matched away. */
export const isCleared = (board: Board): boolean =>
  board.blocks.every((block) => block.state === "gone");

/**
 * How a player with a perfect memory clears a board: the turns it takes, in
 * order, for the animation in the blog post on the game's maths.
 *
 * The player never forgets a picture it has seen, but it cannot see one it
 * has not flipped, so it still has to explore. Each turn it takes the first
 * of these that applies:
 *
 * 1. Both halves of a pair have been seen: flip them, a sure match.
 * 2. Otherwise flip the next unseen block. If its partner has been seen,
 *    flip that next, a sure match.
 * 3. Otherwise flip another unseen block, never one already seen, since that
 *    could not match and would teach nothing. It may match by luck, it may
 *    turn out to be the partner of a block seen earlier, which makes the
 *    next turn a sure match, or it may just be one more picture to remember.
 *
 * Unseen blocks are explored in reading order, so the run is easy to follow.
 */

import { type Board, flip, settle } from "./engine";

/**
 * Why the turn went the way it did:
 * `pair` both halves were known before it, `known` the first block's partner
 * had been seen, `lucky` two new blocks matched, `reveal` the second block
 * was the partner of an earlier one, and `new` both pictures were new.
 */
export type TurnKind = "pair" | "known" | "lucky" | "reveal" | "new";

export interface Turn {
  first: number;
  second: number;
  kind: TurnKind;
}

/** Every turn of a perfect-memory run over the blocks' pictures, dealt as they lie. */
export function planPerfectRun(pictures: readonly number[]): Turn[] {
  const turns: Turn[] = [];
  // The blocks seen and not yet matched, by picture.
  const seen = new Map<number, number[]>();
  let next = 0;
  let cleared = 0;

  const see = (index: number) => {
    const picture = pictures[index];
    seen.set(picture, [...(seen.get(picture) ?? []), index]);
  };
  const take = (first: number, second: number, kind: TurnKind) => {
    seen.delete(pictures[first]);
    cleared += 2;
    turns.push({ first, second, kind });
  };

  while (cleared < pictures.length) {
    const known = [...seen.values()].find((indices) => indices.length === 2);
    if (known) {
      take(known[0], known[1], "pair");
      continue;
    }

    const first = next++;
    const partner = seen.get(pictures[first])?.[0];
    if (partner !== undefined) {
      take(first, partner, "known");
      continue;
    }

    const second = next++;
    if (pictures[second] === pictures[first]) {
      take(first, second, "lucky");
      continue;
    }

    const kind = seen.has(pictures[second]) ? "reveal" : "new";
    see(first);
    see(second);
    turns.push({ first, second, kind });
  }

  return turns;
}

/** Each turn plays out in three steps: the first block up, the second up, and the pair settled. */
export const STEPS_PER_TURN = 3;

/** The board after `step` steps of the run, played through the game's own rules. */
export function boardAt(start: Board, turns: readonly Turn[], step: number): Board {
  let board = start;
  for (let done = 0; done < step && done < turns.length * STEPS_PER_TURN; done++) {
    const turn = turns[Math.floor(done / STEPS_PER_TURN)];
    const phase = done % STEPS_PER_TURN;
    board =
      phase === 0
        ? flip(board, turn.first)
        : phase === 1
          ? flip(board, turn.second)
          : settle(board);
  }
  return board;
}

/** The blocks the player has seen by `step`: the ones it would point to with its eyes shut. */
export function seenAt(turns: readonly Turn[], step: number): Set<number> {
  const seen = new Set<number>();
  turns.forEach(({ first, second }, index) => {
    const start = index * STEPS_PER_TURN;
    if (step > start) seen.add(first);
    if (step > start + 1) seen.add(second);
  });
  return seen;
}

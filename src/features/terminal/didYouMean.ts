/**
 * The nearest word to a mistyped one, for the line under `command not found`.
 * Pure, and handed the words it may offer, so what is a secret stays with
 * whoever draws up the list.
 */

/**
 * How many edits lie between two words, where swapping two neighbouring
 * letters is one edit rather than two: `sl` is one slip away from `ls`, which
 * is how fingers get it wrong.
 */
export function editDistance(from: string, to: string): number {
  let beforePrevious: number[] = [];
  let previous = Array.from({ length: to.length + 1 }, (_, column) => column);

  for (let row = 1; row <= from.length; row++) {
    const current = [row];

    for (let column = 1; column <= to.length; column++) {
      const cost = from[row - 1] === to[column - 1] ? 0 : 1;
      let best = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + cost,
      );

      const swapped =
        row > 1 &&
        column > 1 &&
        from[row - 1] === to[column - 2] &&
        from[row - 2] === to[column - 1];
      if (swapped) best = Math.min(best, beforePrevious[column - 2] + 1);

      current.push(best);
    }

    beforePrevious = previous;
    previous = current;
  }

  return previous[to.length];
}

// A short word has little to be wrong about: one slip in `ls`, two in `bisect`.
const allowance = (word: string) => (word.length <= 4 ? 1 : 2);

/**
 * The word from `vocabulary` that `typed` most likely meant, or nothing when
 * none is close enough to be worth saying. The earlier word wins a tie, so the
 * list's order is its order of preference.
 */
export function closest(typed: string, vocabulary: readonly string[]): string | undefined {
  const word = typed.toLowerCase();
  let best: string | undefined;
  let bestDistance = Math.min(allowance(word), word.length - 1);

  for (const candidate of vocabulary) {
    const distance = editDistance(word, candidate.toLowerCase());
    if (distance === 0) return undefined;
    if (distance > bestDistance || (distance === bestDistance && best !== undefined)) continue;
    best = candidate;
    bestDistance = distance;
  }

  return best;
}

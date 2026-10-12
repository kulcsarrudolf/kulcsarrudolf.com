import { useCallback, useEffect, useRef, useState } from "react";

import {
  type Board,
  deal,
  flip as flipBlock,
  isCleared,
  isMatch,
  settle,
  type Skill,
} from "./engine";

/**
 * How long a pair stays up before it goes, counted from the second flip and
 * so including the 300ms the block takes to turn over: long enough to read a
 * miss, shorter for a match.
 */
const MATCH_MS = 800;
const MISS_MS = 1300;

/** The matched blocks take this long to shrink away, so the board is seen empty before it is scored. */
const VANISH_MS = 500;

/** The clock stops here, as the original's four-digit counter did. */
const MAX_SECONDS = 9999;

export interface Result {
  skill: Skill;
  seconds: number;
  pairs: number;
}

/**
 * One game of Memory Blocks: the board, and the clock that starts on the
 * first block flipped and stops on the last pair. A flipped pair settles on
 * its own after a moment, or at once when the next block is flipped.
 * `onCleared` hears the result once, the moment the board is empty.
 */
export function useMemoryGame(
  onCleared: (result: Result) => void,
  initialSkill: Skill = "intermediate",
) {
  const [board, setBoard] = useState<Board>(() => deal(initialSkill));
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  // Counts the deals, so a new one can be drawn fresh rather than animated
  // from the board before it.
  const [round, setRound] = useState(0);

  const onClearedRef = useRef(onCleared);
  useEffect(() => {
    onClearedRef.current = onCleared;
  }, [onCleared]);

  const newGame = useCallback((skill: Skill) => {
    setBoard(deal(skill));
    setStartedAt(null);
    setSeconds(0);
    setFinished(false);
    setRound((current) => current + 1);
  }, []);

  const flip = useCallback(
    (index: number) => {
      if (finished) return;
      setBoard((current) => flipBlock(current, index));
      setStartedAt((current) => current ?? Date.now());
    },
    [finished],
  );

  // Counted from the start time rather than by adding up ticks, so a tab
  // that was in the background, where timers slow down, still keeps time.
  useEffect(() => {
    if (startedAt === null || finished) return;
    const tick = () =>
      setSeconds(Math.min(MAX_SECONDS, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [startedAt, finished]);

  const pending = board.open.length === 2;
  const matched = pending && isMatch(board);
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setBoard(settle), matched ? MATCH_MS : MISS_MS);
    return () => clearTimeout(timer);
  }, [board, pending, matched]);

  useEffect(() => {
    if (finished || startedAt === null || !isCleared(board)) return;
    const final = Math.min(MAX_SECONDS, Math.floor((Date.now() - startedAt) / 1000));
    setSeconds(final);
    setFinished(true);
    const result = { skill: board.skill, seconds: final, pairs: board.pairsFlipped };
    // Not cleaned up on purpose: `finished` flipping is what reruns this, and the result still has to land.
    setTimeout(() => onClearedRef.current(result), VANISH_MS);
  }, [board, finished, startedAt]);

  return { board, round, seconds, finished, flip, newGame };
}

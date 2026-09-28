import { useCallback, useMemo, useState } from "react";

import { type Cut, cut as cutShape, place, type PlacedShape } from "./board";
import type { Line } from "./geometry";
import { shuffle, summarize } from "./score";
import { SHAPES } from "./shapes";

/**
 * A run through every shape, in an order shuffled for each run.
 *
 * Each shape is cut as often as the player likes, but only the first cut
 * counts, which is the Cutle rule: the rest is practice. `aim` is the line
 * being drawn, and `cut` the last one let go of; drawing a new line takes the
 * old cut away. Moving on from the last shape ends the run, and the summary
 * is what is left.
 */
export function useBisectGame() {
  const [order, setOrder] = useState(() => shuffle(SHAPES));
  const [index, setIndex] = useState(0);
  // The first cut of each shape, in the order they were played.
  const [scores, setScores] = useState<Cut[]>([]);
  const [aim, setAim] = useState<Line | null>(null);
  const [cut, setCut] = useState<Cut | null>(null);

  const finished = index >= order.length;
  const shape: PlacedShape | null = useMemo(
    () => (finished ? null : place(order[index])),
    [finished, order, index],
  );

  const aimAt = useCallback((line: Line | null) => {
    setAim(line);
    if (line) setCut(null);
  }, []);

  const release = useCallback(
    (line: Line) => {
      if (!shape) return;
      const result = cutShape(shape, line);
      setAim(null);
      setCut(result);
      setScores((previous) => (previous.length > index ? previous : [...previous, result]));
    },
    [index, shape],
  );

  const next = useCallback(() => {
    setAim(null);
    setCut(null);
    setIndex((previous) => previous + 1);
  }, []);

  const restart = useCallback(() => {
    setOrder(shuffle(SHAPES));
    setIndex(0);
    setScores([]);
    setAim(null);
    setCut(null);
  }, []);

  return {
    shape,
    /** Which shape this is, counting from 1, and how many there are. */
    round: Math.min(index + 1, order.length),
    total: order.length,
    aim,
    cut,
    /** The cut on screen is practice: the shape's first cut has been made. */
    practice: cut !== null && scores[index] !== cut,
    /** The shape's first cut is in, so the run can move on. */
    scored: scores.length > index,
    /** The first cut of each shape played so far. */
    scores,
    summary: summarize(scores),
    finished,
    aimAt,
    release,
    next,
    restart,
  };
}

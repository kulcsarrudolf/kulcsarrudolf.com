import { useCallback, useMemo, useState } from "react";

import { type Cut, cut as cutShape, place, type PlacedShape } from "./board";
import type { Line } from "./geometry";
import { shuffle, summarize } from "./score";
import { SHAPES } from "./shapes";
import type { AimSource } from "./useCutGesture";

/**
 * A run through every shape, in an order shuffled for each run.
 *
 * Each shape is cut as often as the player likes, but only the first cut
 * counts, which is the Cutle rule: the rest is practice. `aim` is the line
 * being drawn, `aimedBy` what it is drawn with, and `cut` the last one let go
 * of; drawing a new line takes the old cut away. Moving on from the last shape ends the run, and the summary
 * is what is left.
 *
 * The shapes do not have to be taken in the order they were dealt: `pick`
 * brings any of them up. One not played yet takes the next slot of the run;
 * one already played comes back with its counting cut on the board, to
 * practise on, and moving on from it returns to the first shape not played.
 */
export function useBisectGame() {
  const [order, setOrder] = useState(() => shuffle(SHAPES));
  const [index, setIndex] = useState(0);
  // The first cut of each shape, in the order they were played.
  const [scores, setScores] = useState<Cut[]>([]);
  const [aim, setAim] = useState<Line | null>(null);
  const [aimedBy, setAimedBy] = useState<AimSource>("pointer");
  const [cut, setCut] = useState<Cut | null>(null);

  const finished = index >= order.length;
  const shape: PlacedShape | null = useMemo(
    () => (finished ? null : place(order[index])),
    [finished, order, index],
  );

  const aimAt = useCallback((line: Line | null, by: AimSource) => {
    setAim(line);
    setAimedBy(by);
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

  // Every shape before `scores.length` in the order has had its first cut,
  // so that is where the run carries on from.
  const next = useCallback(() => {
    setAim(null);
    setCut(null);
    setIndex(scores.length);
  }, [scores.length]);

  /** Takes the cut off the board, to cut the same shape again. */
  const retry = useCallback(() => {
    setAim(null);
    setCut(null);
  }, []);

  const pick = useCallback(
    (id: string) => {
      const at = order.findIndex((shape) => shape.id === id);
      if (at < 0) return;
      setAim(null);
      if (at < scores.length) {
        setIndex(at);
        setCut(scores[at]);
        return;
      }
      // The next slot is this one while its shape is still uncut, and the
      // one after it otherwise.
      const slot = scores.length;
      if (at !== slot) {
        const reordered = order.filter((_, i) => i !== at);
        reordered.splice(slot, 0, order[at]);
        setOrder(reordered);
      }
      setIndex(slot);
      setCut(null);
    },
    [order, scores],
  );

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
    /** What the line is being drawn with, while there is one. */
    aiming: aim ? aimedBy : null,
    cut,
    /** The cut on screen is practice: the shape's first cut has been made. */
    practice: cut !== null && scores[index] !== cut,
    /** The shape's first cut is in, so the run can move on. */
    scored: scores.length > index,
    /** No shape is left uncut once this one is. */
    last: scores.length + (scores.length > index ? 0 : 1) >= order.length,
    /** The first cut of each shape played so far. */
    scores,
    /** Every shape, in the order they are drawn up, with how its first cut went. */
    lineup: SHAPES.map((definition) => {
      const at = order.findIndex((shape) => shape.id === definition.id);
      return {
        id: definition.id,
        verdict: scores[at]?.verdict ?? null,
        current: at === index,
      };
    }),
    summary: summarize(scores),
    finished,
    aimAt,
    release,
    next,
    retry,
    pick,
    restart,
  };
}

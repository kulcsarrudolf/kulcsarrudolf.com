import { type RefObject, useEffect, useMemo, useState } from "react";

import { type Board, deal } from "./engine";
import { boardAt, planPerfectRun, seenAt, STEPS_PER_TURN } from "./perfectPlay";

/**
 * How long each step stays on screen: the first block turning up, the pair
 * showing while the caption says why the turn went that way, and the pair
 * settling before the next turn starts.
 */
const STEP_MS = [700, 1500, 450];

/** The same sequence on every visit, as the stories use, so the post can describe the run it shows. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A perfect-memory run on a beginner board, played one step at a time. It
 * starts on its own the first time the board is half in view, unless the
 * reader has asked for less motion, and then waits for the play button.
 */
export function usePerfectRun(view: RefObject<HTMLElement | null>, seed?: number) {
  const [start, setStart] = useState<Board>(() =>
    deal("beginner", seed === undefined ? Math.random : seeded(seed)),
  );
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const turns = useMemo(() => planPerfectRun(start.blocks.map(({ picture }) => picture)), [start]);
  const last = turns.length * STEPS_PER_TURN;
  const finished = step >= last;

  useEffect(() => {
    const element = view.current;
    if (!element || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlaying(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [view]);

  useEffect(() => {
    if (!playing || finished) return;
    const timer = setTimeout(() => setStep((current) => current + 1), STEP_MS[step % 3]);
    return () => clearTimeout(timer);
  }, [playing, finished, step]);

  const board = useMemo(() => boardAt(start, turns, step), [start, turns, step]);
  const seen = useMemo(() => seenAt(turns, step), [turns, step]);

  // The turn the caption explains: the current one once both its blocks are up.
  const shown = Math.floor((step - 2) / STEPS_PER_TURN);
  const turn = step >= 2 ? turns[Math.min(shown, turns.length - 1)] : undefined;

  const toggle = () => {
    if (finished) setStep(0);
    setPlaying((current) => !current || finished);
  };

  const dealAgain = () => {
    setStart(deal("beginner"));
    setStep(0);
    setPlaying(true);
  };

  return { board, seen, turn, finished, playing, toggle, dealAgain };
}

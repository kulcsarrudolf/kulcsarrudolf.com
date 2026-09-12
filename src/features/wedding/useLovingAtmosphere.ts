import { useCallback, useEffect, useRef, useState } from "react";

/** How long the atmosphere lasts, start to finish. */
export const ATMOSPHERE_MS = 30_000;
/** The wash easing in. */
export const FADE_IN_MS = 800;
/** The tail it ends on, long enough that no heart pops out mid-flight. */
export const FADE_OUT_MS = 2_500;
/** Someone who asked for it to stop wants it gone, not eased away. */
export const DISMISS_MS = 400;

/** Escape belongs to whatever dialog is open, not to the hearts behind it. */
const isDialogOpen = () => document.querySelector('[role="dialog"][aria-modal="true"]') !== null;

/* The mobile menu and the dialogs close themselves on Escape from a listener on
   `document`, and React flushes that close before a bubbling listener on
   `window` ever runs, so by then the dialog has left the DOM and asking whether
   one is open answers no. Listening in the capture phase asks the question
   first, before anything else has had a chance to react to the key. */
const CAPTURE = true;

/**
 * The thirty seconds of the loving atmosphere: when it runs, when it starts
 * fading, and the two ways out of it.
 *
 * Running it again restarts the clock on the same layer rather than stacking a
 * second one, so the hearts already in flight keep flying. Escape ends it
 * early, unless a dialog is up, in which case the first Escape closes that and
 * the second one reaches here.
 */
export function useLovingAtmosphere() {
  const [running, setRunning] = useState(false);
  const [fading, setFading] = useState(false);
  const [fadeMs, setFadeMs] = useState(FADE_OUT_MS);

  const timers = useRef<number[]>([]);
  // Read by `stop`, so it can do nothing when nothing is running without
  // taking `running` as a dependency and changing identity on every phase.
  const runningRef = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const settle = useCallback((value: boolean) => {
    runningRef.current = value;
    setRunning(value);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setFadeMs(FADE_OUT_MS);
    setFading(false);
    settle(true);

    timers.current.push(
      window.setTimeout(() => setFading(true), ATMOSPHERE_MS - FADE_OUT_MS),
      window.setTimeout(() => settle(false), ATMOSPHERE_MS),
    );
  }, [clearTimers, settle]);

  const stop = useCallback(() => {
    if (!runningRef.current) return;

    clearTimers();
    setFadeMs(DISMISS_MS);
    setFading(true);
    timers.current.push(window.setTimeout(() => settle(false), DISMISS_MS));
  }, [clearTimers, settle]);

  useEffect(() => {
    if (!running) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isDialogOpen()) return;
      stop();
    };

    window.addEventListener("keydown", onKeyDown, CAPTURE);
    return () => window.removeEventListener("keydown", onKeyDown, CAPTURE);
  }, [running, stop]);

  useEffect(() => clearTimers, [clearTimers]);

  return { running, fading, fadeMs, start, stop };
}

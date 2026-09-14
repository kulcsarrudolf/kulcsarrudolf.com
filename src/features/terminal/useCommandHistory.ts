import { useCallback, useRef } from "react";

import {
  type HistoryDirection,
  pushHistory,
  readHistory,
  stepHistory,
  storeHistory,
} from "./commandHistory";

/**
 * The arrow keys at the prompt. Up recalls the previous line, down the next,
 * and down past the newest gives back whatever had been typed before the
 * first press. Nothing here renders, so it all lives in refs.
 *
 * The stored history is read when browsing starts and again when a line is
 * recorded, so two tabs add to one history rather than overwrite each other.
 */
export function useCommandHistory() {
  const historyRef = useRef<string[]>([]);
  // Null while the line being typed is the one showing.
  const cursorRef = useRef<number | null>(null);
  const draftRef = useRef("");

  const record = useCallback((line: string) => {
    cursorRef.current = null;
    const history = readHistory();
    const next = pushHistory(history, line);
    historyRef.current = next;
    if (next !== history) storeHistory(next);
  }, []);

  /** Leaves the history, as Ctrl+C does, without recording anything. */
  const reset = useCallback(() => {
    cursorRef.current = null;
  }, []);

  /** The line to show after an arrow key, or undefined when it stays as it is. */
  const browse = useCallback((direction: HistoryDirection, current: string) => {
    if (cursorRef.current === null) {
      if (direction === "down") return undefined;
      historyRef.current = readHistory();
      draftRef.current = current;
    }

    const history = historyRef.current;
    const cursor = stepHistory(history.length, cursorRef.current, direction);
    if (cursor === cursorRef.current) return undefined;

    cursorRef.current = cursor;
    return cursor === null ? draftRef.current : history[cursor];
  }, []);

  return { record, reset, browse };
}

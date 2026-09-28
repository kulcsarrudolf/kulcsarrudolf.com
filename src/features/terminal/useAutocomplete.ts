import { type KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";

import { type Candidate, completeJs, completeShell, ghostOf, nextWord } from "./autocomplete";
import { readHistory } from "./commandHistory";

/** Which prompt is up: the shell's, the `js` console's, or one that takes no suggestions. */
export type CompletionMode = "shell" | "js" | "off";

/** The candidates Tab is walking through, and the line as it stood before the first press. */
interface Cycle {
  typed: string;
  candidates: Candidate[];
  index: number;
}

const NONE: Candidate[] = [];

/**
 * The suggestions at the prompt. What could finish the line is shown after it
 * in a lighter grey, the way fish does, and Tab takes it. With more than one
 * candidate the first Tab opens a row of them under the prompt, and Tab and
 * Shift+Tab walk along it, each step putting its candidate on the line. Right
 * arrow at the end of the line takes the suggestion too, Alt+Right takes one
 * word of it, and Escape puts it away.
 *
 * After `command not found` with a guess at what was meant, the guess waits
 * on the empty line the same way, until anything is typed.
 *
 * Tab is only taken from the page when there is something to complete, so
 * with nothing on offer it still moves the focus on, and nobody is kept in
 * the terminal by their keyboard.
 */
export function useAutocomplete(
  input: string,
  setInput: (value: string) => void,
  mode: CompletionMode,
) {
  // Read after the first paint: the server has no history, and neither does
  // the page it sent until it is the visitor's.
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => setHistory(readHistory()), []);

  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [correction, setCorrection] = useState<string | null>(null);
  // The line the suggestion was put away on. One more letter and it is back.
  const [dismissedOn, setDismissedOn] = useState<string | null>(null);

  const candidates = useMemo(() => {
    if (mode === "shell") return completeShell(input, history);
    if (mode === "js" && typeof window !== "undefined") return completeJs(input, history, window);
    return NONE;
  }, [history, input, mode]);

  const offered = input === "" && mode === "shell" ? correction : null;

  let ghost = "";
  if (offered) ghost = offered;
  else if (!cycle && dismissedOn !== input) ghost = ghostOf(input, candidates[0]);

  /** Takes the suggestion, and opens the row when it was one of several. */
  const accept = useCallback(() => {
    if (offered) {
      setInput(offered);
      setCorrection(null);
      return true;
    }

    if (candidates.length === 0) return false;
    setInput(candidates[0].value);
    if (candidates.length > 1) setCycle({ typed: input, candidates, index: 0 });
    return true;
  }, [candidates, input, offered, setInput]);

  const pick = useCallback(
    (index: number) => {
      if (!cycle) return;
      setInput(cycle.candidates[index].value);
      setCycle({ ...cycle, index });
    },
    [cycle, setInput],
  );

  /** The line was typed into, which ends the walk and answers the guess. */
  const typed = useCallback(() => {
    setCycle(null);
    setCorrection(null);
  }, []);

  /** The line was run. `suggestion` is what it was probably meant to be, if it failed. */
  const submitted = useCallback((suggestion?: string) => {
    setCycle(null);
    setDismissedOn(null);
    setCorrection(suggestion ?? null);
    setHistory(readHistory());
  }, []);

  /** A line put at the prompt by something else, such as the arrow keys, is left as it is. */
  const leave = useCallback((line: string) => {
    setCycle(null);
    setCorrection(null);
    setDismissedOn(line);
  }, []);

  /** True when the key was the suggestion's, and the prompt should do nothing more with it. */
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (mode === "off" || event.ctrlKey || event.metaKey) return false;

    if (event.key === "Tab" && !event.altKey) {
      if (cycle) {
        const step = event.shiftKey ? cycle.candidates.length - 1 : 1;
        event.preventDefault();
        pick((cycle.index + step) % cycle.candidates.length);
        return true;
      }

      if (event.shiftKey || !accept()) return false;
      event.preventDefault();
      return true;
    }

    if (event.key === "Escape") {
      if (!cycle && !ghost) return false;
      event.preventDefault();
      // The window's own Escape, where it has one, is for when nothing is on offer.
      event.stopPropagation();
      if (cycle) setInput(cycle.typed);
      leave(cycle ? cycle.typed : input);
      return true;
    }

    if ((event.key === "ArrowRight" || event.key === "End") && !event.shiftKey && ghost) {
      const { selectionStart, selectionEnd, value } = event.currentTarget;
      if (selectionStart !== value.length || selectionEnd !== value.length) return false;
      event.preventDefault();

      if (offered) {
        accept();
        return true;
      }

      const whole = candidates[0].value;
      const taken = event.altKey ? nextWord(ghost).length : ghost.length;
      // The part already typed takes the candidate's spelling along with the rest.
      setInput(whole.slice(0, whole.length - ghost.length + taken));
      return true;
    }

    return false;
  };

  return {
    /** What to show after the line, in the lighter grey. Empty when nothing is on offer. */
    ghost,
    /** The row under the prompt: empty until Tab has more than one candidate to walk. */
    candidates: cycle ? cycle.candidates : NONE,
    selected: cycle ? cycle.index : -1,
    accept,
    pick,
    typed,
    submitted,
    leave,
    onKeyDown,
  };
}

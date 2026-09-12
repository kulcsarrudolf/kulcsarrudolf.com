import { useNavigate } from "@tanstack/react-router";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLovingAtmosphere } from "@/features/wedding/useLovingAtmosphere";
import { useLangSearch } from "@/i18n/useLangSearch";

import { type CommandResult, runCommand } from "./commands";

export interface TerminalEntry {
  id: number;
  /** What was typed, verbatim. Empty for a bare Return. */
  command: string;
  result: CommandResult;
}

// Enough to scroll back through, not enough to grow the page without end.
const MAX_ENTRIES = 30;

const OPENING_ENTRY: TerminalEntry = { id: 0, command: "./intro.sh", result: { kind: "intro" } };

/**
 * The terminal's state: what has been run so far and what is being typed.
 *
 * Return runs the line. An empty line still adds a fresh prompt underneath,
 * so the terminal answers the key the way a real one does. `clear` empties
 * the history, and a page name navigates with the visitor's language kept.
 * One command opens the sudoku over the page, so the window it belongs to
 * is held here alongside the history. The wedding commands put the loving
 * atmosphere over it, which any other command takes back down again.
 */
export function useTerminal(autoFocus: boolean) {
  const navigate = useNavigate();
  const langSearch = useLangSearch();

  const [entries, setEntries] = useState<TerminalEntry[]>([OPENING_ENTRY]);
  const [input, setInput] = useState("");
  const [sudokuOpen, setSudokuOpen] = useState(false);

  // Which entry printed the atmosphere that is up. Only that one shows the way
  // out of it, so the older wedding blocks in the scrollback stay inert.
  const [atmosphereEntryId, setAtmosphereEntryId] = useState<number | null>(null);
  const atmosphere = useLovingAtmosphere();
  const { start: startAtmosphere, stop: stopAtmosphere } = atmosphere;

  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);

  // A terminal on screen already has the caret in it, so the first thing
  // typed on the home page lands at the prompt without anyone clicking it
  // first. Only where there is a real pointer: on a touch screen the same
  // focus throws the on-screen keyboard up over a page nobody has read yet.
  // The page must not scroll to the prompt either, since the intro above it
  // is what a visitor is meant to land on. A terminal that is not on screen
  // takes nothing: the button in the corner hands it the caret when pressed.
  useEffect(() => {
    if (!autoFocus || !window.matchMedia("(pointer: fine)").matches) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const submit = useCallback(() => {
    const result = runCommand(input);
    setInput("");

    // `clear` takes the wedding line away with the rest of the history, so it
    // has to take the hearts too rather than leave them up with no way out.
    if (result.kind === "clear") {
      setEntries([]);
      stopAtmosphere();
      return;
    }

    const id = nextIdRef.current++;
    setEntries((previous) => [...previous, { id, command: input, result }].slice(-MAX_ENTRIES));

    // A wedding command starts the hearts, or restarts the clock on the ones
    // already flying. Anything else typed at the prompt takes them down, which
    // is the way out for a visitor with no escape key in reach. A bare Return
    // is not a command, so it leaves them alone.
    if (result.kind === "wedding") {
      setAtmosphereEntryId(id);
      startAtmosphere();
    } else if (result.kind !== "empty") {
      stopAtmosphere();
    }

    // The sudoku reads the number keys off the window, so the prompt lets go
    // of the caret while the game is up rather than collecting what is typed
    // into it from behind the dialog.
    if (result.kind === "sudoku") {
      setSudokuOpen(true);
      inputRef.current?.blur();
    }

    if (result.kind === "navigate") {
      navigate({ to: result.destination.to, search: langSearch });
    }
  }, [input, langSearch, navigate, startAtmosphere, stopAtmosphere]);

  // Closing the sudoku hands the caret back, so the next command can be
  // typed without reaching for the mouse.
  const closeSudoku = useCallback(() => {
    setSudokuOpen(false);
    inputRef.current?.focus();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value);

  // Return is caught on the key itself, and the default is stopped so the
  // form's implicit submission does not run the line a second time. The form
  // is still there for what never sends a key: a phone keyboard's Go button.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  // A click anywhere in the window puts the caret at the prompt, the way a
  // real terminal takes focus, unless it landed on a link or the input itself.
  const focusPrompt = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, input")) return;
    inputRef.current?.focus();
  };

  return {
    entries,
    input,
    inputRef,
    atmosphere,
    /** Null unless the atmosphere is running, so a finished one shows nothing. */
    atmosphereEntryId: atmosphere.running ? atmosphereEntryId : null,
    sudokuOpen,
    closeSudoku,
    focusPrompt,
    onSubmit,
    inputProps: {
      value: input,
      onChange,
      onKeyDown,
    },
  };
}

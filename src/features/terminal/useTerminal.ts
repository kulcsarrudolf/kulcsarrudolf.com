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

import { runCommand } from "./commands";
import type { EntryResult, Step } from "./sendMessage";
import { useJsConsole } from "./useJsConsole";
import { useSendMessage } from "./useSendMessage";

/** What stands in for the shell's prompt: a `send-message` question, or the `js` console's. */
export type PromptKind = Step | "js";

export interface TerminalEntry {
  id: number;
  /** What was typed, verbatim. Empty for a bare Return. */
  command: string;
  /** The question the line answered, or the console it was typed into, shown in place of the prompt. */
  prompt?: PromptKind;
  /** Printed by the terminal on its own rather than typed, so it has no prompt line. */
  silent?: boolean;
  result: EntryResult;
}

export type NewEntry = Omit<TerminalEntry, "id">;

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
 * `send-message` asks its questions at the prompt, and while one is open
 * every line is its answer until the message is sent or Ctrl+C ends it.
 * `js` does the same with the browser console: every line is JavaScript run
 * in the page until `.exit` or Ctrl+C, and `js <code>` runs a single line.
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

  const append = useCallback((entry: NewEntry) => {
    const id = nextIdRef.current++;
    setEntries((previous) => [...previous, { id, ...entry }].slice(-MAX_ENTRIES));
    return id;
  }, []);

  const {
    step,
    busy,
    start: startMessage,
    answer: answerMessage,
    cancel: cancelMessage,
  } = useSendMessage(append);

  const {
    open: jsOpen,
    start: startJs,
    run: runJs,
    answer: answerJs,
    cancel: cancelJs,
  } = useJsConsole(append);

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
    // The line stays put while a message is on its way, and Return waits.
    if (busy) return;
    setInput("");

    // An open question takes the line as its answer, whatever it says.
    if (step) {
      answerMessage(input);
      return;
    }

    // The console takes the line as JavaScript until it is left.
    if (jsOpen) {
      answerJs(input);
      return;
    }

    const result = runCommand(input);

    // `js <code>` prints what the code came to in place of the command's own
    // output, so the console appends the line rather than the shell.
    if (result.kind === "jsEval") {
      stopAtmosphere();
      runJs(result.code, input);
      return;
    }

    // `clear` takes the wedding line away with the rest of the history, so it
    // has to take the hearts too rather than leave them up with no way out.
    if (result.kind === "clear") {
      setEntries([]);
      stopAtmosphere();
      return;
    }

    const id = append({ command: input, result });

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

    if (result.kind === "sendMessage") startMessage();
    if (result.kind === "jsConsole") startJs();

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
  }, [
    append,
    answerJs,
    answerMessage,
    busy,
    input,
    jsOpen,
    langSearch,
    navigate,
    runJs,
    startAtmosphere,
    startJs,
    startMessage,
    step,
    stopAtmosphere,
  ]);

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
  // Ctrl+C is the shell's interrupt while a question is open, unless there is
  // a selection in the line, when it is still the copy it always was.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((step || jsOpen) && event.ctrlKey && event.key.toLowerCase() === "c") {
      const { selectionStart, selectionEnd } = event.currentTarget;
      if (selectionStart !== selectionEnd) return;
      event.preventDefault();
      if (step) cancelMessage(input);
      else cancelJs(input);
      setInput("");
      return;
    }

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
    /** What stands in for the prompt: the open `send-message` question, or the `js` console. */
    prompt: step ?? (jsOpen ? ("js" as const) : null),
    busy,
    inputProps: {
      value: input,
      onChange,
      onKeyDown,
    },
  };
}

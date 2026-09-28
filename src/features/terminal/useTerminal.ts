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
import { useAutocomplete } from "./useAutocomplete";
import { useCommandHistory } from "./useCommandHistory";
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

/** The games a command opens over the page. */
export type Game = "sudoku" | "bisect";

// Enough to scroll back through, not enough to grow the page without end.
const MAX_ENTRIES = 30;

const OPENING_ENTRY: TerminalEntry = { id: 0, command: "./intro.sh", result: { kind: "intro" } };

/**
 * The terminal's state: what has been run so far and what is being typed.
 *
 * Return runs the line. An empty line still adds a fresh prompt underneath,
 * so the terminal answers the key the way a real one does. `clear` empties
 * the history, and a page name navigates with the visitor's language kept.
 * Two commands open a game over the page, sudoku and bisect, so which one
 * is up is held here alongside the history. The wedding commands put the loving
 * atmosphere over it, which any other command takes back down again.
 * `send-message` asks its questions at the prompt, and while one is open
 * every line is its answer until the message is sent or Ctrl+C ends it.
 * `js` does the same with the browser console: every line is JavaScript run
 * in the page until `.exit` or Ctrl+C, and `js <code>` runs a single line.
 * The arrow keys walk back through what was typed, kept across visits, except
 * while a `send-message` question is open, whose answers are never kept.
 * What could finish the line is offered after it, and Tab takes it, at the
 * shell and in the console but never at a question, whose answer is the
 * visitor's own.
 */
export function useTerminal(autoFocus: boolean) {
  const navigate = useNavigate();
  const langSearch = useLangSearch();

  const [entries, setEntries] = useState<TerminalEntry[]>([OPENING_ENTRY]);
  const [input, setInput] = useState("");
  const [game, setGame] = useState<Game | null>(null);

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

  const { record: recordLine, reset: resetHistory, browse: browseHistory } = useCommandHistory();

  const completion = useAutocomplete(
    input,
    setInput,
    step || busy ? "off" : jsOpen ? "js" : "shell",
  );
  const {
    typed: typedLine,
    submitted: submittedLine,
    leave: leaveLine,
    accept: acceptSuggestion,
    pick: pickCandidate,
  } = completion;

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
      submittedLine();
      answerMessage(input);
      return;
    }

    recordLine(input);

    // The console takes the line as JavaScript until it is left.
    if (jsOpen) {
      submittedLine();
      answerJs(input);
      return;
    }

    const result = runCommand(input);
    // A line that was nearly a command leaves the command waiting at the prompt.
    submittedLine(result.kind === "notFound" ? result.suggestion : undefined);

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

    // The games take the keyboard (the sudoku reads the number keys off the
    // window, bisect the arrows on its board), so the prompt lets go of the
    // caret while one is up rather than collecting what is typed into it
    // from behind the dialog.
    if (result.kind === "sudoku" || result.kind === "bisect") {
      setGame(result.kind);
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
    recordLine,
    runJs,
    startAtmosphere,
    startJs,
    startMessage,
    step,
    stopAtmosphere,
    submittedLine,
  ]);

  // Closing a game hands the caret back, so the next command can be typed
  // without reaching for the mouse.
  const closeGame = useCallback(() => {
    setGame(null);
    inputRef.current?.focus();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    typedLine();
    setInput(event.target.value);
  };

  // Taken with a tap or a click rather than a key, which a phone does not
  // have, so the caret goes back to the prompt for the Return that follows.
  const takeSuggestion = useCallback(() => {
    acceptSuggestion();
    inputRef.current?.focus({ preventScroll: true });
  }, [acceptSuggestion]);

  const takeCandidate = useCallback(
    (index: number) => {
      pickCandidate(index);
      inputRef.current?.focus({ preventScroll: true });
    },
    [pickCandidate],
  );

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
      resetHistory();
      leaveLine("");
      setInput("");
      return;
    }

    // Tab, Escape and the right arrow are the suggestion's while there is one.
    if (completion.onKeyDown(event)) return;

    // Up and down recall earlier lines, and the default is stopped so the
    // caret does not jump to either end of the line first.
    if (!step && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      const recalled = browseHistory(event.key === "ArrowUp" ? "up" : "down", input);
      if (recalled !== undefined) {
        // A recalled line is whole as it is, so nothing is offered to finish it.
        leaveLine(recalled);
        setInput(recalled);
      }
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
    /** The game open over the page, if any. */
    game,
    closeGame,
    focusPrompt,
    onSubmit,
    /** What stands in for the prompt: the open `send-message` question, or the `js` console. */
    prompt: step ?? (jsOpen ? ("js" as const) : null),
    busy,
    /** What is on offer to finish the line, and the two ways to take it without a key. */
    completion: {
      ghost: completion.ghost,
      candidates: completion.candidates,
      selected: completion.selected,
      onAccept: takeSuggestion,
      onPick: takeCandidate,
    },
    inputProps: {
      value: input,
      onChange,
      onKeyDown,
    },
  };
}

import { useNavigate } from "@tanstack/react-router";
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";

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
 * The terminal's state: what has been run so far, what is being typed, and
 * whether the prompt has focus (which decides whether the block cursor blinks
 * or the input's own caret shows).
 *
 * Return runs the line. An empty line still adds a fresh prompt underneath,
 * so the terminal answers the key the way a real one does. `clear` empties
 * the history, and a page name navigates with the visitor's language kept.
 */
export function useTerminal() {
  const navigate = useNavigate();
  const langSearch = useLangSearch();

  const [entries, setEntries] = useState<TerminalEntry[]>([OPENING_ENTRY]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);

  const submit = useCallback(() => {
    const result = runCommand(input);
    setInput("");

    if (result.kind === "clear") {
      setEntries([]);
      return;
    }

    setEntries((previous) =>
      [...previous, { id: nextIdRef.current++, command: input, result }].slice(-MAX_ENTRIES),
    );

    if (result.kind === "navigate") {
      navigate({ to: result.destination.to, search: langSearch });
    }
  }, [input, langSearch, navigate]);

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
    isFocused,
    inputRef,
    focusPrompt,
    onSubmit,
    inputProps: {
      value: input,
      onChange,
      onKeyDown,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
    },
  };
}

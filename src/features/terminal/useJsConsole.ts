import { useCallback, useState } from "react";

import { evaluate, formatError, formatValue, isThenable, JS_EXIT, type JsLine } from "./jsConsole";
import type { NewEntry } from "./useTerminal";

/**
 * The `js` console running in the terminal. While it is open every line is
 * JavaScript, run in the page the way DevTools runs it, until `.exit` or
 * Ctrl+C hands the prompt back to the shell. A promise is printed when it
 * settles, on a line of its own, so a slow one never holds the prompt.
 */
export function useJsConsole(append: (entry: NewEntry) => void) {
  const [open, setOpen] = useState(false);

  const start = useCallback(() => setOpen(true), []);

  /** Runs one line, and echoes it under the `js >` prompt when the console is open. */
  const run = useCallback(
    (line: string, command = line) => {
      const prompt = open ? ("js" as const) : undefined;
      const { logs, outcome } = evaluate(line);

      if (outcome.kind === "error") {
        append({
          command,
          prompt,
          result: { kind: "js", lines: [...logs, errorLine(outcome.error)] },
        });
        return;
      }

      const { value } = outcome;
      if (!isThenable(value)) {
        append({ command, prompt, result: { kind: "js", lines: [...logs, resultLine(value)] } });
        return;
      }

      append({ command, prompt, result: { kind: "js", lines: logs } });
      Promise.resolve(value).then(
        (settled) =>
          append({
            command: "",
            silent: true,
            result: { kind: "js", lines: [resultLine(settled)] },
          }),
        (error) =>
          append({ command: "", silent: true, result: { kind: "js", lines: [errorLine(error)] } }),
      );
    },
    [append, open],
  );

  const answer = useCallback(
    (line: string) => {
      if (JS_EXIT.has(line.trim())) {
        append({ command: line, prompt: "js", result: { kind: "empty" } });
        setOpen(false);
        return;
      }
      // A bare Return is a fresh prompt, as it is in the shell.
      if (!line.trim()) {
        append({ command: "", prompt: "js", result: { kind: "empty" } });
        return;
      }
      run(line);
    },
    [append, run],
  );

  // Ctrl+C: the half-typed line is echoed with a ^C after it, and the shell is back.
  const cancel = useCallback(
    (typed: string) => {
      append({ command: `${typed}^C`, prompt: "js", result: { kind: "empty" } });
      setOpen(false);
    },
    [append],
  );

  return { open, start, run, answer, cancel };
}

const resultLine = (value: unknown): JsLine => ({ tone: "result", text: formatValue(value) });
const errorLine = (error: unknown): JsLine => ({ tone: "error", text: formatError(error) });

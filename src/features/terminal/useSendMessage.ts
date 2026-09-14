import { useCallback, useState } from "react";

import { CONTACT_SUBJECT, submitContact } from "@/lib/contact";

import { type Flow, respond, settle, startFlow } from "./sendMessage";
import type { NewEntry } from "./useTerminal";

const TERMINAL_SUBJECT = `${CONTACT_SUBJECT} (via terminal)`;

/**
 * The `send-message` flow running in the terminal: which question is open,
 * and the sending once the visitor says yes. Every line it prints goes into
 * the terminal's history through `append`, the answers with their question
 * in place of the prompt, and how the sending went on a line of its own.
 */
export function useSendMessage(append: (entry: NewEntry) => void) {
  const [flow, setFlow] = useState<Flow | null>(null);

  const start = useCallback(() => setFlow(startFlow()), []);

  const send = useCallback(
    (sending: Flow) => {
      void submitContact({ ...sending.draft, subject: TERMINAL_SUBJECT }).then((sent) => {
        const { flow: next, note } = settle(sending, sent);
        setFlow(next);
        if (note) append({ command: "", silent: true, result: { kind: "message", note } });
      });
    },
    [append],
  );

  const answer = useCallback(
    (line: string) => {
      if (!flow) return;
      const outcome = respond(flow, line);
      append({
        command: line,
        prompt: flow.step,
        result: outcome.note ? { kind: "message", note: outcome.note } : { kind: "empty" },
      });
      setFlow(outcome.flow);
      if (outcome.send && outcome.flow) send(outcome.flow);
    },
    [append, flow, send],
  );

  // Ctrl+C: the half-typed line is echoed with a ^C after it, the way a
  // shell prints an interrupt. A message already on its way cannot be stopped.
  const cancel = useCallback(
    (typed: string) => {
      if (!flow || flow.step === "sending") return;
      append({
        command: `${typed}^C`,
        prompt: flow.step,
        result: { kind: "message", note: { kind: "discarded" } },
      });
      setFlow(null);
    },
    [append, flow],
  );

  return {
    /** The open question, or null when the terminal is taking commands. */
    step: flow?.step ?? null,
    busy: flow?.step === "sending",
    start,
    answer,
    cancel,
  };
}

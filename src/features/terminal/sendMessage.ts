/**
 * `send-message`: the contact form, asked one question at a time. A pure step
 * from the flow so far and the line just typed to what comes next, so the
 * hook only has to hold the state and do the sending.
 */

import { isValidEmail, normalizeWebsite } from "@/lib/contact";

import type { CommandResult } from "./commands";

export type Step = "name" | "email" | "website" | "message" | "confirm" | "sending" | "retry";

export interface Draft {
  name: string;
  email: string;
  website: string;
  message: string;
}

export interface Flow {
  step: Step;
  draft: Draft;
}

export type MessageNote =
  /** An answer that cannot be sent, so the same question is asked again. */
  | { kind: "invalid"; field: "name" | "email" | "message" }
  /** Everything typed, read back before the visitor says yes. */
  | { kind: "summary"; draft: Draft }
  /** Neither yes nor no, where one of them was asked for. */
  | { kind: "yesNo" }
  | { kind: "sent" }
  | { kind: "failed" }
  /** Cancelled, or answered no to sending. */
  | { kind: "discarded" }
  /** Answered no to trying again, so the other ways to reach me are named. */
  | { kind: "gaveUp" };

/** What a line in the terminal's history printed: a command's, or the flow's. */
export type EntryResult = CommandResult | { kind: "message"; note: MessageNote };

export interface Outcome {
  /** Null once the flow is over. */
  flow: Flow | null;
  note?: MessageNote;
  /** The draft is ready: send it, then `settle` the flow with how that went. */
  send?: true;
}

// Both languages' yes and no, so a Hungarian visitor's `i` and `nem` work too.
const YES = new Set(["y", "yes", "i", "igen"]);
const NO = new Set(["n", "no", "nem"]);
const CANCEL = "cancel";

export const startFlow = (): Flow => ({
  step: "name",
  draft: { name: "", email: "", website: "", message: "" },
});

/** Takes the line typed at the flow's current question. */
export function respond(flow: Flow, line: string): Outcome {
  const value = line.trim();
  const { step, draft } = flow;

  // The input is read-only while sending, so nothing should arrive here.
  if (step === "sending") return { flow };
  if (value.toLowerCase() === CANCEL) return { flow: null, note: { kind: "discarded" } };

  switch (step) {
    case "name":
      return value
        ? { flow: { step: "email", draft: { ...draft, name: value } } }
        : { flow, note: { kind: "invalid", field: "name" } };
    case "email":
      return isValidEmail(value)
        ? { flow: { step: "website", draft: { ...draft, email: value } } }
        : { flow, note: { kind: "invalid", field: "email" } };
    case "website":
      return { flow: { step: "message", draft: { ...draft, website: normalizeWebsite(value) } } };
    case "message": {
      if (!value) return { flow, note: { kind: "invalid", field: "message" } };
      const ready = { ...draft, message: value };
      return { flow: { step: "confirm", draft: ready }, note: { kind: "summary", draft: ready } };
    }
    case "confirm":
    case "retry": {
      const answer = value.toLowerCase();
      if (YES.has(answer)) return { flow: { step: "sending", draft }, send: true };
      if (NO.has(answer)) {
        return { flow: null, note: { kind: step === "confirm" ? "discarded" : "gaveUp" } };
      }
      return { flow, note: { kind: "yesNo" } };
    }
  }
}

/** How the sending went: done, or the same draft waiting on a retry. */
export const settle = (flow: Flow, sent: boolean): Outcome =>
  sent
    ? { flow: null, note: { kind: "sent" } }
    : { flow: { ...flow, step: "retry" }, note: { kind: "failed" } };

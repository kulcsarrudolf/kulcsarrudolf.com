import { describe, expect, it } from "vitest";

import { type Flow, respond, settle, startFlow } from "./sendMessage";

/** Answers each line in turn, failing loudly if the flow ends on the way. */
const walk = (...lines: string[]): Flow =>
  lines.reduce<Flow>((flow, line) => {
    const next = respond(flow, line).flow;
    if (!next) throw new Error(`the flow ended at "${line}"`);
    return next;
  }, startFlow());

const draft = {
  name: "Jane",
  email: "jane@example.com",
  website: "https://jane.dev",
  message: "Hi there",
};

describe("respond", () => {
  it("asks for the name, email, website and message, then reads them back", () => {
    const atMessage = walk("  Jane ", "jane@example.com", "jane.dev");
    expect(atMessage).toEqual({ step: "message", draft: { ...draft, message: "" } });

    const outcome = respond(atMessage, "Hi there");
    expect(outcome.flow).toEqual({ step: "confirm", draft });
    expect(outcome.note).toEqual({ kind: "summary", draft });
  });

  it("skips an empty website", () => {
    expect(walk("Jane", "jane@example.com", "").step).toBe("message");
    expect(walk("Jane", "jane@example.com", "").draft.website).toBe("");
  });

  it("asks the same question again for a blank name, a bad email or a blank message", () => {
    const start = startFlow();
    expect(respond(start, "  ")).toEqual({
      flow: start,
      note: { kind: "invalid", field: "name" },
    });

    const atEmail = walk("Jane");
    expect(respond(atEmail, "jane")).toEqual({
      flow: atEmail,
      note: { kind: "invalid", field: "email" },
    });

    const atMessage = walk("Jane", "jane@example.com", "");
    expect(respond(atMessage, "")).toEqual({
      flow: atMessage,
      note: { kind: "invalid", field: "message" },
    });
  });

  it("takes a command's name as an answer", () => {
    expect(walk("clear").draft.name).toBe("clear");
  });

  it("ends at any question when cancel is typed", () => {
    const flows = [
      startFlow(),
      walk("Jane"),
      walk("Jane", "jane@example.com"),
      walk("Jane", "jane@example.com", ""),
      walk("Jane", "jane@example.com", "", "Hi"),
    ];
    for (const flow of flows) {
      expect(respond(flow, " Cancel ")).toEqual({ flow: null, note: { kind: "discarded" } });
    }
  });

  it("sends on yes and discards on no", () => {
    const confirm = walk("Jane", "jane@example.com", "jane.dev", "Hi there");
    for (const yes of ["y", "YES", "i", "igen"]) {
      expect(respond(confirm, yes)).toEqual({ flow: { step: "sending", draft }, send: true });
    }
    for (const no of ["n", "no", "nem"]) {
      expect(respond(confirm, no)).toEqual({ flow: null, note: { kind: "discarded" } });
    }
    expect(respond(confirm, "maybe")).toEqual({ flow: confirm, note: { kind: "yesNo" } });
  });

  it("ignores lines while sending", () => {
    const sending: Flow = { step: "sending", draft };
    expect(respond(sending, "cancel")).toEqual({ flow: sending });
  });
});

describe("settle", () => {
  const sending: Flow = { step: "sending", draft };

  it("ends the flow once sent", () => {
    expect(settle(sending, true)).toEqual({ flow: null, note: { kind: "sent" } });
  });

  it("keeps the draft for a retry when sending failed", () => {
    const failed = settle(sending, false);
    expect(failed).toEqual({ flow: { step: "retry", draft }, note: { kind: "failed" } });

    const retry = failed.flow!;
    expect(respond(retry, "y")).toEqual({ flow: sending, send: true });
    expect(respond(retry, "n")).toEqual({ flow: null, note: { kind: "gaveUp" } });
  });
});

import { describe, expect, it } from "vitest";

import { MAX_HISTORY, parseHistory, pushHistory, stepHistory } from "./commandHistory";

describe("parseHistory", () => {
  it("reads a stored list of lines", () => {
    expect(parseHistory('["help","ls"]')).toEqual(["help", "ls"]);
  });

  it("reads nothing from missing, broken or foreign values", () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory("not json")).toEqual([]);
    expect(parseHistory('{"help":true}')).toEqual([]);
  });

  it("drops what is not a line and keeps only the newest entries", () => {
    expect(parseHistory('["help",3,null,"ls"]')).toEqual(["help", "ls"]);

    const long = Array.from({ length: MAX_HISTORY + 5 }, (_, index) => `echo ${index}`);
    const parsed = parseHistory(JSON.stringify(long));
    expect(parsed).toHaveLength(MAX_HISTORY);
    expect(parsed.at(-1)).toBe(`echo ${MAX_HISTORY + 4}`);
  });
});

describe("pushHistory", () => {
  it("adds a line to the end", () => {
    expect(pushHistory(["help"], "ls")).toEqual(["help", "ls"]);
  });

  it("skips blank lines and a repeat of the last line", () => {
    const history = ["help"];
    expect(pushHistory(history, "")).toBe(history);
    expect(pushHistory(history, "   ")).toBe(history);
    expect(pushHistory(history, "help")).toBe(history);
    expect(pushHistory(["help", "ls"], "help")).toEqual(["help", "ls", "help"]);
  });

  it("forgets the oldest line past the limit", () => {
    const full = Array.from({ length: MAX_HISTORY }, (_, index) => `echo ${index}`);
    const pushed = pushHistory(full, "ls");
    expect(pushed).toHaveLength(MAX_HISTORY);
    expect(pushed[0]).toBe("echo 1");
    expect(pushed.at(-1)).toBe("ls");
  });
});

describe("stepHistory", () => {
  it("goes nowhere without a history", () => {
    expect(stepHistory(0, null, "up")).toBeNull();
    expect(stepHistory(0, null, "down")).toBeNull();
  });

  it("walks up from the typed line to the oldest entry and stops there", () => {
    expect(stepHistory(3, null, "up")).toBe(2);
    expect(stepHistory(3, 2, "up")).toBe(1);
    expect(stepHistory(3, 0, "up")).toBe(0);
  });

  it("walks down to the newest entry and then back to the typed line", () => {
    expect(stepHistory(3, 0, "down")).toBe(1);
    expect(stepHistory(3, 2, "down")).toBeNull();
    expect(stepHistory(3, null, "down")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import { completeJs, completeShell, ghostOf, nextWord, rankHistory } from "./autocomplete";

const values = (candidates: { value: string }[]) => candidates.map(({ value }) => value);

describe("completeShell", () => {
  it("offers nothing for an empty line", () => {
    expect(completeShell("", ["help"])).toEqual([]);
    expect(completeShell("   ", ["help"])).toEqual([]);
  });

  it("finishes a listed command and says what it does", () => {
    expect(completeShell("bis", [])).toEqual([
      { value: "bisect", source: "command", hint: "bisect" },
      { value: "bisect.sh", source: "command", hint: "bisect" },
    ]);
  });

  it("offers what help lists first, then the pages, then the other spellings", () => {
    expect(values(completeShell("b", []))).toEqual([
      "bisect",
      "blog/",
      "bash intro.sh",
      "bisect.sh",
      "bash bisect.sh",
    ]);
    expect(values(completeShell("c", []))).toEqual([
      "clear",
      "contact/",
      "cut-in-half",
      "cutinhalf",
      "cutle",
      "cls",
    ]);
  });

  it("matches whatever the case, and leaves out what is already typed in full", () => {
    expect(values(completeShell("HEL", []))).toEqual(["help"]);
    expect(values(completeShell("help", []))).toEqual([]);
  });

  it("names the page a candidate opens", () => {
    expect(completeShell("pro", [])).toEqual([
      { value: "projects/", source: "command", hint: "navigate", page: "projects/" },
    ]);
  });

  it("offers the pages after a verb that opens one", () => {
    expect(values(completeShell("cd ", []))).toEqual(["cd blog/", "cd projects/", "cd contact/"]);
    expect(values(completeShell("open pro", []))).toEqual(["open projects/"]);
    expect(values(completeShell("cd blog", []))).toEqual(["cd blog/"]);
  });

  it("puts the lists ahead of the history, and offers each line once", () => {
    const history = ["quote", "js 1 + 1", "quote", "js  [1,  2]"];
    expect(completeShell("q", history)).toEqual([
      { value: "quote", source: "command", hint: "quote" },
    ]);
    expect(completeShell("js", history)).toEqual([
      { value: "js  [1,  2]", source: "history", hint: "history" },
      { value: "js 1 + 1", source: "history", hint: "history" },
    ]);
  });

  it("never offers the hidden commands from the lists", () => {
    expect(values(completeShell("su", []))).toEqual([]);
    expect(values(completeShell("n", []))).toEqual(["node"]);
    expect(values(completeShell("r", []))).toEqual(["random-quote"]);
  });

  it("offers a hidden command back to somebody who has found it", () => {
    expect(completeShell("su", ["sudoku"])).toEqual([
      { value: "sudoku", source: "history", hint: "history" },
    ]);
    expect(values(completeShell("rud", ["rudolf-and-nora"]))).toEqual(["rudolf-and-nora"]);
  });

  it("leaves out of the history what the shell never understood", () => {
    expect(values(completeShell("do", ["document.title", "dolphin"]))).toEqual([]);
  });

  it("offers no more than fit the row", () => {
    expect(
      completeShell(
        "b",
        Array.from({ length: 20 }, (_, n) => `blog/${"/".repeat(n)}`),
      ),
    ).toHaveLength(8);
  });
});

describe("rankHistory", () => {
  it("puts the line typed most and latest first", () => {
    expect(rankHistory(["ls", "ll", "ls", "help", "ll"], "l")).toEqual(["ll", "ls"]);
    expect(rankHistory(["ls", "ls", "ls", "ll", "help", "quote"], "l")).toEqual(["ls", "ll"]);
  });

  it("keeps only what carries on from what was typed", () => {
    expect(rankHistory(["ls", "help", "ls -la"], "ls")).toEqual(["ls -la"]);
  });
});

describe("completeJs", () => {
  const root = {
    document: { title: "Home", body: { id: "" }, getElementById: () => null },
    devicePixelRatio: 2,
  };

  it("offers the names on the objects in the page", () => {
    expect(completeJs("document.ti", [], root)).toEqual([
      { value: "document.title", source: "property", hint: "property" },
    ]);
    expect(completeJs("document.getE", [], root)).toEqual([
      { value: "document.getElementById", source: "property", hint: "method" },
    ]);
  });

  it("offers the way out", () => {
    expect(completeJs(".e", [], root)).toEqual([
      { value: ".exit", source: "command", hint: "exit" },
    ]);
  });

  it("offers the JavaScript typed before, from either prompt", () => {
    const history = ["help", "bsiect", "[1, 2].map(String)", "js [1, 2].length", ".exit"];
    expect(values(completeJs("[1", history, root))).toEqual([
      "[1, 2].length",
      "[1, 2].map(String)",
    ]);
  });

  it("minds the case of a line from the history", () => {
    expect(values(completeJs("math", ["Math.max(1, 2)"], {}))).toEqual([]);
  });
});

describe("ghostOf", () => {
  const bisect = { value: "bisect", source: "command", hint: "bisect" } as const;

  it("is the rest of the candidate", () => {
    expect(ghostOf("bis", bisect)).toBe("ect");
    expect(ghostOf("  BIS", bisect)).toBe("ect");
  });

  it("is nothing without a candidate, or with one that does not carry on", () => {
    expect(ghostOf("bis", undefined)).toBe("");
    expect(ghostOf("help", bisect)).toBe("");
  });
});

describe("nextWord", () => {
  it("takes one word of the ghost, with the space before it", () => {
    expect(nextWord(" bisect start")).toBe(" bisect");
    expect(nextWord("ect")).toBe("ect");
    expect(nextWord("blog/")).toBe("blog/");
  });
});

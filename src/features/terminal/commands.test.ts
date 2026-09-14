import { describe, expect, it } from "vitest";

import quotes from "@/content/quotes";

import { runCommand } from "./commands";

describe("runCommand", () => {
  it("treats a blank line as an empty command", () => {
    expect(runCommand("")).toEqual({ kind: "empty" });
    expect(runCommand("   ")).toEqual({ kind: "empty" });
  });

  it("reprints the intro for ./intro.sh and its shorter spellings", () => {
    expect(runCommand("./intro.sh")).toEqual({ kind: "intro" });
    expect(runCommand("intro")).toEqual({ kind: "intro" });
    expect(runCommand("  sh   intro.sh ")).toEqual({ kind: "intro" });
  });

  it("lists the destinations for ls", () => {
    expect(runCommand("ls")).toEqual({ kind: "list" });
    expect(runCommand("LS -la")).toEqual({ kind: "list" });
  });

  it("knows help and clear", () => {
    expect(runCommand("help")).toEqual({ kind: "help" });
    expect(runCommand("?")).toEqual({ kind: "help" });
    expect(runCommand("clear")).toEqual({ kind: "clear" });
  });

  it("opens a page for its name, with or without a slash or a verb", () => {
    const blog = { to: "/blog", label: "blog/" };
    expect(runCommand("blog")).toEqual({ kind: "navigate", destination: blog });
    expect(runCommand("blog/")).toEqual({ kind: "navigate", destination: blog });
    expect(runCommand("cd blog")).toEqual({ kind: "navigate", destination: blog });
    expect(runCommand("open projects/")).toEqual({
      kind: "navigate",
      destination: { to: "/projects", label: "projects/" },
    });
    expect(runCommand("Contact")).toEqual({
      kind: "navigate",
      destination: { to: "/contact", label: "contact/" },
    });
  });

  it("counts down to the wedding for the names it is known by", () => {
    for (const line of ["nr", "RN", "nr-wedding", "rn-wedding", "rudolf-and-nora", "cd nr/"]) {
      expect(runCommand(line)).toEqual({ kind: "wedding" });
    }
  });

  it("opens the sudoku for sudoku and its script", () => {
    expect(runCommand("sudoku")).toEqual({ kind: "sudoku" });
    expect(runCommand("./sudoku.sh")).toEqual({ kind: "sudoku" });
    expect(runCommand("  sh   sudoku.sh ")).toEqual({ kind: "sudoku" });
  });

  it("starts a message for send-message and mail, while contact still opens the page", () => {
    expect(runCommand("send-message")).toEqual({ kind: "sendMessage" });
    expect(runCommand(" MAIL ")).toEqual({ kind: "sendMessage" });
    expect(runCommand("contact").kind).toBe("navigate");
  });

  it("opens the js console for js and node, and runs the rest of a js line as code", () => {
    expect(runCommand("js")).toEqual({ kind: "jsConsole" });
    expect(runCommand(" Node ")).toEqual({ kind: "jsConsole" });
    expect(runCommand("js document.title  ")).toEqual({ kind: "jsEval", code: "document.title" });
    expect(runCommand("JS [1,  2].map(String)")).toEqual({
      kind: "jsEval",
      code: "[1,  2].map(String)",
    });
    expect(runCommand("jsx").kind).toBe("notFound");
  });

  it("prints a quote from the list for random-quote and its aliases", () => {
    expect(runCommand("random-quote", () => 0)).toEqual({ kind: "quote", quote: quotes[0] });
    expect(runCommand(" Fortune ", () => 0.999)).toEqual({
      kind: "quote",
      quote: quotes[quotes.length - 1],
    });
    expect(runCommand("quote").kind).toBe("quote");
  });

  it("reports anything else as not found, keeping what was typed", () => {
    expect(runCommand("rm -rf /")).toEqual({ kind: "notFound", command: "rm -rf /" });
    expect(runCommand("cd nowhere")).toEqual({ kind: "notFound", command: "cd nowhere" });
  });
});

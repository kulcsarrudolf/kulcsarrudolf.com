import { describe, expect, it } from "vitest";

import { closest, editDistance } from "./didYouMean";

describe("editDistance", () => {
  it("counts nothing between a word and itself", () => {
    expect(editDistance("bisect", "bisect")).toBe(0);
    expect(editDistance("", "")).toBe(0);
  });

  it("counts a letter added, dropped or replaced as one edit", () => {
    expect(editDistance("help", "helps")).toBe(1);
    expect(editDistance("clear", "clar")).toBe(1);
    expect(editDistance("quote", "quota")).toBe(1);
    expect(editDistance("", "ls")).toBe(2);
  });

  it("counts two neighbouring letters swapped as one edit", () => {
    expect(editDistance("sl", "ls")).toBe(1);
    expect(editDistance("bsiect", "bisect")).toBe(1);
  });
});

describe("closest", () => {
  const vocabulary = ["help", "ls", "bisect", "blog/", "clear"];

  it("finds the word a slip away", () => {
    expect(closest("bsiect", vocabulary)).toBe("bisect");
    expect(closest("sl", vocabulary)).toBe("ls");
    expect(closest("HLEP", vocabulary)).toBe("help");
    expect(closest("blog", vocabulary)).toBe("blog/");
  });

  it("allows a longer word a second slip", () => {
    expect(closest("bisecct", vocabulary)).toBe("bisect");
    expect(closest("bsiec", vocabulary)).toBe("bisect");
  });

  it("says nothing when no word is near", () => {
    expect(closest("rm -rf /", vocabulary)).toBeUndefined();
    expect(closest("x", vocabulary)).toBeUndefined();
    expect(closest("heap", ["ls"])).toBeUndefined();
  });

  it("says nothing about a word that is already in the list", () => {
    expect(closest("help", vocabulary)).toBeUndefined();
  });

  it("prefers the nearer word, and the earlier of two equally near", () => {
    expect(closest("cleat", ["clean", "clear"])).toBe("clean");
    expect(closest("clea", ["cleared", "clear"])).toBe("clear");
  });
});

import { describe, expect, it } from "vitest";

import { evaluate, formatArgs, formatError, formatValue, isThenable, toScript } from "./jsConsole";

describe("toScript", () => {
  it("turns a leading const, let or class into a var so it outlives the line", () => {
    expect(toScript("const a = 1")).toBe("var a = 1");
    expect(toScript("  let b = 2")).toBe("var b = 2");
    expect(toScript("class Foo {}")).toBe("var Foo = class Foo {}");
  });

  it("leaves everything else alone", () => {
    expect(toScript("constant + 1")).toBe("constant + 1");
    expect(toScript("[1].map((x) => { const y = x; return y; })")).toBe(
      "[1].map((x) => { const y = x; return y; })",
    );
  });
});

describe("evaluate", () => {
  it("returns what the line came to", () => {
    expect(evaluate("1 + 2")).toEqual({ logs: [], outcome: { kind: "value", value: 3 } });
  });

  it("keeps a declaration for the next line", () => {
    evaluate("const jsConsoleTestValue = 41");
    expect(evaluate("jsConsoleTestValue + 1").outcome).toEqual({ kind: "value", value: 42 });
  });

  it("collects what the line logged, and puts console back afterwards", () => {
    const log = console.log;
    const run = evaluate("console.log('hi', { a: 1 }); console.warn('careful')");
    expect(run.logs).toEqual([
      { tone: "log", text: "hi {a: 1}" },
      { tone: "warn", text: "careful" },
    ]);
    expect(console.log).toBe(log);
  });

  it("reports a thrown error rather than throwing it", () => {
    const { outcome } = evaluate("null.x");
    expect(outcome.kind).toBe("error");
  });

  it("runs a top-level await inside an async function", async () => {
    const { outcome } = evaluate("await Promise.resolve(7)");
    expect(outcome.kind).toBe("value");
    if (outcome.kind !== "value" || !isThenable(outcome.value)) throw new Error("not a promise");
    expect(await outcome.value).toBe(7);
  });
});

describe("formatValue", () => {
  it("prints primitives the way the console does", () => {
    expect(formatValue("it's")).toBe("'it\\'s'");
    expect(formatValue(10n)).toBe("10n");
    expect(formatValue(undefined)).toBe("undefined");
    expect(formatValue(null)).toBe("null");
    expect(formatValue(-0)).toBe("-0");
    expect(formatValue(Symbol("x"))).toBe("Symbol(x)");
  });

  it("names functions and classes", () => {
    expect(formatValue(function greet() {})).toBe("ƒ greet()");
    expect(formatValue(class Point {})).toBe("class Point");
  });

  it("prints arrays, objects, maps and sets on one line", () => {
    expect(formatValue([1, "a", [2, [3, [4]]]])).toBe("[1, 'a', [2, Array(2)]]");
    expect(formatValue({ a: 1, "b-c": true })).toBe("{a: 1, 'b-c': true}");
    expect(formatValue(new Map([["k", 1]]))).toBe("Map(1) {'k' => 1}");
    expect(formatValue(new Set([1, 2]))).toBe("Set(2) {1, 2}");
  });

  it("marks a circular reference instead of following it", () => {
    const loop: Record<string, unknown> = {};
    loop.self = loop;
    expect(formatValue(loop)).toBe("{self: [Circular]}");
  });

  it("names the class of an instance", () => {
    class Point {
      x = 1;
    }
    expect(formatValue(new Point())).toBe("Point {x: 1}");
  });
});

describe("formatArgs and formatError", () => {
  it("prints strings bare among logged arguments", () => {
    expect(formatArgs(["count", 3, "ok"])).toBe("count 3 ok");
  });

  it("prefixes a thrown value with Uncaught", () => {
    expect(formatError(new TypeError("x is not a function"))).toBe(
      "Uncaught TypeError: x is not a function",
    );
    expect(formatError("nope")).toBe("Uncaught 'nope'");
  });
});

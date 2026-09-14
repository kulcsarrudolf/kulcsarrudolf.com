/**
 * `js`: the browser console, at the terminal's prompt. Each line is evaluated
 * in the page's global scope, the way DevTools runs it, and what it logged and
 * what it came to are turned into lines of text for the history.
 */

export const JS_PROMPT = "js >";

/** Node's way out and the words a visitor would try first. */
export const JS_EXIT = new Set([".exit", "exit", "quit", "exit()"]);

export type JsTone = "log" | "info" | "warn" | "error" | "result";

export interface JsLine {
  tone: JsTone;
  text: string;
}

export type JsOutcome = { kind: "value"; value: unknown } | { kind: "error"; error: unknown };

export interface JsRun {
  /** What `console.log` and its siblings printed while the line ran. */
  logs: JsLine[];
  outcome: JsOutcome;
}

const CAPTURED = ["log", "info", "warn", "error", "debug"] as const;
const MAX_DEPTH = 2;
const MAX_ITEMS = 50;
const MAX_TEXT = 4000;

// An indirect eval runs in the global scope rather than this module's.
// oxlint-disable-next-line no-eval -- running what the visitor typed is what the console is for
const globalEval = (script: string): unknown => (0, eval)(script);

/**
 * An indirect eval gives each `const`, `let` and `class` a scope of its own
 * that ends with the line, so `const a = 1` would be gone by the next one.
 * DevTools keeps them, so a declaration at the start of the line becomes a
 * `var`, which lands on the window and stays.
 */
export function toScript(line: string): string {
  return line
    .replace(/^\s*(?:const|let)\s+/, "var ")
    .replace(/^\s*class\s+([A-Za-z_$][\w$]*)/, "var $1 = class $1");
}

/**
 * Runs one line. A line with a top-level `await` is a syntax error to eval,
 * so it is tried again as the body of an async function, which is what the
 * console does with it too.
 */
export function evaluate(line: string, run: (script: string) => unknown = globalEval): JsRun {
  const logs: JsLine[] = [];
  const originals = CAPTURED.map((method) => [method, console[method]] as const);

  for (const [method, original] of originals) {
    console[method] = (...args: unknown[]) => {
      logs.push({ tone: method === "debug" ? "log" : method, text: formatArgs(args) });
      original.apply(console, args);
    };
  }

  try {
    const script = toScript(line);
    try {
      return { logs, outcome: { kind: "value", value: run(script) } };
    } catch (error) {
      if (!(error instanceof SyntaxError) || !/\bawait\b/.test(line)) throw error;
      const body = /^\s*(?:var|const|let|if|for|while|try|throw|return)\b/.test(script)
        ? script
        : `return (${script.replace(/;\s*$/, "")});`;
      return { logs, outcome: { kind: "value", value: run(`(async () => { ${body} })()`) } };
    }
  } catch (error) {
    return { logs, outcome: { kind: "error", error } };
  } finally {
    for (const [method, original] of originals) console[method] = original;
  }
}

export const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  (typeof value === "object" || typeof value === "function") &&
  value !== null &&
  typeof (value as { then?: unknown }).then === "function";

/** A thrown value as the console prints it: `TypeError: x is not a function`. */
export function formatError(error: unknown): string {
  if (error instanceof Error) return `Uncaught ${error.name}: ${error.message}`;
  return `Uncaught ${formatValue(error)}`;
}

/** `console.log`'s arguments: strings as they are, everything else inspected. */
export const formatArgs = (args: unknown[]): string =>
  truncate(args.map((arg) => (typeof arg === "string" ? arg : formatValue(arg))).join(" "));

const truncate = (text: string) =>
  text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}… (${text.length - MAX_TEXT} more)` : text;

const quote = (text: string) => `'${text.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

const KEY = /^[A-Za-z_$][\w$]*$/;

function describeNode(node: Node): string {
  if (node.nodeType === 9) return "#document";
  if (node.nodeType === 3) return quote(node.textContent ?? "");
  if (!(node instanceof Element)) return node.nodeName.toLowerCase();
  const id = node.id ? `#${node.id}` : "";
  const classes = [...node.classList]
    .slice(0, 3)
    .map((name) => `.${name}`)
    .join("");
  return `<${node.tagName.toLowerCase()}${id}${classes}>`;
}

/** A value the way the console sums it up on one line. */
export function formatValue(value: unknown): string {
  return truncate(inspect(value, 0, new WeakSet()));
}

function inspect(value: unknown, depth: number, seen: WeakSet<object>): string {
  switch (typeof value) {
    case "string":
      return quote(value);
    case "bigint":
      return `${value}n`;
    case "symbol":
      return value.toString();
    case "undefined":
      return "undefined";
    case "function": {
      const source = Function.prototype.toString.call(value);
      if (source.startsWith("class")) return `class ${value.name || "(anonymous)"}`;
      return `ƒ ${value.name || "anonymous"}()`;
    }
    case "number":
    case "boolean":
      return Object.is(value, -0) ? "-0" : String(value);
  }

  if (value === null) return "null";
  const object = value as object;

  if (typeof Window !== "undefined" && object instanceof Window) return "Window";
  if (typeof Node !== "undefined" && object instanceof Node) return describeNode(object);
  if (object instanceof Error) return `${object.name}: ${object.message}`;
  if (object instanceof Date)
    return Number.isNaN(object.getTime()) ? "Invalid Date" : object.toISOString();
  if (object instanceof RegExp) return String(object);
  if (isThenable(object)) return "Promise";
  if (seen.has(object)) return "[Circular]";

  const nested = depth >= MAX_DEPTH;
  seen.add(object);

  try {
    if (Array.isArray(object)) {
      if (nested) return `Array(${object.length})`;
      const items = object.slice(0, MAX_ITEMS).map((item) => inspect(item, depth + 1, seen));
      if (object.length > MAX_ITEMS) items.push(`… ${object.length - MAX_ITEMS} more`);
      return `[${items.join(", ")}]`;
    }

    if (object instanceof Map) {
      if (nested) return `Map(${object.size})`;
      const items = [...object]
        .slice(0, MAX_ITEMS)
        .map(
          ([key, item]) => `${inspect(key, depth + 1, seen)} => ${inspect(item, depth + 1, seen)}`,
        );
      return `Map(${object.size}) {${items.join(", ")}}`;
    }

    if (object instanceof Set) {
      if (nested) return `Set(${object.size})`;
      const items = [...object].slice(0, MAX_ITEMS).map((item) => inspect(item, depth + 1, seen));
      return `Set(${object.size}) {${items.join(", ")}}`;
    }

    const name = Object.getPrototypeOf(object)?.constructor?.name;
    const prefix = name && name !== "Object" ? `${name} ` : "";
    if (nested) return `${prefix}{…}`;

    const keys = Object.keys(object);
    const entries = keys.slice(0, MAX_ITEMS).map((key) => {
      const label = KEY.test(key) ? key : quote(key);
      return `${label}: ${inspect((object as Record<string, unknown>)[key], depth + 1, seen)}`;
    });
    if (keys.length > MAX_ITEMS) entries.push(`… ${keys.length - MAX_ITEMS} more`);
    return `${prefix}{${entries.join(", ")}}`;
  } catch {
    return "{…}";
  } finally {
    seen.delete(object);
  }
}

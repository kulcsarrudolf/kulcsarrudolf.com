/**
 * What the prompt offers to finish the line with. A pure step from what has
 * been typed and what was typed on earlier visits to the candidates, best
 * first, so the hook only has to hold which one is showing.
 *
 * The shell offers what `help` lists, then the pages, then the other
 * spellings, then the visitor's own history. The two commands `help` leaves
 * out are in none of the lists, so they are only ever offered back to
 * somebody who has already found them.
 */

import { ALIASES, DESTINATIONS, LISTED, NAVIGATE_PREFIXES, runCommand } from "./commands";
import { JS_EXIT } from "./jsConsole";
import { completeProperty } from "./jsCompletion";

export type CandidateSource = "command" | "history" | "property";

/** What a candidate is, in a word: the key of the line that describes it. */
export type CandidateHint =
  | "help"
  | "list"
  | "intro"
  | "sendMessage"
  | "jsConsole"
  | "bisect"
  | "quote"
  | "clear"
  | "navigate"
  | "exit"
  | "method"
  | "property"
  | "history";

export interface Candidate {
  /** The whole line, as it would stand at the prompt once taken. */
  value: string;
  source: CandidateSource;
  hint: CandidateHint;
  /** The page it opens, for a line that opens one. */
  page?: string;
}

/** More than this is a list to read rather than a row to pick from. */
export const MAX_CANDIDATES = 8;

const startsWith = (value: string, typed: string) =>
  value.length > typed.length && value.toLowerCase().startsWith(typed.toLowerCase());

/**
 * The lines of the history that carry on from `typed`, each once, the ones
 * typed most and latest first. An occurrence counts for less the further back
 * it is, so a command run three times last month loses to one run twice today.
 */
export function rankHistory(history: readonly string[], typed: string): string[] {
  const scores = new Map<string, number>();

  history.forEach((line, index) => {
    const value = line.trim();
    if (!startsWith(value, typed)) return;
    const age = history.length - 1 - index;
    scores.set(value, (scores.get(value) ?? 0) + 1 / (1 + age));
  });

  return [...scores].sort(([, a], [, b]) => b - a).map(([value]) => value);
}

const HINTS = new Set<string>([
  "help",
  "list",
  "intro",
  "sendMessage",
  "jsConsole",
  "bisect",
  "quote",
  "clear",
] satisfies CandidateHint[]);

/** A command from the lists, described by what running it would do. */
function listed(value: string): Candidate[] {
  const result = runCommand(value);
  if (result.kind === "navigate") {
    return [{ value, source: "command", hint: "navigate", page: result.destination.label }];
  }
  return HINTS.has(result.kind)
    ? [{ value, source: "command", hint: result.kind as CandidateHint }]
    : [];
}

/** Each value once, the first of its candidates kept, and no more than fit the row. */
function unique(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return candidates
    .filter(({ value }) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_CANDIDATES);
}

/** `cd bl` is on its way to `cd blog/`: after a verb that opens a page, the pages. */
function completeArgument(typed: string): string[] {
  const lower = typed.toLowerCase();
  const prefix = NAVIGATE_PREFIXES.find((candidate) => lower.startsWith(candidate));
  if (!prefix) return [];

  const target = typed.slice(prefix.length);
  return DESTINATIONS.filter(({ label }) => label.startsWith(target.toLowerCase())).map(
    ({ label }) => `${typed.slice(0, prefix.length)}${label}`,
  );
}

/** What the shell's prompt offers for the line so far. Nothing for an empty one. */
export function completeShell(input: string, history: readonly string[]): Candidate[] {
  const typed = input.trimStart();
  if (typed === "") return [];

  const pages = DESTINATIONS.map(({ label }) => label);
  const known = [...LISTED, ...pages, ...completeArgument(typed), ...ALIASES]
    .filter((value) => startsWith(value, typed))
    .flatMap(listed);

  // A line the shell never understood is a typo or JavaScript, and offering
  // it back would only have it fail a second time. `js <code>` is kept as it
  // was typed, since its spacing is the program's.
  const remembered = rankHistory(history, typed)
    .filter((value) => runCommand(value).kind !== "notFound")
    .map((value): Candidate => ({ value, source: "history", hint: "history" }));

  return unique([...known, ...remembered]);
}

/**
 * The history's JavaScript: what was typed into the console, and the code of
 * each `js <code>` run from the shell. The history does not say which prompt
 * a line was typed at, so a line counts as JavaScript when the shell could
 * make nothing of it, not even a guess at what it was meant to be.
 */
function rememberedScripts(history: readonly string[]): string[] {
  return history.flatMap((line) => {
    if (JS_EXIT.has(line.trim())) return [];
    const result = runCommand(line);
    if (result.kind === "jsEval") return [result.code];
    return result.kind === "notFound" && !result.suggestion ? [line] : [];
  });
}

/**
 * What the `js` console offers: the names on the objects in the page, then
 * the way out, then the JavaScript typed before. `root` is the global object
 * the names are read off.
 */
export function completeJs(input: string, history: readonly string[], root: object): Candidate[] {
  const typed = input.trimStart();
  if (typed === "") return [];

  const properties = completeProperty(typed, root).map(({ value, method }): Candidate => ({
    value,
    source: "property",
    hint: method ? "method" : "property",
  }));

  const exit: Candidate[] = startsWith(".exit", typed)
    ? [{ value: ".exit", source: "command", hint: "exit" }]
    : [];

  const remembered = rankHistory(rememberedScripts(history), typed)
    // The console minds its capitals, so only a line that carries on exactly.
    .filter((value) => value.startsWith(typed))
    .map((value): Candidate => ({ value, source: "history", hint: "history" }));

  return unique([...properties, ...exit, ...remembered]);
}

/**
 * The rest of the candidate, to show after what has been typed. The case of
 * what was typed is left alone until the candidate is taken, and then the
 * line becomes the candidate as it is spelled.
 */
export function ghostOf(input: string, candidate: Candidate | undefined): string {
  if (!candidate) return "";
  const typed = input.trimStart();
  if (!candidate.value.toLowerCase().startsWith(typed.toLowerCase())) return "";
  return candidate.value.slice(typed.length);
}

/** The next word of the ghost, with the space before it: what Alt+Right takes. */
export function nextWord(ghost: string): string {
  return /^\s*\S+/.exec(ghost)?.[0] ?? ghost;
}

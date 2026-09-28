/**
 * What the terminal understands. A pure lookup from the typed line to what
 * should happen, so the component only has to render outcomes.
 */

import quotes from "@/content/quotes";
import type { Quote } from "@/types/quote";

import { closest } from "./didYouMean";

// The three places the intro points at. The labels are paths rather than
// copy, so they are the same in every language.
export const DESTINATIONS = [
  { to: "/blog", label: "blog/" },
  { to: "/projects", label: "projects/" },
  { to: "/contact", label: "contact/" },
] as const;

export type Destination = (typeof DESTINATIONS)[number];

export type CommandResult =
  /** An empty line: a fresh prompt and nothing else. */
  | { kind: "empty" }
  /** `./intro.sh`: the intro sentence and the "where next" links. */
  | { kind: "intro" }
  /** `ls`: the "where next" links on their own. */
  | { kind: "list" }
  | { kind: "help" }
  | { kind: "clear" }
  /** The countdown to the wedding, printed in the window. */
  | { kind: "wedding" }
  /** The sudoku, opened over the page. */
  | { kind: "sudoku" }
  /** `bisect`: the cut-it-in-half game, opened over the page. */
  | { kind: "bisect" }
  /** `send-message`: the contact form, asked one question at a time. */
  | { kind: "sendMessage" }
  /** `js`: the browser console at the prompt, until `.exit`. */
  | { kind: "jsConsole" }
  /** `js <code>`: one line run in the page, as typed, and the shell straight back. */
  | { kind: "jsEval"; code: string }
  /** `random-quote`: one line from the quotes, picked when it is run. */
  | { kind: "quote"; quote: Quote }
  | { kind: "navigate"; destination: Destination }
  /** Nothing by that name. `suggestion` is the command it was probably meant to be. */
  | { kind: "notFound"; command: string; suggestion?: string };

const INTRO = new Set(["./intro.sh", "intro.sh", "intro", "sh intro.sh", "bash intro.sh"]);
const LIST = new Set(["ls", "ls -la", "ls -l", "ll", "dir"]);
const HELP = new Set(["help", "?", "--help", "-h", "man"]);
const CLEAR = new Set(["clear", "cls"]);
// `mail` is the name a shell would have for it, so it works without being listed.
const SEND_MESSAGE = new Set(["send-message", "mail"]);
// `node` is what a developer's fingers type for a REPL, so it opens the same one.
const JS_CONSOLE = new Set(["js", "node", "javascript"]);
// `git bisect` halves a range of commits the way the game halves a shape, so
// it opens the game too, as do the plain-words name and the game it is after.
const BISECT = new Set([
  "bisect",
  "git bisect",
  "./bisect.sh",
  "bisect.sh",
  "sh bisect.sh",
  "bash bisect.sh",
  "cut-in-half",
  "cutinhalf",
  "cutle",
]);
// `fortune` is the Unix program that does the same, so it answers too.
const QUOTE = new Set(["random-quote", "quote", "fortune"]);

// Two things `help` does not mention, because finding them is the point.
const WEDDING = new Set([
  "nr",
  "rn",
  "nr-wedding",
  "rn-wedding",
  "rudolf-and-nora",
  "rudolf-es-nora",
  "rudolf-és-nóra",
]);
const SUDOKU = new Set(["sudoku", "./sudoku.sh", "sudoku.sh", "sh sudoku.sh", "bash sudoku.sh"]);

// `blog`, `blog/`, `cd blog`, `open blog/`, `cat blog` all open the page.
export const NAVIGATE_PREFIXES = ["cd ", "open ", "cat ", "go "];

/** What `help` lists, in its order: the names the prompt offers first. */
export const LISTED = [
  "help",
  "ls",
  "./intro.sh",
  "send-message",
  "js",
  "bisect",
  "random-quote",
  "quote",
  "clear",
];

/**
 * The other spellings of what `help` lists. The wedding and the sudoku are in
 * neither list, so the prompt never gives away what is there to be found.
 */
export const ALIASES = [
  ...HELP,
  ...LIST,
  ...INTRO,
  ...SEND_MESSAGE,
  ...JS_CONSOLE,
  ...BISECT,
  ...QUOTE,
  ...CLEAR,
].filter((name) => !LISTED.includes(name));

const findDestination = (name: string): Destination | undefined =>
  DESTINATIONS.find(({ to }) => to === `/${name}`);

const PAGES = DESTINATIONS.map(({ to }) => to.slice(1));
const VOCABULARY = [...LISTED, ...PAGES, ...ALIASES];

/** A page is offered the way the intro spells it, with its slash. */
const spell = (name: string) => findDestination(name)?.label ?? name;

/** What a line that matched nothing was probably meant to be, if anything is near. */
function suggest(lower: string, prefix: string | undefined, name: string): string | undefined {
  if (prefix) {
    const page = closest(name, PAGES);
    return page && `${prefix}${spell(page)}`;
  }

  const word = closest(lower, VOCABULARY);
  return word && spell(word);
}

/**
 * Turns the typed line into what the terminal should do about it. `random`
 * picks the quote, so a test can say which one it gets.
 */
export function runCommand(line: string, random: () => number = Math.random): CommandResult {
  const command = line.trim().replace(/\s+/g, " ");

  if (command === "") return { kind: "empty" };

  const lower = command.toLowerCase();

  if (INTRO.has(lower)) return { kind: "intro" };
  if (LIST.has(lower)) return { kind: "list" };
  if (HELP.has(lower)) return { kind: "help" };
  if (CLEAR.has(lower)) return { kind: "clear" };
  if (SUDOKU.has(lower)) return { kind: "sudoku" };
  if (BISECT.has(lower)) return { kind: "bisect" };
  if (SEND_MESSAGE.has(lower)) return { kind: "sendMessage" };
  if (JS_CONSOLE.has(lower)) return { kind: "jsConsole" };
  if (QUOTE.has(lower)) {
    return { kind: "quote", quote: quotes[Math.floor(random() * quotes.length)] };
  }

  // The code is taken from the line as typed: its case and spacing are the program's.
  const jsEval = /^\s*js\s+([\s\S]+)$/i.exec(line);
  if (jsEval) return { kind: "jsEval", code: jsEval[1].trim() };

  const prefix = NAVIGATE_PREFIXES.find((candidate) => lower.startsWith(candidate));
  const target = prefix ? lower.slice(prefix.length) : lower;
  const name = target.replace(/\/+$/, "");

  if (WEDDING.has(name)) return { kind: "wedding" };

  const destination = findDestination(name);
  if (destination) return { kind: "navigate", destination };

  const suggestion = suggest(lower, prefix, name);
  return suggestion ? { kind: "notFound", command, suggestion } : { kind: "notFound", command };
}

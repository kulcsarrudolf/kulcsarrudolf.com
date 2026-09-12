/**
 * What the terminal understands. A pure lookup from the typed line to what
 * should happen, so the component only has to render outcomes.
 */

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
  | { kind: "navigate"; destination: Destination }
  | { kind: "notFound"; command: string };

const INTRO = new Set(["./intro.sh", "intro.sh", "intro", "sh intro.sh", "bash intro.sh"]);
const LIST = new Set(["ls", "ls -la", "ls -l", "ll", "dir"]);
const HELP = new Set(["help", "?", "--help", "-h", "man"]);
const CLEAR = new Set(["clear", "cls"]);

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
const NAVIGATE_PREFIXES = ["cd ", "open ", "cat ", "go "];

const findDestination = (name: string): Destination | undefined =>
  DESTINATIONS.find(({ to }) => to === `/${name}`);

/** Turns the typed line into what the terminal should do about it. */
export function runCommand(line: string): CommandResult {
  const command = line.trim().replace(/\s+/g, " ");

  if (command === "") return { kind: "empty" };

  const lower = command.toLowerCase();

  if (INTRO.has(lower)) return { kind: "intro" };
  if (LIST.has(lower)) return { kind: "list" };
  if (HELP.has(lower)) return { kind: "help" };
  if (CLEAR.has(lower)) return { kind: "clear" };
  if (SUDOKU.has(lower)) return { kind: "sudoku" };

  const prefix = NAVIGATE_PREFIXES.find((candidate) => lower.startsWith(candidate));
  const target = prefix ? lower.slice(prefix.length) : lower;
  const name = target.replace(/\/+$/, "");

  if (WEDDING.has(name)) return { kind: "wedding" };

  const destination = findDestination(name);
  if (destination) return { kind: "navigate", destination };

  return { kind: "notFound", command };
}

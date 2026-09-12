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
  | { kind: "navigate"; destination: Destination }
  | { kind: "notFound"; command: string };

const INTRO = new Set(["./intro.sh", "intro.sh", "intro", "sh intro.sh", "bash intro.sh"]);
const LIST = new Set(["ls", "ls -la", "ls -l", "ll", "dir"]);
const HELP = new Set(["help", "?", "--help", "-h", "man"]);
const CLEAR = new Set(["clear", "cls"]);

// `blog`, `blog/`, `cd blog`, `open blog/`, `cat blog` all open the page.
const NAVIGATE_PREFIXES = ["cd ", "open ", "cat ", "go "];

const findDestination = (word: string): Destination | undefined => {
  const name = word.replace(/\/+$/, "");
  return DESTINATIONS.find(({ to }) => to === `/${name}`);
};

/** Turns the typed line into what the terminal should do about it. */
export function runCommand(line: string): CommandResult {
  const command = line.trim().replace(/\s+/g, " ");

  if (command === "") return { kind: "empty" };

  const lower = command.toLowerCase();

  if (INTRO.has(lower)) return { kind: "intro" };
  if (LIST.has(lower)) return { kind: "list" };
  if (HELP.has(lower)) return { kind: "help" };
  if (CLEAR.has(lower)) return { kind: "clear" };

  const prefix = NAVIGATE_PREFIXES.find((candidate) => lower.startsWith(candidate));
  const target = prefix ? lower.slice(prefix.length) : lower;
  const destination = findDestination(target);
  if (destination) return { kind: "navigate", destination };

  return { kind: "notFound", command };
}

// Pure functions over the text of /etc/hosts. scripts/dev-setup.ts reads the
// file, runs it through one of these and writes the result back with sudo
// only when something changed.

const MARKER = "# kulcsarrudolf.com dev, managed by dev:setup";
// What the marker read before it stopped naming the package manager. A machine
// set up back then still has it in /etc/hosts, so it is recognised and never
// written.
const LEGACY_MARKER = "# kulcsarrudolf.com dev, managed by yarn dev:setup";

function block(host: string, marker = MARKER): string[] {
  return [marker, `127.0.0.1\t${host}`, `::1\t${host}`];
}

/** The index of the marked block for `host`, under either marker, or -1. */
function findBlock(lines: string[], host: string): number {
  for (const marker of [MARKER, LEGACY_MARKER]) {
    const start = lines.indexOf(marker);
    const wanted = block(host, marker);
    if (start !== -1 && wanted.every((line, i) => lines[start + i] === line)) return start;
  }
  return -1;
}

function splitLines(content: string): string[] {
  const lines = content.split("\n");
  // A trailing newline yields an empty last element; drop it so the joined
  // result does not gain a blank line each time it is rewritten.
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

/** The content with the marked block for `host` appended, or unchanged if it is already there. */
export function withHostEntries(content: string, host: string): string {
  const lines = splitLines(content);
  if (findBlock(lines, host) !== -1) return content;
  return [...lines, "", ...block(host)].join("\n") + "\n";
}

/** The content with the marked block for `host` removed, or unchanged if it is absent. */
export function withoutHostEntries(content: string, host: string): string {
  const lines = splitLines(content);
  const marker = findBlock(lines, host);
  if (marker === -1) return content;
  const end = marker + block(host).length;
  // The blank line withHostEntries put in front of the block goes with it.
  const start = lines[marker - 1] === "" ? marker - 1 : marker;
  return [...lines.slice(0, start), ...lines.slice(end)].join("\n") + "\n";
}

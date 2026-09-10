// Pure functions over the text of /etc/hosts. scripts/dev-setup.ts reads the
// file, runs it through one of these and writes the result back with sudo
// only when something changed.

const MARKER = "# kulcsarrudolf.com dev, managed by yarn dev:setup";

function block(host: string): string[] {
  return [MARKER, `127.0.0.1\t${host}`, `::1\t${host}`];
}

function hasBlock(lines: string[], host: string): boolean {
  const wanted = block(host);
  const start = lines.indexOf(MARKER);
  return start !== -1 && wanted.every((line, i) => lines[start + i] === line);
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
  if (hasBlock(lines, host)) return content;
  return [...lines, "", ...block(host)].join("\n") + "\n";
}

/** The content with the marked block for `host` removed, or unchanged if it is absent. */
export function withoutHostEntries(content: string, host: string): string {
  const lines = splitLines(content);
  if (!hasBlock(lines, host)) return content;
  const marker = lines.indexOf(MARKER);
  const end = marker + block(host).length;
  // The blank line withHostEntries put in front of the block goes with it.
  const start = lines[marker - 1] === "" ? marker - 1 : marker;
  return [...lines.slice(0, start), ...lines.slice(end)].join("\n") + "\n";
}

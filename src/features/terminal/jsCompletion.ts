/**
 * What the `js` console offers for the name being typed: `document.ti` is on
 * its way to `document.title`. The names are read off the objects in the page
 * rather than off a list, so a variable declared a line ago completes too.
 *
 * Nothing the visitor wrote is run to find them. The path is walked one name
 * at a time, through plain values and the browser's own getters only, and the
 * last name is matched against the keys without its value ever being read.
 */

export interface PropertyMatch {
  /** The whole line with the name completed. */
  value: string;
  /** Known to be a function, which only a plain value can say without being run. */
  method: boolean;
}

const MAX_MATCHES = 50;

const NAME = /^[A-Za-z_$][\w$]*$/;
// The dotted path the line ends in, and the part of a name after its last dot.
const TAIL = /((?:[A-Za-z_$][\w$]*\.)*)([A-Za-z_$][\w$]*)?$/;

// What a console is opened to poke at, offered ahead of the hundreds of other globals.
const FAVOURITES = [
  "document",
  "window",
  "console",
  "navigator",
  "location",
  "localStorage",
  "history",
  "Math",
  "JSON",
  "Date",
  "fetch",
];

/** Inside a string the dots and names are text, and completing them would be wrong. */
function insideString(text: string): boolean {
  let open: string | null = null;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === "\\") index++;
    else if (open === null && (char === "'" || char === '"' || char === "`")) open = char;
    else if (char === open) open = null;
  }

  return open !== null;
}

function describe(target: object, key: string): PropertyDescriptor | undefined {
  for (let owner: object | null = target; owner; owner = Object.getPrototypeOf(owner)) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
    if (descriptor) return descriptor;
  }
  return undefined;
}

const isNative = (getter: () => unknown) =>
  Function.prototype.toString.call(getter).includes("[native code]");

/** The value at the end of the path, or nothing where reading it would run somebody's code. */
function resolve(root: object, path: string[]): unknown {
  let value: unknown = root;

  for (const key of path) {
    if (value === null || value === undefined) return undefined;
    const target = Object(value) as object;
    const descriptor = describe(target, key);
    if (!descriptor) return undefined;

    if ("value" in descriptor) value = descriptor.value;
    else if (descriptor.get && isNative(descriptor.get)) value = descriptor.get.call(value);
    else return undefined;
  }

  return value;
}

/** Every name on the object, its own first and then each prototype's, alphabetical within each. */
function keysOf(target: object): string[] {
  const seen = new Set<string>();

  for (let owner: object | null = target; owner; owner = Object.getPrototypeOf(owner)) {
    const names = Object.getOwnPropertyNames(owner)
      .filter((name) => NAME.test(name))
      .sort();
    for (const name of names) seen.add(name);
  }

  return [...seen];
}

function globalsOf(root: object): string[] {
  const rest = keysOf(root)
    .filter((name) => !FAVOURITES.includes(name))
    // The short names first: the long tail of globals is mostly constructors.
    .sort((a, b) => a.length - b.length);
  return [...FAVOURITES.filter((name) => describe(root, name)), ...rest];
}

/**
 * The names that finish what the line ends in, best first. Those that carry
 * on exactly what was typed come before those that only match it in another
 * case, since only the first kind can be shown as the rest of the word.
 */
export function completeProperty(line: string, root: object): PropertyMatch[] {
  const tail = TAIL.exec(line);
  if (!tail) return [];

  const [, dotted, partial = ""] = tail;
  if (dotted === "" && partial === "") return [];

  const head = line.slice(0, tail.index);
  // `items[0].na` and `make().na` end in a path that starts somewhere unknown.
  if (/[.)\]]$/.test(head) || insideString(head)) return [];

  try {
    const path = dotted.split(".").filter(Boolean);
    const owner = resolve(root, path);
    if (owner === null || owner === undefined) return [];

    const target = Object(owner) as object;
    const names = path.length === 0 ? globalsOf(target) : keysOf(target);
    const lower = partial.toLowerCase();

    // With part of the name typed the shortest match is the likeliest:
    // `document.ti` is after `title` sooner than `timeline`.
    const nearest = (matches: string[]) =>
      partial === "" ? matches : matches.sort((a, b) => a.length - b.length);

    const exact = nearest(names.filter((name) => name.startsWith(partial) && name !== partial));
    const loose = nearest(
      names.filter((name) => !name.startsWith(partial) && name.toLowerCase().startsWith(lower)),
    );

    return [...exact, ...loose].slice(0, MAX_MATCHES).map((name) => ({
      value: `${head}${dotted}${name}`,
      method: typeof describe(target, name)?.value === "function",
    }));
  } catch {
    // A proxy or a cross-origin window can refuse to be looked at.
    return [];
  }
}

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DARK_CLASS,
  DEFAULT_THEME,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  readDocumentTheme,
  readStoredTheme,
  storeTheme,
} from "./theme";

// A localStorage and a document just big enough for the module: the tests
// run in node, where neither exists.
const fakeStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    store,
  };
};

const fakeDocument = () => {
  const classes = new Set<string>();
  return {
    documentElement: {
      classList: {
        contains: (name: string) => classes.has(name),
        add: (name: string) => void classes.add(name),
        toggle: (name: string, force: boolean) =>
          void (force ? classes.add(name) : classes.delete(name)),
      },
    },
    classes,
  };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isTheme", () => {
  it("accepts only the two themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("auto")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("readStoredTheme", () => {
  it("is light on the server", () => {
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });

  it("is light when nothing is stored", () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", fakeStorage());
    expect(readStoredTheme()).toBe("light");
  });

  it("reads a stored dark theme back", () => {
    const storage = fakeStorage();
    storage.store.set(THEME_STORAGE_KEY, "dark");
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", storage);
    expect(readStoredTheme()).toBe("dark");
  });

  it("ignores a value that is not a theme", () => {
    const storage = fakeStorage();
    storage.store.set(THEME_STORAGE_KEY, "sepia");
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", storage);
    expect(readStoredTheme()).toBe("light");
  });

  it("is light when storage throws", () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
    });
    expect(readStoredTheme()).toBe("light");
  });
});

describe("storeTheme", () => {
  it("stores dark and clears light", () => {
    const storage = fakeStorage();
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", storage);

    storeTheme("dark");
    expect(storage.store.get(THEME_STORAGE_KEY)).toBe("dark");

    storeTheme("light");
    expect(storage.store.has(THEME_STORAGE_KEY)).toBe(false);
  });
});

describe("applyTheme and readDocumentTheme", () => {
  it("toggles the class on the document", () => {
    const doc = fakeDocument();
    vi.stubGlobal("document", doc);

    expect(readDocumentTheme()).toBe("light");

    applyTheme("dark");
    expect(doc.classes.has(DARK_CLASS)).toBe(true);
    expect(readDocumentTheme()).toBe("dark");

    applyTheme("light");
    expect(doc.classes.has(DARK_CLASS)).toBe(false);
    expect(readDocumentTheme()).toBe("light");
  });
});

describe("THEME_BOOTSTRAP_SCRIPT", () => {
  const run = (stored: string | null) => {
    const storage = fakeStorage();
    if (stored !== null) storage.store.set(THEME_STORAGE_KEY, stored);
    const doc = fakeDocument();
    // The script is inlined into <head>, so it is run the way a browser would:
    // as plain source against the globals it expects.
    new Function("localStorage", "document", THEME_BOOTSTRAP_SCRIPT)(storage, doc);
    return doc.classes;
  };

  it("adds the class before paint when dark is stored", () => {
    expect(run("dark").has(DARK_CLASS)).toBe(true);
  });

  it("leaves the served light document alone otherwise", () => {
    expect(run(null).has(DARK_CLASS)).toBe(false);
    expect(run("light").has(DARK_CLASS)).toBe(false);
  });

  it("survives storage that throws", () => {
    const doc = fakeDocument();
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(() =>
      new Function("localStorage", "document", THEME_BOOTSTRAP_SCRIPT)(broken, doc),
    ).not.toThrow();
    expect(doc.classes.has(DARK_CLASS)).toBe(false);
  });
});

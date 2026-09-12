/**
 * The colour theme: light, which every visit opens in, or dark, which the
 * bulb in the navbar switches to. The choice is kept in localStorage the way
 * the language is, and is read back before the first paint by the inline
 * script below, so a dark page never flashes light on the way in.
 *
 * The theme itself is the `dark` class on <html>; see `@custom-variant dark`
 * in globals.css. Nothing here follows the OS setting on purpose: the site
 * is light by default, and the visitor decides otherwise.
 */
export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export const THEME_STORAGE_KEY = "kulcsarrudolf-theme";

/** The class on <html> that the `dark:` variant looks for. */
export const DARK_CLASS = "dark";

export const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

/**
 * Runs in <head> before anything is painted. It has to be a string, since it
 * is inlined into the document rather than bundled, so it stays short and
 * free of anything that would need transpiling. Only "dark" is acted on:
 * light is the document as served.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="dark")document.documentElement.classList.add(${JSON.stringify(DARK_CLASS)})}catch(e){}})()`;

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Private browsing and blocked storage both throw. The page is light.
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (theme === DEFAULT_THEME) {
      // Nothing stored means the default, so the default leaves no trace.
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
}

/** What the document is showing right now, read off <html>. */
export function readDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  return document.documentElement.classList.contains(DARK_CLASS) ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
}

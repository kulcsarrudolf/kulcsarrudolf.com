import { useCallback, useSyncExternalStore } from "react";

import {
  DEFAULT_THEME,
  type Theme,
  applyTheme,
  readDocumentTheme,
  readStoredTheme,
  storeTheme,
} from "@/lib/theme";

// Every toggle on the page shares one store, so the bulb in the bar and the
// one in the menu sheet never disagree about which way the switch is set.
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  // Another tab switching the theme switches this one too: the stored value
  // is the choice, and the document follows it.
  const onStorage = () => {
    applyTheme(readStoredTheme());
    notify();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

// The server does not know the visitor's choice, so it renders the switch
// off; the inline script in RootDocument has already set the class by the
// time React reads the document here, and the switch catches up on hydration
// without a mismatch.
const getServerSnapshot = (): Theme => DEFAULT_THEME;

/** The current theme and a way to set it. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readDocumentTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    storeTheme(next);
    notify();
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [setTheme, theme],
  );

  return { theme, setTheme, toggleTheme };
}

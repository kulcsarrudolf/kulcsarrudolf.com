/**
 * The lines typed at the terminal's prompt, oldest first, kept in
 * localStorage so the arrow keys still reach them on the next visit.
 *
 * Only what was typed as a command or into the `js` console is kept: the
 * answers to `send-message` are a name, an email and a message, and none of
 * that belongs in storage.
 */
export const HISTORY_STORAGE_KEY = "kulcsarrudolf-terminal-history";

// Plenty to arrow back through, not enough to fill anyone's storage.
export const MAX_HISTORY = 100;

export type HistoryDirection = "up" | "down";

/** What was stored, or nothing when it is missing or not a list of lines. */
export function parseHistory(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is string => typeof line === "string").slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

/**
 * The history with `line` at its end. A blank line is not a command, and
 * running the same one twice in a row is kept once, the way a shell does.
 */
export function pushHistory(history: string[], line: string): string[] {
  if (line.trim() === "" || history.at(-1) === line) return history;
  return [...history, line].slice(-MAX_HISTORY);
}

/**
 * Where an arrow key moves the cursor: `null` is the line being typed, below
 * the newest entry. Up stops at the oldest entry, and down past the newest
 * one comes back to the line being typed.
 */
export function stepHistory(
  length: number,
  cursor: number | null,
  direction: HistoryDirection,
): number | null {
  if (length === 0) return null;

  if (direction === "up") {
    return cursor === null ? length - 1 : Math.max(cursor - 1, 0);
  }

  if (cursor === null || cursor >= length - 1) return null;
  return cursor + 1;
}

export function readHistory(): string[] {
  if (typeof window === "undefined") return [];

  try {
    return parseHistory(localStorage.getItem(HISTORY_STORAGE_KEY));
  } catch {
    // Private browsing and blocked storage both throw. The history is empty.
    return [];
  }
}

export function storeHistory(history: string[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn("Failed to save terminal history to localStorage:", error);
  }
}

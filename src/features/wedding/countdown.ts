/**
 * When the wedding is and how long is left until it. Pure, so the page at
 * /nr and the terminal's hidden `nr` command count down to the same instant.
 */

export const WEDDING_DATE = new Date(2026, 10, 28, 10, 0, 0);

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** What is left until the wedding, or `null` once the day has come. */
export function getTimeLeft(now: number = Date.now()): TimeLeft | null {
  const diff = WEDDING_DATE.getTime() - now;

  if (diff <= 0) {
    return null;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

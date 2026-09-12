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

export type TimeUnit = keyof TimeLeft;

const UNITS: TimeUnit[] = ["days", "hours", "minutes", "seconds"];

/** A unit's name in the two shapes a count needs: `1 hour`, `2 hours`. */
export interface UnitLabel {
  one: string;
  other: string;
}

/** The name to print beside a count. */
export function unitLabel(label: UnitLabel, value: number): string {
  return value === 1 ? label.one : label.other;
}

/**
 * The units worth printing on one line: the ones that are not zero, so the
 * wait reads `77 days · 45 min · 05 sec` rather than carrying an empty
 * `00 hours` through the months. In the last second there is nothing left to
 * drop, so seconds stay.
 */
export function getCountdownUnits(timeLeft: TimeLeft): { unit: TimeUnit; value: number }[] {
  const left = UNITS.filter((unit) => timeLeft[unit] !== 0);
  const units = left.length > 0 ? left : ["seconds" as TimeUnit];

  return units.map((unit) => ({ unit, value: timeLeft[unit] }));
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

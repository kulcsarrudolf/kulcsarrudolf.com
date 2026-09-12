import { describe, expect, it } from "vitest";

import { WEDDING_DATE, getCountdownUnits, getTimeLeft, unitLabel } from "./countdown";

const AT = (offset: number) => WEDDING_DATE.getTime() - offset;

describe("getTimeLeft", () => {
  it("splits what is left into days, hours, minutes and seconds", () => {
    const offset = ((2 * 24 + 3) * 60 + 4) * 60_000 + 5_000;

    expect(getTimeLeft(AT(offset))).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it("counts the last second", () => {
    expect(getTimeLeft(AT(1_000))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
  });

  it("is null from the moment the wedding starts", () => {
    expect(getTimeLeft(WEDDING_DATE.getTime())).toBeNull();
    expect(getTimeLeft(WEDDING_DATE.getTime() + 1_000)).toBeNull();
  });
});

describe("getCountdownUnits", () => {
  it("leaves out the units that are zero", () => {
    const units = getCountdownUnits({ days: 77, hours: 0, minutes: 45, seconds: 5 });

    expect(units).toEqual([
      { unit: "days", value: 77 },
      { unit: "minutes", value: 45 },
      { unit: "seconds", value: 5 },
    ]);
  });

  it("keeps every unit that has something left in it", () => {
    const units = getCountdownUnits({ days: 2, hours: 3, minutes: 4, seconds: 5 });

    expect(units.map(({ unit }) => unit)).toEqual(["days", "hours", "minutes", "seconds"]);
  });

  it("keeps the seconds when there is nothing left to drop", () => {
    expect(getCountdownUnits({ days: 0, hours: 0, minutes: 0, seconds: 0 })).toEqual([
      { unit: "seconds", value: 0 },
    ]);
  });
});

describe("unitLabel", () => {
  const hours = { one: "hour", other: "hours" };

  it("is singular for exactly one", () => {
    expect(unitLabel(hours, 1)).toBe("hour");
  });

  it("is plural for anything else", () => {
    expect(unitLabel(hours, 0)).toBe("hours");
    expect(unitLabel(hours, 2)).toBe("hours");
  });
});

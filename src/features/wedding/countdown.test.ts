import { describe, expect, it } from "vitest";

import { WEDDING_DATE, getTimeLeft } from "./countdown";

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

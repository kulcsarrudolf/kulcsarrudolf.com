import { expect, it } from "vitest";

import { getLanguageFromString, getTranslation, translations } from "./index";

it("narrows a string to a supported language and falls back to English", () => {
  expect(getLanguageFromString("hu")).toBe("hu");
  expect(getLanguageFromString("en")).toBe("en");
  expect(getLanguageFromString("ro")).toBe("en");
  expect(getLanguageFromString(null)).toBe("en");
  expect(getLanguageFromString(undefined)).toBe("en");
});

it("ships the same keys in every language", () => {
  const keys = (value: unknown, prefix = ""): string[] =>
    value && typeof value === "object"
      ? Object.entries(value).flatMap(([key, child]) => keys(child, `${prefix}${key}.`))
      : [prefix.slice(0, -1)];

  expect(keys(getTranslation("hu")).sort()).toEqual(keys(translations.en).sort());
});

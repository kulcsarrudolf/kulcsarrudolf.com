import { createElement, isValidElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { interpolate } from "./interpolate";

const link = createElement("a", { href: "/" }, "here");

describe("interpolate", () => {
  it("returns a plain string when the whole value is one placeholder", () => {
    expect(interpolate("{name}", { name: "Rudolf" })).toBe("Rudolf");
  });

  it("fills simple placeholders, one piece per segment", () => {
    expect(interpolate("{first}-{last} of {total}", { first: "1", last: "3", total: "9" })).toEqual(
      ["1", "-", "3", " of ", "9"],
    );
  });

  it("leaves a placeholder without a param in place", () => {
    expect(interpolate("Hello {name}", {})).toEqual(["Hello ", "{name}"]);
  });

  it("emits an unmatched brace verbatim", () => {
    expect(interpolate("a { b", {})).toEqual(["a ", "{ b"]);
  });

  it("puts a React element in place of its placeholder and keys it", () => {
    const result = interpolate("Click {link} now", { link }) as ReactElement[];

    expect(result).toHaveLength(3);
    expect(result[0]).toBe("Click ");
    expect(isValidElement(result[1])).toBe(true);
    expect(result[1].key).toBe("translation-0");
    expect(result[2]).toBe(" now");
  });

  it("replaces a wrapped {tag/}...{/tag} section with the param", () => {
    const result = interpolate("See {link/}the docs{/link} for more", { link }) as ReactElement[];

    expect(result).toHaveLength(3);
    expect(result[0]).toBe("See ");
    expect(isValidElement(result[1])).toBe(true);
    expect(result[2]).toBe(" for more");
  });

  it("keeps the wrapped copy when the tag has no param", () => {
    expect(interpolate("See {link/}the docs{/link}", {})).toEqual(["See ", "the docs"]);
  });

  it("skips a stray closing tag", () => {
    expect(interpolate("done{/x}", {})).toBe("done");
  });
});

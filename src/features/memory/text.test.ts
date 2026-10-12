import { expect, it } from "vitest";

import { interpolate } from "@/i18n/interpolate";

import { asText } from "./text";

it("joins a filled-in translation back into one string", () => {
  expect(asText(interpolate("Block {number}: {picture}", { number: "3", picture: "heart" }))).toBe(
    "Block 3: heart",
  );
  expect(asText("Memory Blocks")).toBe("Memory Blocks");
});

import { describe, expect, it } from "vitest";

import { withHostEntries, withoutHostEntries } from "./hosts-file.ts";

const HOST = "example.local";
const STOCK =
  "##\n127.0.0.1\tlocalhost\n255.255.255.255\tbroadcasthost\n::1             localhost\n";

describe("withHostEntries", () => {
  it("appends a marked block with both loopback addresses", () => {
    expect(withHostEntries(STOCK, HOST)).toBe(
      STOCK +
        "\n# kulcsarrudolf.com dev, managed by yarn dev:setup\n127.0.0.1\texample.local\n::1\texample.local\n",
    );
  });

  it("is idempotent", () => {
    const once = withHostEntries(STOCK, HOST);
    expect(withHostEntries(once, HOST)).toBe(once);
  });

  it("copes with a file that has no trailing newline", () => {
    const added = withHostEntries(STOCK.trimEnd(), HOST);
    expect(added).toBe(withHostEntries(STOCK, HOST));
  });

  it("leaves an unrelated line that mentions the host alone", () => {
    const content = STOCK + `10.0.0.5\t${HOST}\n`;
    expect(withHostEntries(content, HOST)).toContain(`10.0.0.5\t${HOST}`);
    expect(withHostEntries(content, HOST)).toContain(`127.0.0.1\t${HOST}`);
  });
});

describe("withoutHostEntries", () => {
  it("restores the original content", () => {
    expect(withoutHostEntries(withHostEntries(STOCK, HOST), HOST)).toBe(STOCK);
  });

  it("returns the content unchanged when the block is absent", () => {
    expect(withoutHostEntries(STOCK, HOST)).toBe(STOCK);
  });

  it("removes a block that sits in the middle of the file", () => {
    const content = withHostEntries(STOCK, HOST) + "192.168.1.2\tprinter\n";
    expect(withoutHostEntries(content, HOST)).toBe(STOCK + "192.168.1.2\tprinter\n");
  });

  it("does not remove a block for another host", () => {
    const content = withHostEntries(STOCK, "other.local");
    expect(withoutHostEntries(content, HOST)).toBe(content);
  });
});

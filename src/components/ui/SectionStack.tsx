import type { ReactNode } from "react";

/**
 * The vertical rhythm between a page's sections.
 *
 * The home page used to put a rule between every pair of sections. Once Let's
 * Talk became a filled band, a hairline against its edge only read as a
 * second, weaker border, so spacing carries the whole job and every gap is the
 * same one.
 *
 * A section that ends in a paragraph has that paragraph's own bottom margin
 * taken off. Without it the gap under a run of body copy measures 16px wider
 * than the rest and the rhythm is off by exactly one paragraph.
 */
const SectionStack = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-12 [&>*>p:last-child]:mb-0">{children}</div>
);

export default SectionStack;

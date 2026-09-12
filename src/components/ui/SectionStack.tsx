import type { ReactNode } from "react";

/**
 * `section` is the gap between a page's sections. `tight` is for two blocks
 * that belong together, such as the terminal that opens the home page and
 * the About Me it introduces: a stack of this kind sits inside the page's
 * stack as one section.
 */
type SectionStackGap = "section" | "tight";

const GAPS: Record<SectionStackGap, string> = {
  section: "gap-8",
  tight: "gap-6",
};

interface SectionStackProps {
  gap?: SectionStackGap;
  children: ReactNode;
}

/**
 * The vertical rhythm between a page's sections.
 *
 * The home page used to put a rule between every pair of sections. Once Let's
 * Talk became a filled band, a hairline against its edge only read as a
 * second, weaker border, so spacing carries the whole job and every gap is the
 * same one. It started at 48px, which left every heading floating a step too
 * far from the block above it; 32px keeps the sections apart without the
 * float, one step wider than the tight gap.
 *
 * A section that ends in a paragraph has that paragraph's own bottom margin
 * taken off. Without it the gap under a run of body copy measures 16px wider
 * than the rest and the rhythm is off by exactly one paragraph.
 */
const SectionStack = ({ gap = "section", children }: SectionStackProps) => (
  <div className={`flex flex-col ${GAPS[gap]} [&>*>p:last-child]:mb-0`}>{children}</div>
);

export default SectionStack;

/**
 * The Let's Talk row icons are drawn here rather than pulled from Font
 * Awesome: the free set is solid only, and solid glyphs read heavier than the
 * hairline rules they sit between. Stroked outlines also keep the section a
 * step quieter than the illustrated cards in Currently Focused On below it.
 */
const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 32px for the six cases, drawn at a 1.5 stroke so the outline stays a
// hairline at that size; 22px for the quieter easter egg line; 18px for the
// glyph inside a button.
const CASE = "h-8 w-8 shrink-0";
const ROW = "h-[22px] w-[22px]";
const BUTTON = "h-[18px] w-[18px] shrink-0";

export const IdeaIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <path d="M9 18h6" />
    <path d="M10 21.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-4.2 11.5c.7.8 1.2 1.6 1.2 2.5h6c0-.9.5-1.7 1.2-2.5A6.5 6.5 0 0 0 12 2.5z" />
  </svg>
);

export const GrowthIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <path d="M3 17.5l5.5-5.5 3.5 3.5 7-7" />
    <path d="M13.5 8.5H20V15" />
  </svg>
);

export const ShipIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <circle cx="12" cy="12" r="8.75" />
    <path d="M3.25 12h17.5" />
    <path d="M12 3.25a13.5 13.5 0 0 1 0 17.5 13.5 13.5 0 0 1 0-17.5z" />
  </svg>
);

export const EasterEggIcon = () => (
  <svg {...strokeProps} className={ROW} aria-hidden="true">
    <path d="M12 2.75c-3.3 0-6 4.4-6 8.6a6 6 0 0 0 12 0c0-4.2-2.7-8.6-6-8.6z" />
    <path d="M6.35 13.4h11.3" />
  </svg>
);

export const TeamIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
    <circle cx="10" cy="7.5" r="3.5" />
    <path d="M20.5 20v-1.5a3.5 3.5 0 0 0-2.6-3.4" />
    <path d="M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />
  </svg>
);

export const BriefcaseIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <rect x="2.75" y="7" width="18.5" height="13" rx="2" />
    <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
    <path d="M10.5 13h3" />
  </svg>
);

export const CodeIcon = () => (
  <svg {...strokeProps} strokeWidth={1.5} className={CASE} aria-hidden="true">
    <path d="M9 7l-5 5 5 5" />
    <path d="M15 7l5 5-5 5" />
  </svg>
);

export const EnvelopeIcon = () => (
  <svg {...strokeProps} className={BUTTON} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.6 6.6l8.4 5.9 8.4-5.9" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...strokeProps} className={BUTTON} aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

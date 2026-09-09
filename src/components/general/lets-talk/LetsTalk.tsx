import { Link } from "@tanstack/react-router";

import { useTranslation } from "@/i18n/useTranslation";

import Title from "../typography/Title";

// The booking page behind "Schedule a call". External, so it never carries the
// `?lang` param and always opens in a new tab.
const CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1E8j226SDhI9ZMHQhgNTRZ-_AYpK1r1xGMaRPf50e6DuveSed0Fa17IVxDK3qxUpg6wJQ_ESS9";

/**
 * The row icons are drawn here rather than pulled from Font Awesome: the free
 * set is solid only, and solid glyphs at 22px read heavier than the hairline
 * rules they sit between. Stroked outlines also keep the section a step
 * quieter than the illustrated cards in Currently Focused On below it.
 */
const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IdeaIcon = () => (
  <svg {...strokeProps} className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M9 18h6" />
    <path d="M10 21.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-4.2 11.5c.7.8 1.2 1.6 1.2 2.5h6c0-.9.5-1.7 1.2-2.5A6.5 6.5 0 0 0 12 2.5z" />
  </svg>
);

const GrowthIcon = () => (
  <svg {...strokeProps} className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M3 17.5l5.5-5.5 3.5 3.5 7-7" />
    <path d="M13.5 8.5H20V15" />
  </svg>
);

const ShipIcon = () => (
  <svg {...strokeProps} className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M12 16V3.5" />
    <path d="M7 8.5l5-5 5 5" />
    <path d="M4 20.5h16" />
  </svg>
);

const TeamIcon = () => (
  <svg {...strokeProps} className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
    <circle cx="10" cy="7.5" r="3.5" />
    <path d="M20.5 20v-1.5a3.5 3.5 0 0 0-2.6-3.4" />
    <path d="M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />
  </svg>
);

const CodeIcon = () => (
  <svg {...strokeProps} className="h-[22px] w-[22px]" aria-hidden="true">
    <path d="M9 7l-5 5 5 5" />
    <path d="M15 7l5 5-5 5" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg {...strokeProps} className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.6 6.6l8.4 5.9 8.4-5.9" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...strokeProps} className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

// The four reasons that come with an icon. The easter egg is deliberately not
// one of them: it is a wink, not a fifth case, and it is rendered apart below.
const REASONS = [
  { key: "idea", Icon: IdeaIcon },
  { key: "stuck", Icon: GrowthIcon },
  { key: "ship", Icon: ShipIcon },
  { key: "team", Icon: TeamIcon },
  { key: "projects", Icon: CodeIcon },
];

// Full width stacked on a phone, side by side from `sm`. Both carry a border,
// transparent on the filled one, so the outlined button does not end up two
// pixels taller than its neighbour and sit a pixel out of line with it.
const BUTTON_BASE =
  "flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg border px-6 py-3 text-base font-semibold transition-colors sm:w-auto";

const PRIMARY_BUTTON = `${BUTTON_BASE} border-transparent bg-brand text-white hover:bg-brand-hover`;

// White with a grey hairline, the same treatment as the Currently Focused On
// arrows, so the filled button stays the only primary action on the page.
const SECONDARY_BUTTON = `${BUTTON_BASE} border-gray-300 bg-white text-brand shadow-sm hover:bg-gray-50`;

/**
 * Reasons to get in touch, written as endings to the heading's sentence. Sits
 * between the About Me paragraphs and Currently Focused On.
 */
const LetsTalk = () => {
  const { t, lang } = useTranslation();

  return (
    <div>
      <Title>{t("home.letsTalk.title")}</Title>

      <div className="flex flex-col">
        {REASONS.map(({ key, Icon }) => (
          <div
            key={key}
            className="flex items-start gap-4 border-t border-gray-300 py-[15px] sm:items-center"
          >
            <span className="mt-0.5 shrink-0 text-brand sm:mt-0">
              <Icon />
            </span>
            <span className="text-base leading-[1.6]" style={{ textWrap: "pretty" }}>
              {t(`home.letsTalk.${key}`)}
            </span>
          </div>
        ))}

        {/* The joke, kept at the end and set a step back from the four cases
            above it: no icon, a dashed rule, and quieter type. */}
        <div className="flex items-start gap-4 border-t border-dashed border-[#b9c1cc] py-[15px] sm:items-center">
          <span aria-hidden="true" className="w-[22px] shrink-0" />
          <span
            className="text-[15px] leading-[1.6] text-gray-500"
            style={{ textWrap: "pretty" }}
          >
            {t("home.letsTalk.easterEgg")}
          </span>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <Link
          to="/contact"
          // Keep the chosen language across internal navigation.
          search={{ lang: lang !== "en" ? lang : undefined }}
          className={PRIMARY_BUTTON}
          activeProps={{}}
          inactiveProps={{}}
        >
          <EnvelopeIcon />
          {t("home.letsTalk.message")}
        </Link>

        <a
          href={CALENDAR_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_BUTTON}
        >
          <CalendarIcon />
          {t("home.letsTalk.scheduleCall")}
        </a>
      </div>
    </div>
  );
};

export default LetsTalk;

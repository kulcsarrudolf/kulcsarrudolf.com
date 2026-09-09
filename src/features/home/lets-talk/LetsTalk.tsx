import { Link } from "@tanstack/react-router";

import { buttonClasses } from "@/components/ui/Button";
import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";

import Title from "@/components/ui/typography/Title";

import {
  BriefcaseIcon,
  CalendarIcon,
  CodeIcon,
  EasterEggIcon,
  EnvelopeIcon,
  GrowthIcon,
  IdeaIcon,
  ShipIcon,
  TeamIcon,
} from "./icons";

// The booking page behind "Schedule a call". External, so it never carries the
// `?lang` param and always opens in a new tab.
const CALENDAR_BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1E8j226SDhI9ZMHQhgNTRZ-_AYpK1r1xGMaRPf50e6DuveSed0Fa17IVxDK3qxUpg6wJQ_ESS9";

// The six cases. The easter egg is not one of them: it is a wink rather than
// a case, so it is rendered apart below with its own quieter treatment.
const REASONS = [
  { key: "idea", Icon: IdeaIcon },
  { key: "stuck", Icon: GrowthIcon },
  { key: "ship", Icon: ShipIcon },
  { key: "team", Icon: TeamIcon },
  { key: "hiring", Icon: BriefcaseIcon },
  { key: "projects", Icon: CodeIcon },
];

// Full width stacked on a phone, side by side from `sm`.
const CTA = "min-h-12 w-full sm:w-auto";

/**
 * Reasons to get in touch, written as endings to the heading's sentence. Sits
 * between the About Me paragraphs and Currently Focused On.
 */
const LetsTalk = () => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();

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

        {/* The joke, kept at the end and set a step back from the cases above
            it by a dashed rule, quieter type, and an icon that stays the grey
            of its own row rather than picking up the brand blue. */}
        <div className="flex items-start gap-4 border-t border-dashed border-[#b9c1cc] py-[15px] sm:items-center">
          <span className="mt-0.5 shrink-0 text-gray-500 sm:mt-0">
            <EasterEggIcon />
          </span>
          <span className="text-[15px] leading-[1.6] text-gray-500" style={{ textWrap: "pretty" }}>
            {t("home.letsTalk.easterEgg")}
          </span>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <Link
          to="/contact"
          search={langSearch}
          className={buttonClasses("primary", CTA)}
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
          className={buttonClasses("secondary", CTA)}
        >
          <CalendarIcon />
          {t("home.letsTalk.scheduleCall")}
        </a>
      </div>
    </div>
  );
};

export default LetsTalk;

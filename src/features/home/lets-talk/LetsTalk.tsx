import { Link } from "@tanstack/react-router";

import { buttonClasses } from "@/components/ui/Button";
import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";

import ReasonItem from "./ReasonItem";
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
 *
 * This is the one block on the page that asks the reader for something, and as
 * a list of hairline rows it read exactly like the sections that only tell
 * them things, so it was skipped. It is a filled brand band instead: the only
 * saturated block in the page body, borrowing the navbar's blue so the page
 * still holds together. The six sentences sit two to a row from `sm`, which
 * halves the height the band would otherwise take.
 */
const LetsTalk = () => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();

  return (
    <div className="rounded-xl bg-brand p-6 shadow-md sm:p-7 dark:bg-brand-dark">
      <span className="mb-2 block text-[12.5px] font-semibold uppercase tracking-[0.09em] text-white/85">
        {t("home.letsTalk.eyebrow")}
      </span>
      <h2 className="mb-5 text-2xl font-bold leading-[1.25] text-white sm:text-[30px]">
        {t("home.letsTalk.title")}
      </h2>

      <div className="grid gap-x-8 sm:grid-cols-2">
        {REASONS.map(({ key, Icon }) => (
          <ReasonItem key={key} icon={<Icon />}>
            {t(`home.letsTalk.${key}.text`)}
          </ReasonItem>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:gap-6">
        {/* The joke, kept at the end and set a step back from the cases above
            it by smaller type and an icon that stays a shade quieter. */}
        <p className="flex items-center gap-2.5 text-[13.5px] text-white/85">
          <span className="shrink-0 text-white/70">
            <EasterEggIcon />
          </span>
          {t("home.letsTalk.easterEgg")}
        </p>

        <div className="flex flex-col gap-2.5 sm:ml-auto sm:shrink-0 sm:flex-row sm:gap-3">
          <Link
            to="/contact"
            search={langSearch}
            className={buttonClasses("onBrand", CTA)}
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
            className={buttonClasses("onBrandOutline", CTA)}
          >
            <CalendarIcon />
            {t("home.letsTalk.scheduleCall")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LetsTalk;

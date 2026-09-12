import { useEffect, useState } from "react";

import {
  type TimeLeft,
  getCountdownUnits,
  getTimeLeft,
  unitLabel,
} from "@/features/wedding/countdown";
import { getNrContent, getNrLanguage } from "@/features/wedding/translations";
import { useTranslation } from "@/i18n/useTranslation";

interface WeddingLineProps {
  /**
   * Ends the loving atmosphere. Passed only to the newest wedding line while
   * that atmosphere is actually running, so an older block further up the
   * scrollback never shows a control that would do nothing.
   */
  onStop?: () => void;
}

/**
 * What the hidden `nr` command prints: who is getting married, when, and how
 * much of the wait is left, ticking once a second the way the page at /nr
 * does. Nothing here announces the command; it is found by typing it.
 *
 * While the hearts are up it prints one more line, the way out of them. It is
 * a button rather than a note because a phone has no escape key.
 */
const WeddingLine = ({ onStop }: WeddingLineProps) => {
  const { lang } = useTranslation();
  const content = getNrContent(getNrLanguage(lang));

  // Null until the effect runs, so the server render and the first client
  // render agree on a countdown that is different every second.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [ticked, setTicked] = useState(false);

  useEffect(() => {
    setTicked(true);
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Only the units that have something left in them, counted plainly: the
  // line reads "77 days · 45 min · 5 sec" rather than carrying an empty
  // "00 hours" through the months of waiting or padding "5" out to "05".
  const parts =
    timeLeft &&
    getCountdownUnits(timeLeft).map(
      ({ unit, value }) => `${value} ${unitLabel(content.labels[unit], value)}`,
    );

  return (
    <div className="flex flex-col gap-1 pl-[34px] text-gray-300">
      <p className="text-white">
        {content.names} <span className="text-rose-300">♥</span> {content.subtitle}
      </p>
      <p>{content.date}</p>
      {parts ? (
        <p className="tabular-nums text-brand-on-dark">{parts.join("  ·  ")}</p>
      ) : (
        ticked && <p className="text-rose-300">{content.weddingDay}</p>
      )}
      {onStop && (
        <button
          type="button"
          onClick={onStop}
          className="mt-1 self-start text-gray-500 underline-offset-4 hover:text-gray-300 hover:underline"
        >
          {content.stopAtmosphere}
        </button>
      )}
    </div>
  );
};

export default WeddingLine;

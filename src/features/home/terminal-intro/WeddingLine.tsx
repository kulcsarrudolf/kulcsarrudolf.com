import { useEffect, useState } from "react";

import { type TimeLeft, getTimeLeft } from "@/features/wedding/countdown";
import { getNrContent, getNrLanguage } from "@/features/wedding/translations";
import { useTranslation } from "@/i18n/useTranslation";

/**
 * What the hidden `nr` command prints: who is getting married, when, and how
 * much of the wait is left, ticking once a second the way the page at /nr
 * does. Nothing here announces the command; it is found by typing it.
 */
const WeddingLine = () => {
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

  const parts = timeLeft && [
    [timeLeft.days, content.labels.days],
    [timeLeft.hours, content.labels.hours],
    [timeLeft.minutes, content.labels.minutes],
    [timeLeft.seconds, content.labels.seconds],
  ];

  return (
    <div className="flex flex-col gap-1 pl-[34px] text-gray-300">
      <p className="text-white">
        {content.names} <span className="text-rose-300">♥</span> {content.subtitle}
      </p>
      <p>{content.date}</p>
      {parts ? (
        <p className="tabular-nums text-blue-300">
          {parts
            .map(([value, label]) => `${String(value).padStart(2, "0")} ${label}`)
            .join("  ·  ")}
        </p>
      ) : (
        ticked && <p className="text-rose-300">{content.weddingDay}</p>
      )}
    </div>
  );
};

export default WeddingLine;

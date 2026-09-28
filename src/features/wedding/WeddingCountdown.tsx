import "./fonts.css";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { type TimeLeft, getTimeLeft, unitLabel } from "./countdown";
import FloatingHearts from "./FloatingHearts";
import { NR_DEFAULT_LANGUAGE, getNrContent, type NrLanguage } from "./translations";
import WeddingFlowers from "./WeddingFlowers";
import WeddingNames from "./WeddingNames";

// The page follows the printed invitation: its own lettering for the names
// (WeddingNames) and TeX Gyre Termes, set wide, for everything else. The
// global `*` rule hands every element Inter, so each piece of text names its
// family itself.
const FONT_VARIABLES = {
  "--font-script": '"WindSong", cursive',
  "--font-serif": '"TeX Gyre Termes", "Times New Roman", serif',
} as CSSProperties;

const SCRIPT = "font-(family-name:--font-script) font-normal";
const SERIF = "font-(family-name:--font-serif)";

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center px-1 sm:px-4">
    <span className={`${SERIF} text-4xl tabular-nums leading-none text-[#3c0816] sm:text-6xl`}>
      {String(value).padStart(2, "0")}
    </span>
    <span
      className={`${SERIF} mt-2 text-[10px] uppercase tracking-[0.25em] text-[#7a4a57] sm:text-xs`}
    >
      {label}
    </span>
  </div>
);

const WeddingCountdown = ({ lang = NR_DEFAULT_LANGUAGE }: { lang?: NrLanguage }) => {
  const content = getNrContent(lang);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    // The image may fail before hydration, so onError alone is not enough.
    const photo = photoRef.current;
    if (photo && photo.complete && photo.naturalWidth === 0) {
      setPhotoOk(false);
    }

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isWeddingDay = mounted && timeLeft === null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" style={FONT_VARIABLES}>
      <FloatingHearts />

      <div className="relative flex min-h-full flex-col items-center justify-center px-6 pb-36 pt-20 text-center text-[#3c0816] sm:py-24">
        <WeddingFlowers />

        <figure className="relative max-w-md sm:max-w-xl">
          <blockquote
            className={`${SERIF} text-base leading-relaxed tracking-[0.12em] sm:text-xl sm:leading-relaxed`}
          >
            {content.quote}
          </blockquote>
          <figcaption className={`${SERIF} mt-1 text-sm tracking-[0.12em] sm:text-lg`}>
            {content.quoteReference}
          </figcaption>
        </figure>

        {/* Stacked on a phone; from lg the photo stands beside the names and
            the countdown, so the whole page fits one screen. */}
        <div className="relative mt-10 flex w-full max-w-5xl flex-col items-center sm:mt-12 lg:flex-row lg:justify-center lg:gap-20">
          <div className="relative shrink-0 rounded-[50%] border border-[#c9a6b2] p-2">
            {photoOk ? (
              <img
                ref={photoRef}
                src="/images/nr.jpeg"
                alt={content.names}
                className="block h-60 w-44 rounded-[50%] object-cover object-top sm:h-80 sm:w-60 lg:h-96 lg:w-72"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <div
                className={`${SCRIPT} flex h-60 w-44 items-center justify-center rounded-[50%] bg-[#faf5f6] text-6xl sm:h-80 sm:w-60 sm:text-7xl lg:h-96 lg:w-72`}
              >
                R & N
              </div>
            )}
          </div>

          <div className="flex w-full max-w-xl flex-col items-center">
            <div className="mt-8 lg:mt-0">
              <WeddingNames names={content.names} and={content.and} />
            </div>

            <p className={`${SERIF} mt-8 text-xs uppercase tracking-[0.4em] sm:text-sm`}>
              {content.subtitle}
            </p>

            <p
              className={`${SERIF} mt-3 text-lg font-bold italic tracking-[0.08em] sm:text-2xl sm:tracking-[0.12em]`}
            >
              {content.date}
            </p>

            {isWeddingDay ? (
              <p className={`${SCRIPT} mt-10 text-5xl sm:text-6xl`}>{content.weddingDay}</p>
            ) : (
              <div className="mt-10 grid w-full max-w-xl grid-cols-4 divide-x divide-[#c9a6b2]">
                <CountdownUnit
                  value={timeLeft?.days ?? 0}
                  label={unitLabel(content.labels.days, timeLeft?.days ?? 0)}
                />
                <CountdownUnit
                  value={timeLeft?.hours ?? 0}
                  label={unitLabel(content.labels.hours, timeLeft?.hours ?? 0)}
                />
                <CountdownUnit
                  value={timeLeft?.minutes ?? 0}
                  label={unitLabel(content.labels.minutes, timeLeft?.minutes ?? 0)}
                />
                <CountdownUnit
                  value={timeLeft?.seconds ?? 0}
                  label={unitLabel(content.labels.seconds, timeLeft?.seconds ?? 0)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingCountdown;

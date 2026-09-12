import { useEffect, useState } from "react";

import FloatingHearts, { FULL_RISE, type Heart } from "./FloatingHearts";
import { FADE_IN_MS } from "./useLovingAtmosphere";

/* The wash. A colour interpolated into a gradient cannot come from a Tailwind
   class, so it is named here: rose at the middle of the screen, deepening to
   crimson at the edges, light enough throughout that the page under it stays
   readable. The hearts do the work; this only sets the mood. */
export const ATMOSPHERE_WASH =
  "radial-gradient(120% 90% at 50% 50%, rgba(244, 63, 94, 0.06) 0%, rgba(190, 18, 60, 0.2) 100%)";

/* Twenty of them, against the wedding page's six: faster, because a sixteen
   second heart crosses the screen twice in thirty seconds, and deeper in the
   rose, because the wash is light enough to read through and a pale heart over
   a pale page is not a heart. These have to carry over both grounds the home
   page offers, the white card and the near-black terminal window. Delays stay
   under two seconds so the screen fills at once rather than trickling.
   Hand-tuned rather than random, so every trigger looks the same and can be
   looked at in a story. */
export const ATMOSPHERE_HEARTS: Heart[] = [
  {
    left: "4%",
    size: "1.1rem",
    duration: "9.5s",
    delay: "0.2s",
    sway: "14px",
    spin: "10deg",
    still: "22%",
    className: "text-rose-400/65",
  },
  {
    left: "11%",
    size: "1.7rem",
    duration: "11.5s",
    delay: "1.1s",
    sway: "-22px",
    spin: "-14deg",
    still: "64%",
    className: "text-rose-500/55",
  },
  {
    left: "17%",
    size: "0.85rem",
    duration: "7.5s",
    delay: "0.6s",
    sway: "12px",
    spin: "16deg",
    still: "38%",
    className: "text-rose-300/70",
  },
  {
    left: "24%",
    size: "2rem",
    duration: "12.5s",
    delay: "1.6s",
    sway: "-26px",
    spin: "-9deg",
    still: "80%",
    className: "text-rose-400/50",
  },
  {
    left: "30%",
    size: "1.25rem",
    duration: "8.5s",
    delay: "0s",
    sway: "18px",
    spin: "13deg",
    still: "12%",
    className: "text-pink-400/60",
  },
  {
    left: "36%",
    size: "1.55rem",
    duration: "10.5s",
    delay: "0.9s",
    sway: "-15px",
    spin: "-18deg",
    still: "56%",
    className: "text-rose-500/45",
  },
  {
    left: "42%",
    size: "0.95rem",
    duration: "7s",
    delay: "1.4s",
    sway: "24px",
    spin: "8deg",
    still: "30%",
    className: "text-rose-300/60",
  },
  {
    left: "48%",
    size: "2.2rem",
    duration: "13s",
    delay: "0.4s",
    sway: "-19px",
    spin: "-12deg",
    still: "72%",
    className: "text-rose-400/70",
  },
  {
    left: "54%",
    size: "1.35rem",
    duration: "9s",
    delay: "1.8s",
    sway: "16px",
    spin: "20deg",
    still: "18%",
    className: "text-rose-500/50",
  },
  {
    left: "60%",
    size: "1.05rem",
    duration: "11s",
    delay: "0.7s",
    sway: "-28px",
    spin: "-10deg",
    still: "46%",
    className: "text-pink-300/65",
  },
  {
    left: "66%",
    size: "1.8rem",
    duration: "12s",
    delay: "1.2s",
    sway: "13px",
    spin: "15deg",
    still: "86%",
    className: "text-rose-400/55",
  },
  {
    left: "72%",
    size: "0.8rem",
    duration: "8s",
    delay: "0.1s",
    sway: "-20px",
    spin: "-16deg",
    still: "26%",
    className: "text-rose-300/50",
  },
  {
    left: "78%",
    size: "1.45rem",
    duration: "10s",
    delay: "1.5s",
    sway: "25px",
    spin: "11deg",
    still: "60%",
    className: "text-rose-500/60",
  },
  {
    left: "84%",
    size: "1.15rem",
    duration: "9.5s",
    delay: "0.5s",
    sway: "-17px",
    spin: "-19deg",
    still: "34%",
    className: "text-pink-400/45",
  },
  {
    left: "90%",
    size: "1.95rem",
    duration: "12.5s",
    delay: "1.9s",
    sway: "21px",
    spin: "9deg",
    still: "76%",
    className: "text-rose-400/60",
  },
  {
    left: "96%",
    size: "0.9rem",
    duration: "7.5s",
    delay: "1s",
    sway: "-11px",
    spin: "17deg",
    still: "50%",
    className: "text-rose-300/65",
  },
  {
    left: "8%",
    size: "1.6rem",
    duration: "11.5s",
    delay: "1.7s",
    sway: "27px",
    spin: "-13deg",
    still: "88%",
    className: "text-rose-500/50",
  },
  {
    left: "21%",
    size: "1rem",
    duration: "8.5s",
    delay: "0.3s",
    sway: "-14px",
    spin: "12deg",
    still: "8%",
    className: "text-pink-300/55",
  },
  {
    left: "45%",
    size: "1.7rem",
    duration: "13s",
    delay: "1.3s",
    sway: "10px",
    spin: "-20deg",
    still: "68%",
    className: "text-rose-400/45",
  },
  {
    left: "69%",
    size: "1.3rem",
    duration: "9s",
    delay: "0.8s",
    sway: "-23px",
    spin: "14deg",
    still: "42%",
    className: "text-rose-500/65",
  },
];

interface LovingAtmosphereProps {
  /** True for the tail, when the layer is on its way out. */
  fading: boolean;
  /** How long that tail lasts: the long one at the end, a short one on Escape. */
  fadeMs: number;
}

/**
 * What the terminal's wedding commands put over the page: a red wash and a sky
 * of hearts, above the navbar and below the dialogs, passing every click
 * through to the page underneath so nothing is taken away while it runs.
 *
 * This is the one component here without a story. It ends itself after thirty
 * seconds, so a story would show an empty canvas from the thirty-first second
 * on. The part that can be looked at is `FloatingHearts`, and that has a story.
 */
const LovingAtmosphere = ({ fading, fadeMs }: LovingAtmosphereProps) => {
  // False for the first paint, so the browser has a transparent frame to fade
  // away from, the way the modals do.
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLit(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-40 ${lit && !fading ? "opacity-100" : "opacity-0"}`}
      style={{
        background: ATMOSPHERE_WASH,
        transitionProperty: "opacity",
        transitionTimingFunction: "ease-out",
        transitionDuration: `${fading ? fadeMs : FADE_IN_MS}ms`,
      }}
    >
      <FloatingHearts
        hearts={ATMOSPHERE_HEARTS}
        rise={FULL_RISE}
        className="drop-shadow-[0_1px_5px_rgba(190,18,60,0.3)]"
        stillWhenReduced
      />
    </div>
  );
};

export default LovingAtmosphere;

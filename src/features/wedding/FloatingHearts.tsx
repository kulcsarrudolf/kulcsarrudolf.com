/**
 * A layer of hearts drifting up the viewport, sitting behind whatever is drawn
 * over it.
 *
 * The terminal's loving atmosphere is the one caller: it passes the hearts,
 * how far they rise, and whether they hold still for reduced motion.
 */
import type { CSSProperties } from "react";

export interface Heart {
  /** Distance from the left edge. */
  left: string;
  /** Font size, which is the heart's size. */
  size: string;
  /** One trip up the viewport. */
  duration: string;
  /** How long before the first trip. */
  delay: string;
  /** Where the heart rests when the drifting is off. */
  still: string;
  /** How far it leans left and right on the way up. Omitted means straight up. */
  sway?: string;
  /** How far it turns on the way up. Omitted means upright. */
  spin?: string;
  /** Colour, as a Tailwind text class. */
  className?: string;
}

/** Where a heart's rise begins and ends, as a translation off its anchor. */
export interface Rise {
  from: string;
  to: string;
}

/** Off the bottom of the screen, up past the top of it. */
export const FULL_RISE: Rise = { from: "0px", to: "-112vh" };

/* Where the heart has got to, a fraction of the way through its rise. The
   sway and the spin need somewhere to happen, so the transform is sampled at
   25/50/75% rather than left to interpolate; every sample sits exactly on the
   straight line the two-stop version already drew, and the opacity stops are
   untouched, so a heart with no sway and no spin traces the identical path. */
const at = (fraction: number) =>
  `calc(var(--heart-from) + (var(--heart-to) - var(--heart-from)) * ${fraction})`;

const KEYFRAMES = `
  @keyframes nr-float {
    0% {
      transform: translate(0, var(--heart-from)) rotate(0deg) scale(0.9);
      opacity: 0;
    }
    12% { opacity: 0.5; }
    25% {
      transform: translate(var(--heart-sway, 0px), ${at(0.25)})
        rotate(calc(var(--heart-spin, 0deg) * 0.25)) scale(0.9625);
    }
    50% {
      transform: translate(0, ${at(0.5)})
        rotate(calc(var(--heart-spin, 0deg) * 0.5)) scale(1.025);
    }
    75% {
      transform: translate(calc(var(--heart-sway, 0px) * -1), ${at(0.75)})
        rotate(calc(var(--heart-spin, 0deg) * 0.75)) scale(1.0875);
    }
    85% { opacity: 0.35; }
    100% {
      transform: translate(0, var(--heart-to)) rotate(var(--heart-spin, 0deg)) scale(1.15);
      opacity: 0;
    }
  }
`;

/* Inline `animation` outranks any class, so `motion-reduce:animate-none` cannot
   reach it. The media query can: it stops the drift and lifts each heart to the
   height it was given, since a stopped heart would otherwise sit off the bottom
   of the screen where nobody can see it. */
const STILL = `
  @media (prefers-reduced-motion: reduce) {
    .nr-heart-still {
      animation: none !important;
      bottom: var(--heart-still) !important;
    }
  }
`;

interface FloatingHeartsProps {
  hearts: Heart[];
  /** How far the hearts travel. */
  rise: Rise;
  /** Colour for hearts that name none of their own. */
  heartClassName?: string;
  /** Goes on the layer itself, for a filter over the whole set. */
  className?: string;
  /** Hold the hearts still for a visitor who asked for less motion. */
  stillWhenReduced?: boolean;
}

const FloatingHearts = ({
  hearts,
  rise,
  heartClassName = "text-rose-300/50",
  className = "",
  stillWhenReduced = false,
}: FloatingHeartsProps) => (
  <div
    aria-hidden
    className={`pointer-events-none fixed inset-0 ${className}`}
    style={{ "--heart-from": rise.from, "--heart-to": rise.to } as CSSProperties}
  >
    <style>{stillWhenReduced ? `${KEYFRAMES}${STILL}` : KEYFRAMES}</style>

    {hearts.map((heart, index) => (
      <span
        key={index}
        className={`absolute ${stillWhenReduced ? "nr-heart-still " : ""}${heart.className ?? heartClassName}`}
        style={
          {
            left: heart.left,
            bottom: "-3rem",
            fontSize: heart.size,
            animation: `nr-float ${heart.duration} linear ${heart.delay} infinite`,
            "--heart-sway": heart.sway,
            "--heart-spin": heart.spin,
            "--heart-still": heart.still,
          } as CSSProperties
        }
      >
        ♥
      </span>
    ))}
  </div>
);

export default FloatingHearts;

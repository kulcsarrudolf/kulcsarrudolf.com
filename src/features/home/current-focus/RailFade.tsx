interface RailFadeProps {
  side: "left" | "right";
}

// The fade has to dissolve into the page behind the cards, which is `surface`
// by day and `surface-dark` by night. Drawn with the gradient utilities
// rather than an inline style so it can carry a `dark:` partner like
// everything else, and the start of the run is that same colour at zero
// alpha, so the edge never greys through a different hue on its way out.
const FADES = {
  left: "left-0 bg-linear-to-l from-surface/0 to-surface to-[78%] dark:from-surface-dark/0 dark:to-surface-dark",
  right:
    "right-0 bg-linear-to-r from-surface/0 to-surface to-[78%] dark:from-surface-dark/0 dark:to-surface-dark",
};

/**
 * The soft edge on a rail that has more cards beyond it, so a clipped card
 * reads as "there is more" rather than as a cropping mistake.
 */
const RailFade = ({ side }: RailFadeProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-y-0 w-8 sm:w-16 ${FADES[side]}`}
  />
);

export default RailFade;

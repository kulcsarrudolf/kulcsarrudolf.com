// The page background the cards sit on, matching `surface` in the Tailwind
// theme. The fade has to dissolve into it, and a gradient stop needs a real
// colour rather than a class.
const PAGE_BACKGROUND = "#E9EBEE";

interface RailFadeProps {
  side: "left" | "right";
}

/**
 * The soft edge on a rail that has more cards beyond it, so a clipped card
 * reads as "there is more" rather than as a cropping mistake.
 */
const RailFade = ({ side }: RailFadeProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-y-0 w-8 sm:w-16 ${
      side === "left" ? "left-0" : "right-0"
    }`}
    style={{
      background: `linear-gradient(to ${side}, rgba(233, 235, 238, 0), ${PAGE_BACKGROUND} 78%)`,
    }}
  />
);

export default RailFade;

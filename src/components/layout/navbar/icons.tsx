/**
 * The bulb on the theme switch, drawn here rather than pulled from Font
 * Awesome so that it can be lit: a stroked outline that fills with its own
 * colour and grows short rays while the lights are on. Lit means light mode,
 * the way a bulb means the lights are on, so pressing it is turning them off.
 *
 * Whether it is lit is read off the document by the `dark:` variant rather
 * than passed in: the server always renders the light page, and an icon
 * that waited for React to hydrate would come up lit on every dark load and
 * go out a moment later. This way it is right from the first paint, like
 * the rest of the page.
 */
const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// The rays and the fill come and go together; both ease so the bulb reads as
// dimming rather than as an icon swap.
const EASE = "transition-all duration-300 motion-reduce:transition-none";

export const BulbIcon = () => (
  <svg
    {...strokeProps}
    className={`h-6 w-6 drop-shadow-[0_0_5px_currentColor] dark:drop-shadow-none ${EASE}`}
    aria-hidden="true"
  >
    {/* The glass. Filled while lit, hollow while not. */}
    <path
      d="M12 4.25a5.25 5.25 0 0 0-3.45 9.2c.6.55.95 1.25 1.05 2.3h4.8c.1-1.05.45-1.75 1.05-2.3A5.25 5.25 0 0 0 12 4.25z"
      fill="currentColor"
      className={`[fill-opacity:0.92] dark:[fill-opacity:0] ${EASE}`}
    />
    {/* The base. */}
    <path d="M9.9 18.75h4.2" />
    <path d="M10.6 21.25h2.8" />
    {/* The rays: five short strokes that only show while lit. */}
    <g className={`opacity-100 dark:opacity-0 ${EASE}`}>
      <path d="M12 1.25v1.1" />
      <path d="M4.85 4.25l.8.8" />
      <path d="M19.15 4.25l-.8.8" />
      <path d="M2.4 10.75h1.1" />
      <path d="M20.5 10.75h1.1" />
    </g>
  </svg>
);

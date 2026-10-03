interface TrafficLightsProps {
  /** Hides the terminal and leaves the button in the corner as the way back. */
  onClose: () => void;
  /** Rolls the window up to its title bar, or back down again. */
  onShade: () => void;
  /** Lifts the window over the page, or puts it back in it. */
  onZoom: () => void;
  shaded: boolean;
  /** Whether green is engaged: lifted off the page, or filling the screen. */
  pressed: boolean;
  labels: {
    close: string;
    shade: string;
    unshade: string;
    float: string;
    dock: string;
  };
}

/**
 * Each button is a 24px square, the smallest touch target that is comfortable
 * to hit, with the 12px dot drawn in its middle. Side by side with no gap, the
 * dots keep a 12px space between them and the targets never overlap.
 */
const BUTTON = "group/dot flex h-6 w-6 shrink-0 items-center justify-center outline-hidden";
/** The dot itself: its colour, and the glyph that appears in it on hover. */
const DOT =
  "flex h-3 w-3 items-center justify-center rounded-full text-[9px] leading-none font-bold text-black/55 ring-offset-1 ring-offset-gray-700 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-white/70";
const GLYPH =
  "opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100";

/**
 * The three dots in the terminal's title bar, and on this window they are
 * buttons rather than decoration: red closes it, amber rolls it up to the bar,
 * and green either lifts it over the page it belongs to or fills the screen
 * with it, with a second press undoing whichever of those it was.
 *
 * Like the ones on a Mac, they carry their glyphs only while the pointer is
 * over the group, so the bar stays three quiet dots until someone reaches for
 * them. Keyboard focus counts as reaching for them too.
 */
const TrafficLights = ({
  onClose,
  onShade,
  onZoom,
  shaded,
  pressed,
  labels,
}: TrafficLightsProps) => (
  // A double-click on the bar rolls the window up; on the dots themselves it
  // would fire twice over whatever the second click already did.
  <div
    // Pulled left by the button's own inset, so the first dot still lines up
    // with the bar's padding.
    className="group/lights -ml-1.5 flex items-center"
    onDoubleClick={(event) => event.stopPropagation()}
  >
    <button type="button" onClick={onClose} aria-label={labels.close} className={BUTTON}>
      <span className={`${DOT} bg-traffic-close`}>
        <span className={GLYPH} aria-hidden="true">
          ✕
        </span>
      </span>
    </button>

    <button
      type="button"
      onClick={onShade}
      aria-label={shaded ? labels.unshade : labels.shade}
      aria-expanded={!shaded}
      className={BUTTON}
    >
      <span className={`${DOT} bg-traffic-shade`}>
        <span className={GLYPH} aria-hidden="true">
          {shaded ? "+" : "−"}
        </span>
      </span>
    </button>

    <button
      type="button"
      onClick={onZoom}
      aria-label={pressed ? labels.dock : labels.float}
      aria-pressed={pressed}
      className={BUTTON}
    >
      <span className={`${DOT} bg-traffic-zoom`}>
        <span className={GLYPH} aria-hidden="true">
          {pressed ? "▾" : "▴"}
        </span>
      </span>
    </button>
  </div>
);

export default TrafficLights;

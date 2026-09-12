interface TrafficLightsProps {
  /** Hides the terminal and leaves the button in the corner as the way back. */
  onClose: () => void;
  /** Rolls the window up to its title bar, or back down again. */
  onShade: () => void;
  /** Lifts the window over the page, or puts it back in it. */
  onZoom: () => void;
  shaded: boolean;
  floating: boolean;
  labels: {
    close: string;
    shade: string;
    unshade: string;
    float: string;
    dock: string;
  };
}

/** Each dot: its colour, and the glyph that appears in it on hover. */
const DOT =
  "relative flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[9px] leading-none font-bold text-black/55 outline-hidden ring-offset-1 ring-offset-gray-700 focus-visible:ring-2 focus-visible:ring-white/70";
const GLYPH =
  "opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100";

/**
 * The three dots in the terminal's title bar, and on this window they are
 * buttons rather than decoration: red closes it, amber rolls it up to the bar,
 * green lifts it over the page as a window that drags and resizes, and green
 * again sets it back down where it came from.
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
  floating,
  labels,
}: TrafficLightsProps) => (
  // A double-click on the bar rolls the window up; on the dots themselves it
  // would fire twice over whatever the second click already did.
  <div
    className="group/lights flex items-center gap-2"
    onDoubleClick={(event) => event.stopPropagation()}
  >
    <button
      type="button"
      onClick={onClose}
      aria-label={labels.close}
      className={`${DOT} bg-traffic-close`}
    >
      <span className={GLYPH} aria-hidden="true">
        ✕
      </span>
    </button>

    <button
      type="button"
      onClick={onShade}
      aria-label={shaded ? labels.unshade : labels.shade}
      aria-expanded={!shaded}
      className={`${DOT} bg-traffic-shade`}
    >
      <span className={GLYPH} aria-hidden="true">
        {shaded ? "+" : "−"}
      </span>
    </button>

    <button
      type="button"
      onClick={onZoom}
      aria-label={floating ? labels.dock : labels.float}
      aria-pressed={floating}
      className={`${DOT} bg-traffic-zoom`}
    >
      <span className={GLYPH} aria-hidden="true">
        {floating ? "▾" : "▴"}
      </span>
    </button>
  </div>
);

export default TrafficLights;

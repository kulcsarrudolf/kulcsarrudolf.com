import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface RailControlsProps {
  /** "1-3 of 4", already translated. */
  counter: string;
  previousLabel: string;
  nextLabel: string;
  canScrollBack: boolean;
  canScrollForward: boolean;
  /** False when every card fits, which parks the whole cluster. */
  isScrollable: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

// White with a grey hairline, the same treatment as the secondary button, so
// the arrows stay chrome rather than reading as an action.
const ARROW =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-brand shadow-sm transition-colors enabled:hover:bg-gray-50 disabled:opacity-40";

/**
 * The counter and the two arrows that sit beside a rail's heading.
 *
 * Phones get the peeking card, the fade and the dots instead: there is no room
 * beside the title, and the rail is swipeable anyway.
 */
const RailControls = ({
  counter,
  previousLabel,
  nextLabel,
  canScrollBack,
  canScrollForward,
  isScrollable,
  onPrevious,
  onNext,
}: RailControlsProps) => (
  <div
    className="hidden items-center gap-2 sm:flex"
    // Hidden rather than unmounted, so the heading keeps its height.
    style={{ visibility: isScrollable ? "visible" : "hidden" }}
  >
    <span className="mr-1 whitespace-nowrap text-xs text-gray-500">{counter}</span>
    <button
      type="button"
      aria-label={previousLabel}
      disabled={!isScrollable || !canScrollBack}
      onClick={onPrevious}
      className={ARROW}
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
    </button>
    <button
      type="button"
      aria-label={nextLabel}
      disabled={!isScrollable || !canScrollForward}
      onClick={onNext}
      className={ARROW}
    >
      <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
    </button>
  </div>
);

export default RailControls;

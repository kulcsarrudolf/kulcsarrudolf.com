interface RailDotsProps {
  count: number;
  /** Inclusive index range currently on screen. */
  range: { first: number; last: number };
  /** Every card fits, so there is nothing for the dots to report. */
  hidden?: boolean;
}

/**
 * The progress dots under a card rail. Every card in view is a wide dot, so on
 * a phone showing one card there is one, and on a tablet showing three there
 * are three. Decorative: the counter beside the heading says the same thing to
 * a screen reader.
 */
const RailDots = ({ count, range, hidden = false }: RailDotsProps) => (
  <div
    aria-hidden="true"
    className="mt-4 flex items-center justify-center gap-[7px]"
    style={{ display: hidden ? "none" : undefined }}
  >
    {Array.from({ length: count }, (_, index) => {
      const isActive = index >= range.first && index <= range.last;
      return (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            isActive ? "w-5 bg-brand" : "w-1.5 bg-[#c3cad6]"
          }`}
        />
      );
    })}
  </div>
);

export default RailDots;

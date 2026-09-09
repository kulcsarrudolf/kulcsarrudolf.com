import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

// A card only counts as visible once it is all but whole, so the "1-3 of 4"
// counter never claims a card that is still clipped by the edge of the rail.
const VISIBLE_RATIO = 0.92;

// Sub-pixel rounding leaves a stray pixel or two of scrollWidth even when the
// cards fit, which would otherwise light up an arrow that goes nowhere.
const SCROLL_EPSILON = 4;

/**
 * A horizontal rail of cards that can be dragged, swiped or paged through.
 *
 * It reports which cards are on screen and whether there is anything left to
 * reach in either direction, which is what drives the counter, the dots, the
 * arrows and the edge fades.
 */
export function useCardRail(cardCount: number) {
  const ref = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [range, setRange] = useState({ first: 0, last: 0 });
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = ref.current;
    if (!container) return;

    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    const visible: number[] = [];
    let mostVisible = 0;
    let mostVisibleWidth = -1;

    Array.from(container.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const shown =
        Math.min(card.offsetLeft + card.offsetWidth, viewRight) -
        Math.max(card.offsetLeft, viewLeft);

      if (shown > mostVisibleWidth) {
        mostVisibleWidth = shown;
        mostVisible = index;
      }

      if (shown / card.offsetWidth >= VISIBLE_RATIO) {
        visible.push(index);
      }
    });

    // On a viewport too narrow to show any card in full, fall back to whichever
    // one is showing the most, so the counter never goes blank.
    setRange({
      first: visible[0] ?? mostVisible,
      last: visible[visible.length - 1] ?? mostVisible,
    });
    setCanScrollBack(viewLeft > SCROLL_EPSILON);
    setCanScrollForward(viewLeft < container.scrollWidth - container.clientWidth - SCROLL_EPSILON);
  }, []);

  useEffect(() => {
    updateScrollState();

    const container = ref.current;
    if (!container) return;

    // The rail reflows with the page, so recheck on container resize rather
    // than on window resize alone.
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);

    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollToCard = useCallback(
    (index: number) => {
      const container = ref.current;
      if (!container) return;

      const clamped = Math.max(0, Math.min(index, cardCount - 1));
      const card = container.children[clamped] as HTMLElement | undefined;
      if (!card) return;

      container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    },
    [cardCount],
  );

  const handleMouseDown = (e: MouseEvent) => {
    const container = ref.current;
    if (!container) return;

    // Don't start dragging if the click landed on a link.
    if ((e.target as HTMLElement).closest("a")) return;

    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const container = ref.current;
    if (!isDragging || !container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return {
    railRef: ref,
    range,
    canScrollBack,
    canScrollForward,
    // Wide enough for every card and the rail stops being a rail: the counter,
    // arrows and dots would then be chrome for a scroll that cannot happen.
    isScrollable: canScrollBack || canScrollForward,
    // A page is however many cards currently fit, so the arrows advance by
    // what the reader can actually see.
    pageSize: Math.max(1, range.last - range.first + 1),
    scrollToCard,
    // Spread onto the scrolling element.
    railProps: {
      onScroll: updateScrollState,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}

export default useCardRail;

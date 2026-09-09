import { useTranslation } from "@/i18n/useTranslation";
import Title from "../typography/Title";
import Link from "../typography/Link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import programmingSvg from "./programming.svg";
import aiToolingSvg from "./ai-tooling.svg";
import openSourceSvg from "./open-source.svg";
import aiIntegrationSvg from "./ai-integration.svg";

// Static links are plain elements: the translation helper clones them into
// the sentence, so nothing here needs to be a component.
const innovatorSparkLink = (
  <Link href="https://innovatorspark.com/">InnovatorSpark</Link>
);
const reactLink = <Link href="https://react.dev">React</Link>;
const nodeJsLink = <Link href="https://nodejs.org">Node.js</Link>;
const personalProjectsLink = (
  <Link href="https://github.com/kulcsarrudolf">personal projects</Link>
);
const claudeCodeLink = (
  <Link href="https://www.anthropic.com/claude">Claude Code</Link>
);
const zimmeZoomLink = (
  <Link href="https://github.com/kulcsarrudolf/zimme-zoom">zimme-zoom</Link>
);
const samsungDeviceHelperLink = (
  <Link href="https://github.com/kulcsarrudolf/samsung-device-helper">
    samsung-device-helper
  </Link>
);

const focusAreas = [
  { key: "fullStack", image: programmingSvg },
  { key: "aiTooling", image: aiToolingSvg },
  { key: "aiIntegration", image: aiIntegrationSvg },
  { key: "openSource", image: openSourceSvg },
];

// The page background the cards sit on. The fades at either end of the rail
// have to dissolve into it, so it cannot come from a Tailwind colour.
const PAGE_BACKGROUND = "#E9EBEE";

// A card only counts as visible once it is all but whole, so the "1-3 of 4"
// counter never claims a card that is still clipped by the edge of the rail.
const VISIBLE_RATIO = 0.92;

// Sub-pixel rounding leaves a stray pixel or two of scrollWidth even when the
// cards fit, which would otherwise light up an arrow that goes nowhere.
const SCROLL_EPSILON = 4;

const CurrentFocus = () => {
  const { t } = useTranslation();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Which cards are on screen, and whether there is anything left to reach in
  // either direction. Drives the counter, the dots and the arrow buttons.
  const [range, setRange] = useState({ first: 0, last: 0 });
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
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
    setCanScrollForward(
      viewLeft < container.scrollWidth - container.clientWidth - SCROLL_EPSILON
    );
  }, []);

  useEffect(() => {
    updateScrollState();

    const container = scrollContainerRef.current;
    if (!container) return;

    // The rail reflows with the page, so recheck on container resize rather
    // than on window resize alone.
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);

    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const clamped = Math.max(0, Math.min(index, focusAreas.length - 1));
    const card = container.children[clamped] as HTMLElement | undefined;
    if (!card) return;

    container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  // A page is however many cards currently fit, so the arrows advance by what
  // the reader can actually see.
  const pageSize = Math.max(1, range.last - range.first + 1);

  // Wide enough for all four and the rail stops being a rail: the counter,
  // arrows and dots would then be chrome for a scroll that cannot happen.
  const isScrollable = canScrollBack || canScrollForward;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    // Check if the click target is a link or within a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      return; // Don't start dragging if clicking on a link
    }

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const counterKey =
    range.first === range.last
      ? "home.currentFocus.counterSingle"
      : "home.currentFocus.counter";

  return (
    <div>
      <div className="mb-3 flex min-h-9 items-center justify-between gap-4">
        <Title mb={0}>{t("home.currentFocus.title")}</Title>

        {/* Phones get the peeking card, the fade and the dots instead: there
            is no room beside the title, and the rail is swipeable anyway. */}
        <div
          className="hidden items-center gap-2 sm:flex"
          style={{ visibility: isScrollable ? "visible" : "hidden" }}
        >
          <span className="mr-1 whitespace-nowrap text-xs text-gray-500">
            {t(counterKey, {
              first: String(range.first + 1),
              last: String(range.last + 1),
              total: String(focusAreas.length),
            })}
          </span>
          <button
            type="button"
            aria-label={String(t("home.currentFocus.previous"))}
            disabled={!isScrollable || !canScrollBack}
            onClick={() => scrollToCard(range.first - pageSize)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors enabled:hover:bg-gray-50 disabled:opacity-40"
            style={{ color: "#4267b2" }}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </button>
          <button
            type="button"
            aria-label={String(t("home.currentFocus.next"))}
            disabled={!isScrollable || !canScrollForward}
            onClick={() => scrollToCard(range.last + 1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors enabled:hover:bg-gray-50 disabled:opacity-40"
            style={{ color: "#4267b2" }}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          role="group"
          aria-label={String(t("home.currentFocus.title"))}
          tabIndex={isScrollable ? 0 : -1}
          className="hide-scrollbar relative flex cursor-grab items-stretch gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          style={{ WebkitOverflowScrolling: "touch" }}
          onScroll={updateScrollState}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {focusAreas.map((area) => (
            <div
              key={area.key}
              className="flex snap-start flex-col gap-2.5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              // The cards share the row when all four fit and hold 220px once
              // they don't, which is what turns the rail into a scroller.
              style={{ flex: "1 0 220px" }}
            >
              <img
                src={area.image}
                alt=""
                width={96}
                height={96}
                className="mx-auto"
                style={{ width: 96, height: 96, objectFit: "contain" }}
              />
              <h3
                className="text-base font-semibold"
                style={{ color: "#4267b2" }}
              >
                {t(`home.currentFocus.${area.key}.title`)}
              </h3>
              <p
                className="text-sm leading-relaxed text-gray-700 sm:text-[13.5px]"
                style={{ textWrap: "pretty" }}
              >
                {area.key === "fullStack" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    innovatorSpark: innovatorSparkLink,
                    react: reactLink,
                    nodejs: nodeJsLink,
                    personalProjects: personalProjectsLink,
                  })}
                {area.key === "aiTooling" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    claudeCode: claudeCodeLink,
                  })}
                {area.key === "aiIntegration" &&
                  t(`home.currentFocus.${area.key}.description`)}
                {area.key === "openSource" &&
                  t(`home.currentFocus.${area.key}.description`, {
                    zimmeZoom: zimmeZoomLink,
                    samsungDeviceHelper: samsungDeviceHelperLink,
                  })}
              </p>
            </div>
          ))}
        </div>

        {canScrollBack && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16"
            style={{
              background: `linear-gradient(to left, rgba(233, 235, 238, 0), ${PAGE_BACKGROUND} 78%)`,
            }}
          />
        )}
        {canScrollForward && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16"
            style={{
              background: `linear-gradient(to right, rgba(233, 235, 238, 0), ${PAGE_BACKGROUND} 78%)`,
            }}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="mt-4 flex items-center justify-center gap-[7px]"
        style={{ display: isScrollable ? undefined : "none" }}
      >
        {focusAreas.map((area, index) => {
          const isActive = index >= range.first && index <= range.last;
          return (
            <span
              key={area.key}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: isActive ? 20 : 6,
                backgroundColor: isActive ? "#4267b2" : "#c3cad6",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CurrentFocus;

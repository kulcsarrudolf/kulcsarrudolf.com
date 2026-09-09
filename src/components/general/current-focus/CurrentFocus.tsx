import { useTranslation } from "@/i18n/useTranslation";

import Title from "../typography/Title";

import FocusCard from "./FocusCard";
import RailControls from "./RailControls";
import RailDots from "./RailDots";
import RailFade from "./RailFade";
import { FOCUS_AREAS, useFocusDescriptions } from "./focus-areas";
import useCardRail from "./useCardRail";

/**
 * Four illustrated cards on a rail that can be swiped, dragged or paged
 * through with the arrows beside the heading.
 */
const CurrentFocus = () => {
  const { t } = useTranslation();
  const describe = useFocusDescriptions();
  const {
    railRef,
    railProps,
    range,
    canScrollBack,
    canScrollForward,
    isScrollable,
    pageSize,
    scrollToCard,
  } = useCardRail(FOCUS_AREAS.length);

  const counterKey =
    range.first === range.last
      ? "home.currentFocus.counterSingle"
      : "home.currentFocus.counter";

  return (
    <div>
      <div className="mb-3 flex min-h-9 items-center justify-between gap-4">
        <Title mb={0}>{t("home.currentFocus.title")}</Title>

        <RailControls
          counter={
            t(counterKey, {
              first: String(range.first + 1),
              last: String(range.last + 1),
              total: String(FOCUS_AREAS.length),
            }) as string
          }
          previousLabel={String(t("home.currentFocus.previous"))}
          nextLabel={String(t("home.currentFocus.next"))}
          canScrollBack={canScrollBack}
          canScrollForward={canScrollForward}
          isScrollable={isScrollable}
          onPrevious={() => scrollToCard(range.first - pageSize)}
          onNext={() => scrollToCard(range.last + 1)}
        />
      </div>

      <div className="relative">
        <div
          ref={railRef}
          role="group"
          aria-label={String(t("home.currentFocus.title"))}
          tabIndex={isScrollable ? 0 : -1}
          className="hide-scrollbar relative flex cursor-grab items-stretch gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          style={{ WebkitOverflowScrolling: "touch" }}
          {...railProps}
        >
          {FOCUS_AREAS.map((area) => (
            <FocusCard
              key={area.key}
              image={area.image}
              title={t(`home.currentFocus.${area.key}.title`) as string}
            >
              {describe(area.key)}
            </FocusCard>
          ))}
        </div>

        {canScrollBack && <RailFade side="left" />}
        {canScrollForward && <RailFade side="right" />}
      </div>

      <RailDots
        count={FOCUS_AREAS.length}
        range={range}
        hidden={!isScrollable}
      />
    </div>
  );
};

export default CurrentFocus;

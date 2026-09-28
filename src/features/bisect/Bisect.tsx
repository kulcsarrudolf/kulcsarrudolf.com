import { type KeyboardEvent, useId, useRef, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import BisectActions from "./BisectActions";
import BisectBoard from "./BisectBoard";
import BisectGallery from "./BisectGallery";
import BisectStatus from "./BisectStatus";
import BisectSummary from "./BisectSummary";
import { BackIcon, GridIcon } from "./icons";
import { useBisectGame } from "./useBisectGame";

// Nothing here is for selecting: a drag that starts a little off the board
// would otherwise paint the title and the hint blue.
const STACKED = "flex w-full select-none flex-col gap-3 font-mono text-gray-300";
const BOARD_AND_ASIDE = `${STACKED} short:grid short:grid-cols-[auto_minmax(0,18rem)] short:items-center short:justify-center short:gap-x-6`;
const ASIDE = "short:col-start-2";

/**
 * The game: forty developer icons and logos, one at a time, each to be cut into two
 * equal halves with a single straight line. Only the first cut of a shape
 * counts and 48:52 or better wins, the rules of Cutle, which this is a
 * terminal-flavoured take on. The window is dark in both themes, like the
 * terminal it is started from.
 *
 * A line is drawn and adjusted first and cut only when asked, with Enter or
 * the Cut button. Off the board, R takes the line or the cut back to start
 * again and Space moves on once the result is showing, and
 * the Shapes button beside the file name opens every shape at once, to
 * choose the one to cut.
 *
 * The board sits between the title and the result while there is room to
 * stack them. On a `short` screen, a phone on its side, it takes the height
 * and the rest stands beside it, so nothing is pushed off the screen.
 */
const Bisect = () => {
  const { t } = useTranslation();
  const keysId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const game = useBisectGame();
  const [browsing, setBrowsing] = useState(false);

  const pick = (id: string) => {
    game.pick(id);
    setBrowsing(false);
  };

  // Retry disables itself under the focus, so the focus goes back to the
  // board, where the keys carry on working.
  const retry = () => {
    game.retry();
    rootRef.current?.querySelector<SVGSVGElement>('[role="application"]')?.focus();
  };

  // The shortcuts answer only what reaches this far untaken: the board keeps
  // Space while there is a line to cut along, and a button keeps its own.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || !game.shape || browsing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if ((event.target as Element).closest("button, a, input, textarea")) return;
    if (event.key === " " && game.cut) {
      event.preventDefault();
      game.next();
    } else if (event.key.toLowerCase() === "r" && (game.cut || game.aim)) {
      event.preventDefault();
      game.retry();
    }
  };

  return (
    <div
      className={game.shape && !browsing ? BOARD_AND_ASIDE : STACKED}
      onKeyDown={onKeyDown}
      ref={rootRef}
    >
      <div className={`flex min-h-8 items-center gap-3 pr-10 ${ASIDE}`}>
        <h2 className="text-lg font-bold text-white">bisect</h2>
        {!game.finished && (
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs tabular-nums text-gray-400 ring-1 ring-white/10">
            {game.round}/{game.total} · ✓ {game.summary.wins}
          </span>
        )}
      </div>

      {game.shape ? (
        <>
          <div className={`flex items-center justify-between gap-3 text-sm ${ASIDE}`}>
            <p className="min-w-0 truncate text-gray-400">
              ~/bisect/
              {!browsing && <span className="text-brand-on-dark">{game.shape.id}.svg</span>}
            </p>
            <button
              type="button"
              onClick={() => setBrowsing((open) => !open)}
              aria-expanded={browsing}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-gray-200 transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-brand-on-dark"
            >
              {browsing ? <BackIcon /> : <GridIcon />}
              {t(browsing ? "bisect.gallery.back" : "bisect.gallery.open")}
            </button>
          </div>

          {browsing ? (
            <BisectGallery entries={game.lineup} onPick={pick} onClose={() => setBrowsing(false)} />
          ) : (
            <>
              <div className="short:col-start-1 short:row-span-4 short:row-start-1 short:w-[min(24rem,100dvh_-_3rem)]">
                <BisectBoard
                  shape={game.shape}
                  aim={game.aim}
                  cut={game.cut}
                  onAim={game.aimAt}
                  onCut={game.release}
                  label={`${t("bisect.board")}: ${game.shape.id}`}
                  describedBy={keysId}
                />
              </div>

              <div className={ASIDE}>
                <BisectStatus aiming={game.aiming} cut={game.cut} practice={game.practice} />
              </div>

              <div className={`flex flex-col items-center gap-3 ${ASIDE}`}>
                <BisectActions
                  canRetry={game.cut !== null || game.aim !== null}
                  canCut={game.canCut}
                  cutMade={game.cut !== null}
                  last={game.last}
                  onRetry={retry}
                  onCut={() => game.aim && game.release(game.aim)}
                  onNext={game.next}
                />
                <p id={keysId} className="text-center text-xs text-gray-500 pointer-coarse:hidden">
                  {t("bisect.keys")}
                </p>
              </div>
            </>
          )}
        </>
      ) : (
        <BisectSummary scores={game.scores} total={game.total} onRestart={game.restart} />
      )}
    </div>
  );
};

export default Bisect;

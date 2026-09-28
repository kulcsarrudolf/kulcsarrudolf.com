import { useId } from "react";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import BisectBoard from "./BisectBoard";
import BisectStatus from "./BisectStatus";
import BisectSummary from "./BisectSummary";
import { useBisectGame } from "./useBisectGame";

// Nothing here is for selecting: a drag that starts a little off the board
// would otherwise paint the title and the hint blue.
const STACKED = "flex w-full select-none flex-col gap-3 font-mono text-gray-300";
const BOARD_AND_ASIDE = `${STACKED} short:grid short:grid-cols-[auto_minmax(0,18rem)] short:items-center short:justify-center short:gap-x-6`;
const ASIDE = "short:col-start-2";

/**
 * The game: twenty developer icons, one at a time, each to be cut into two
 * equal halves with a single straight line. Only the first cut of a shape
 * counts and 48:52 or better wins, the rules of Cutle, which this is a
 * terminal-flavoured take on. The window is dark in both themes, like the
 * terminal it is started from.
 *
 * The board sits between the title and the result while there is room to
 * stack them. On a `short` screen, a phone on its side, it takes the height
 * and the rest stands beside it, so nothing is pushed off the screen.
 */
const Bisect = () => {
  const { t } = useTranslation();
  const keysId = useId();
  const game = useBisectGame();

  return (
    <div className={game.shape ? BOARD_AND_ASIDE : STACKED}>
      <div className={`flex items-baseline justify-between gap-4 pr-12 text-sm ${ASIDE}`}>
        <h2 className="text-lg font-bold text-white">bisect</h2>
        {!game.finished && (
          <span className="tabular-nums text-gray-400">
            {game.round}/{game.total} · ✓ {game.summary.wins}
          </span>
        )}
      </div>

      {game.shape ? (
        <>
          <p className={`truncate text-sm text-gray-400 ${ASIDE}`}>
            ~/bisect/<span className="text-brand-on-dark">{game.shape.id}.svg</span>
          </p>

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

          <div className={`flex flex-col items-center gap-2 ${ASIDE}`}>
            <Button onClick={game.next} disabled={!game.scored} className="disabled:opacity-40">
              {t(game.round === game.total ? "bisect.finish" : "bisect.next")}
            </Button>
            <p id={keysId} className="text-center text-xs text-gray-500 pointer-coarse:hidden">
              {t("bisect.keys")}
            </p>
          </div>
        </>
      ) : (
        <BisectSummary scores={game.scores} total={game.total} onRestart={game.restart} />
      )}
    </div>
  );
};

export default Bisect;

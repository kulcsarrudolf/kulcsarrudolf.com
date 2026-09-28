import { useId } from "react";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import BisectBoard from "./BisectBoard";
import BisectStatus from "./BisectStatus";
import BisectSummary from "./BisectSummary";
import { useBisectGame } from "./useBisectGame";

/**
 * The game: twenty developer icons, one at a time, each to be cut into two
 * equal halves with a single straight line. Only the first cut of a shape
 * counts and 48:52 or better wins, the rules of Cutle, which this is a
 * terminal-flavoured take on. The window is dark in both themes, like the
 * terminal it is started from.
 */
const Bisect = () => {
  const { t } = useTranslation();
  const keysId = useId();
  const game = useBisectGame();

  return (
    <div className="flex w-full flex-col gap-3 font-mono text-gray-300">
      <div className="flex items-baseline justify-between gap-4 pr-12 text-sm">
        <h2 className="text-lg font-bold text-white">bisect</h2>
        {!game.finished && (
          <span className="tabular-nums text-gray-400">
            {game.round}/{game.total} · ✓ {game.summary.wins}
          </span>
        )}
      </div>

      {game.shape ? (
        <>
          <p className="truncate text-sm text-gray-400">
            ~/bisect/<span className="text-brand-on-dark">{game.shape.id}.svg</span>
          </p>

          <BisectBoard
            shape={game.shape}
            aim={game.aim}
            cut={game.cut}
            onAim={game.aimAt}
            onCut={game.release}
            label={`${t("bisect.board")}: ${game.shape.id}`}
            describedBy={keysId}
          />

          <BisectStatus cut={game.cut} practice={game.practice} />

          <div className="flex flex-col items-center gap-2">
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

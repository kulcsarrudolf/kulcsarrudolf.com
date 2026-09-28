import { useTranslation } from "@/i18n/useTranslation";

import { type Cut, formatTenths, type Verdict } from "./board";
import type { AimSource } from "./useCutGesture";

interface BisectStatusProps {
  /** What a line is being drawn with, or null while there is none. */
  aiming: AimSource | null;
  /** The cut on the board, or null while there is none. */
  cut: Cut | null;
  /** The cut is one more after the shape's first, so it does not count. */
  practice: boolean;
}

const VERDICT_TONE: Record<Verdict, string> = {
  perfect: "text-emerald-300",
  win: "text-amber-300",
  miss: "text-gray-400",
};

/**
 * The line under the board: how to cut until there is a line, how to cut
 * along it or take it back while it is drawn, then the two shares and what
 * they come to. It is a live region, so a screen reader hears
 * the result the moment the halves part. It keeps its height either way, so
 * the buttons under it do not jump when a cut lands.
 */
const BisectStatus = ({ aiming, cut, practice }: BisectStatusProps) => {
  const { t } = useTranslation();

  return (
    <div
      aria-live="polite"
      className="flex min-h-16 flex-col items-center justify-center gap-1 text-center"
    >
      {aiming ? (
        <p className="text-sm text-gray-300">{t(`bisect.aiming.${aiming}`)}</p>
      ) : cut ? (
        <>
          <p className="text-2xl font-bold tabular-nums text-white">
            {formatTenths(cut.tenths[0])} : {formatTenths(cut.tenths[1])}
          </p>
          <p className={`text-sm ${VERDICT_TONE[cut.verdict]}`}>
            {t(`bisect.verdict.${cut.verdict}`)}
            {practice && <span className="text-gray-400"> {t("bisect.practice")}</span>}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400">{t("bisect.hint")}</p>
      )}
    </div>
  );
};

export default BisectStatus;

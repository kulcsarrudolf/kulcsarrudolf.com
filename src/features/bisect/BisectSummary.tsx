import { useState } from "react";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import { type Cut, formatTenths, type Verdict } from "./board";
import { shareText, summarize } from "./score";

interface BisectSummaryProps {
  /** The first cut of every shape, in the order they were played. */
  scores: readonly Cut[];
  total: number;
  onRestart: () => void;
}

const TILE: Record<Verdict, string> = {
  perfect: "bg-emerald-300",
  win: "bg-amber-300",
  miss: "bg-gray-600",
};

/** How long "Copied" stays on the button before it goes back. */
const COPIED_MS = 2000;

const percent = (tenths: number | null) => (tenths === null ? "-" : `${formatTenths(tenths)}%`);

/**
 * The end of a run: the score, one tile per shape in the order they came, and
 * the way to paste the run somewhere or go again.
 */
const BisectSummary = ({ scores, total, onRestart }: BisectSummaryProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { wins, perfect, averageOffBy, bestOffBy } = summarize(scores);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText(scores, total));
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // A browser that refuses the clipboard leaves the button as it was.
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <p className="text-sm text-gray-400">{t("bisect.summary.title")}</p>
      <p className="text-5xl font-bold tabular-nums text-white">
        {wins}/{total}
      </p>
      <p className="text-sm text-gray-300">{t("bisect.summary.wins")}</p>

      <ol className="grid grid-cols-5 gap-1.5" aria-label={t("bisect.summary.tiles") as string}>
        {scores.map((cut, i) => (
          <li
            key={i}
            className={`size-6 rounded-sm ${TILE[cut.verdict]}`}
            title={`${formatTenths(cut.tenths[0])} : ${formatTenths(cut.tenths[1])}`}
          >
            <span className="sr-only">{t(`bisect.verdict.${cut.verdict}`)}</span>
          </li>
        ))}
      </ol>

      <dl className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-gray-400">{t("bisect.summary.perfect")}</dt>
          <dd className="text-lg font-bold text-white">{perfect}</dd>
        </div>
        <div>
          <dt className="text-gray-400">{t("bisect.summary.average")}</dt>
          <dd className="text-lg font-bold tabular-nums text-white">{percent(averageOffBy)}</dd>
        </div>
        <div>
          <dt className="text-gray-400">{t("bisect.summary.best")}</dt>
          <dd className="text-lg font-bold tabular-nums text-white">{percent(bestOffBy)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onRestart}>{t("bisect.playAgain")}</Button>
        <Button variant="onBrandOutline" onClick={copy}>
          {t(copied ? "bisect.copied" : "bisect.copy")}
        </Button>
      </div>
    </div>
  );
};

export default BisectSummary;

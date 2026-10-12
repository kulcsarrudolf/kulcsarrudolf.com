import { useTranslation } from "@/i18n/useTranslation";

import type { Score } from "./highScores";

interface MemoryScoresProps {
  scores: readonly Score[];
  /** The place just earned, picked out in the list. */
  highlight?: number;
}

/** One skill's high score list: the five fastest clears, the pairs they took beside them. */
const MemoryScores = ({ scores, highlight }: MemoryScoresProps) => {
  const { t } = useTranslation();

  if (scores.length === 0) return <p>{t("memory.scores.empty")}</p>;

  return (
    <table className="w-full tabular-nums">
      <thead>
        <tr className="border-b border-black text-left">
          <th scope="col" className="w-6 py-1">
            {t("memory.scores.rank")}
          </th>
          <th scope="col" className="py-1">
            {t("memory.scores.name")}
          </th>
          <th scope="col" className="py-1 text-right">
            {t("memory.scores.time")}
          </th>
          <th scope="col" className="py-1 text-right">
            {t("memory.scores.pairs")}
          </th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => (
          <tr
            // A list of at most five, rebuilt whole when a score is added.
            key={index}
            className={index === highlight ? "bg-win-navy text-white" : ""}
          >
            <td className="py-0.5">{index + 1}.</td>
            <td className="max-w-0 truncate py-0.5">{score.name}</td>
            <td className="py-0.5 text-right">{score.seconds}</td>
            <td className="py-0.5 pl-3 text-right">{score.pairs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MemoryScores;

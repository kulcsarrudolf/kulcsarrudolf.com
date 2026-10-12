import { useTranslation } from "@/i18n/useTranslation";

interface MemoryStatusBarProps {
  seconds: number;
  pairs: number;
}

/**
 * The line under the board: the seconds since the first block was flipped
 * and the pairs turned over so far, the two things a game is scored on.
 */
const MemoryStatusBar = ({ seconds, pairs }: MemoryStatusBarProps) => {
  const { t } = useTranslation();

  return (
    <p className="flex justify-end gap-6 border-t border-black bg-white px-3 py-1 tabular-nums">
      <span>
        {t("memory.time")} {seconds}
      </span>
      <span>
        {t("memory.pairs")} {pairs}
      </span>
    </p>
  );
};

export default MemoryStatusBar;

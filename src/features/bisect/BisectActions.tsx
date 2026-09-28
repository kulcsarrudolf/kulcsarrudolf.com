import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import { FinishIcon, NextIcon, RetryIcon } from "./icons";

interface BisectActionsProps {
  /** There is a cut on the board to take back. */
  canRetry: boolean;
  /** The shape's first cut is in, so the run can move on. */
  canMoveOn: boolean;
  /** No shape is left uncut after this one, so moving on ends the run. */
  last: boolean;
  onRetry: () => void;
  onNext: () => void;
}

// A disabled button fades and stops answering the pointer, so it neither
// darkens on hover nor looks like it could be pressed.
const DISABLED = "disabled:pointer-events-none disabled:opacity-35";

/** The key that does the same as the button, shown where there is a keyboard. */
const Key = ({ children }: { children: string }) => (
  <kbd
    aria-hidden="true"
    className="rounded border border-current/30 px-1.5 font-mono text-xs leading-5 opacity-70 pointer-coarse:hidden"
  >
    {children}
  </kbd>
);

/**
 * The two ways off a cut: take it back and cut the shape again, or move on.
 * Both stay in place from the start, so nothing shifts when the first cut
 * lands; they only light up once there is something for them to do. Each
 * carries the key that does the same. Retry keeps its own width and Next
 * takes the rest of the row, dropping under it only when the row is too narrow.
 */
const BisectActions = ({ canRetry, canMoveOn, last, onRetry, onNext }: BisectActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-wrap justify-center gap-3">
      <Button
        variant="secondary"
        onClick={onRetry}
        disabled={!canRetry}
        aria-keyshortcuts="R"
        className={`shrink-0 px-4 ${DISABLED}`}
      >
        <RetryIcon />
        {t("bisect.retry")}
        <Key>R</Key>
      </Button>
      <Button
        onClick={onNext}
        disabled={!canMoveOn}
        aria-keyshortcuts="Space"
        className={`grow px-4 whitespace-nowrap ${DISABLED}`}
      >
        {t(last ? "bisect.finish" : "bisect.next")}
        {last ? <FinishIcon /> : <NextIcon />}
        <Key>Space</Key>
      </Button>
    </div>
  );
};

export default BisectActions;

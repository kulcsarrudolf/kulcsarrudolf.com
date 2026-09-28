import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import { CutIcon, FinishIcon, NextIcon, RetryIcon } from "./icons";

interface BisectActionsProps {
  /** There is a line or a cut on the board to take back. */
  canRetry: boolean;
  /** There is a line on the board to cut along. */
  canCut: boolean;
  /** The cut is made and its result is showing, so the run can move on. */
  cutMade: boolean;
  /** No shape is left uncut after this one, so moving on ends the run. */
  last: boolean;
  onRetry: () => void;
  onCut: () => void;
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
 * Retry, and the one button that takes the shape forward: Cut while the line
 * is still being set, lit once there is one, and Next in its place once the
 * cut is made and its result is showing. Both stay in place from the start,
 * so nothing shifts when the cut lands, and the second is the same button
 * throughout, so the focus stays on it from Cut to Next. Each carries the key
 * that does the same. Retry keeps its own width and the other takes the rest
 * of the row, dropping under it only when the row is too narrow.
 */
const BisectActions = ({
  canRetry,
  canCut,
  cutMade,
  last,
  onRetry,
  onCut,
  onNext,
}: BisectActionsProps) => {
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
      {cutMade ? (
        <Button
          key="forward"
          onClick={onNext}
          aria-keyshortcuts="Space"
          className="grow px-4 whitespace-nowrap"
        >
          {t(last ? "bisect.finish" : "bisect.next")}
          {last ? <FinishIcon /> : <NextIcon />}
          <Key>Space</Key>
        </Button>
      ) : (
        <Button
          key="forward"
          onClick={onCut}
          disabled={!canCut}
          aria-keyshortcuts="Enter"
          className={`grow px-4 whitespace-nowrap ${DISABLED}`}
        >
          <CutIcon />
          {t("bisect.cut")}
          <Key>Enter</Key>
        </Button>
      )}
    </div>
  );
};

export default BisectActions;

import { BEVEL_BUTTON } from "./win";

interface MemoryTitleBarProps {
  title: string;
  /** The control-menu box at the left, which is how a Windows 3.1 window was closed. */
  onClose?: () => void;
  closeLabel?: string;
  /** Leave out the minimise and maximise arrows, as a dialog has none. */
  dialog?: boolean;
  id?: string;
}

/**
 * A Windows 3.1 title bar: the window's name in white on navy, the
 * control-menu box at the left and, on a window, the minimise and maximise
 * arrows at the right. Only the box does anything here, and only when there
 * is something to close: the arrows are there to be recognised.
 */
const MemoryTitleBar = ({
  title,
  onClose,
  closeLabel,
  dialog = false,
  id,
}: MemoryTitleBarProps) => (
  <div className="flex items-stretch border-b border-black bg-win-navy text-white">
    {onClose ? (
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="flex w-6 shrink-0 items-center justify-center border-r border-black bg-win-silver focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-black focus-visible:outline-dotted"
      >
        <span className="h-[3px] w-3 border border-black bg-white shadow-[1px_1px_0_var(--color-win-gray)]" />
      </button>
    ) : (
      dialog || <span className="w-6 shrink-0 border-r border-black bg-win-silver" />
    )}
    <h2 id={id} className="flex-1 truncate px-2 py-0.5 text-center">
      {title}
    </h2>
    {!dialog && (
      <span aria-hidden="true" className="flex shrink-0">
        <span
          className={`${BEVEL_BUTTON} flex w-6 items-center justify-center rounded-none text-[9px]`}
        >
          ▼
        </span>
        <span
          className={`${BEVEL_BUTTON} flex w-6 items-center justify-center rounded-none text-[9px]`}
        >
          ▲
        </span>
      </span>
    )}
  </div>
);

export default MemoryTitleBar;

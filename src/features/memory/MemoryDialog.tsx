import { type ReactNode, useEffect, useId, useRef } from "react";

import MemoryTitleBar from "./MemoryTitleBar";

interface MemoryDialogProps {
  title: string;
  children: ReactNode;
  /** The buttons along the bottom. The first takes the caret when the dialog opens. */
  actions: ReactNode;
  /** Escape, which answers as Cancel would. */
  onDismiss: () => void;
  /** Leave the caret alone on opening, for a dialog with a field of its own to fill. */
  keepFocus?: boolean;
}

/**
 * A Windows 3.1 message box over the board: a navy title bar, a white body
 * and the grey buttons under it. It sits inside the game's window rather than
 * over the page, the way the original's dialogs belonged to its window, and
 * the board behind it is out of reach until it is answered.
 */
const MemoryDialog = ({
  title,
  children,
  actions,
  onDismiss,
  keepFocus = false,
}: MemoryDialogProps) => {
  const titleId = useId();
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keepFocus) return;
    actionsRef.current?.querySelector("button")?.focus();
  }, [keepFocus]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        }}
        className="w-full max-w-sm border-2 border-black bg-white shadow-[4px_4px_0_black]"
      >
        <MemoryTitleBar id={titleId} title={title} dialog />
        <div className="flex max-h-[70dvh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {children}
        </div>
        <div ref={actionsRef} className="flex justify-center gap-3 px-5 pb-4">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default MemoryDialog;

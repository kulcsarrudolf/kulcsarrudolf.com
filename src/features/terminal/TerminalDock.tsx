import { TerminalIcon } from "./icons";

interface TerminalDockProps {
  onOpen: () => void;
  label: string;
}

/**
 * The button in the bottom right corner of the page, which is all that is
 * left of the terminal once its red button has been pressed. Pressing it puts
 * the window back where it was, history and all, the way an app left in the
 * Dock opens onto the work it was closed on.
 *
 * Fixed to the corner rather than the page, so it stays in reach however far
 * down the visitor has scrolled, and under the dialogs, so it is not left
 * sitting on top of the sudoku.
 */
const TerminalDock = ({ onOpen, label }: TerminalDockProps) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={label}
    title={label}
    className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800 text-gray-300 shadow-lg outline-hidden transition-colors hover:bg-gray-700 hover:text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:bg-gray-700 dark:ring-1 dark:ring-white/10 dark:hover:bg-gray-600 dark:focus-visible:ring-2 dark:focus-visible:ring-brand-dark-accent dark:focus-visible:ring-offset-surface-dark"
  >
    <TerminalIcon />
  </button>
);

export default TerminalDock;

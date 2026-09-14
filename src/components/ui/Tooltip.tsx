import { useId, type ReactNode } from "react";

interface TooltipProps {
  /** What the tooltip says. */
  content: ReactNode;
  /** The element the tooltip belongs to. */
  children: ReactNode;
}

/**
 * A short note that appears above its trigger on hover or keyboard focus.
 *
 * The trigger is focusable and points at the note through
 * `aria-describedby`, so keyboard and screen reader users get it too. The note
 * is aligned to the trigger's left edge rather than centred, so a trigger near
 * the left of the screen never pushes it off a phone.
 */
const Tooltip = ({ content, children }: TooltipProps) => {
  const id = useId();

  return (
    <span
      tabIndex={0}
      aria-describedby={id}
      className="group relative inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
    >
      {children}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-max max-w-72 rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-line-dark dark:bg-card-dark dark:text-gray-100"
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;

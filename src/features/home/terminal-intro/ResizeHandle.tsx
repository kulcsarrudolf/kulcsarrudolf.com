import type { HTMLAttributes } from "react";

interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  /** The body's current, lowest and highest heights, for assistive tech. */
  value: number;
  min: number;
  max: number;
}

/**
 * The strip along the bottom of the terminal that drags the window taller
 * or shorter, like the edge of a real one. Only the height moves: the width
 * is the page's. Focusable, so the arrow keys work it too.
 */
const ResizeHandle = ({ label, value, min, max, ...props }: ResizeHandleProps) => (
  <div
    role="separator"
    aria-orientation="horizontal"
    aria-label={label}
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    tabIndex={0}
    className="flex h-4 shrink-0 cursor-row-resize touch-none items-center justify-center border-t border-white/10 bg-gray-700 outline-hidden transition-colors hover:bg-gray-600 focus-visible:bg-gray-600"
    {...props}
  >
    <span className="h-1 w-10 rounded-full bg-gray-500" aria-hidden="true" />
  </div>
);

export default ResizeHandle;

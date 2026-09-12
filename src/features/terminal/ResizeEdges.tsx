import type { Direction, GrabProps } from "./useFloatingFrame";

interface ResizeEdgesProps {
  /** The handlers for one edge, from the floating frame's `grabProps`. */
  grabProps: (direction: Direction) => GrabProps;
}

// Where each strip sits on the frame and what cursor it shows. The sides are
// 6px bands inset past the corners; the corners are 14px squares over them,
// last in the list so they win the overlap.
const EDGES: { direction: Direction; className: string }[] = [
  { direction: "n", className: "inset-x-3 top-0 h-1.5 cursor-ns-resize" },
  { direction: "s", className: "inset-x-3 bottom-0 h-1.5 cursor-ns-resize" },
  { direction: "w", className: "inset-y-3 left-0 w-1.5 cursor-ew-resize" },
  { direction: "e", className: "inset-y-3 right-0 w-1.5 cursor-ew-resize" },
  { direction: "nw", className: "left-0 top-0 h-3.5 w-3.5 cursor-nwse-resize" },
  { direction: "ne", className: "right-0 top-0 h-3.5 w-3.5 cursor-nesw-resize" },
  { direction: "sw", className: "bottom-0 left-0 h-3.5 w-3.5 cursor-nesw-resize" },
  { direction: "se", className: "bottom-0 right-0 h-3.5 w-3.5 cursor-nwse-resize" },
];

/**
 * The eight grab strips around a floating window: four sides and four
 * corners, each dragging the edge it sits on, the way a window's frame does.
 * They are invisible and sit over the window's own rounded edge, so all that
 * shows is the cursor changing as the pointer crosses onto one. Pointers
 * only: the strip along the bottom of the window is the focusable control,
 * and its arrow keys work both the width and the height while the window
 * floats.
 */
const ResizeEdges = ({ grabProps }: ResizeEdgesProps) => (
  <>
    {EDGES.map(({ direction, className }) => (
      <div
        key={direction}
        aria-hidden="true"
        className={`absolute z-10 touch-none ${className}`}
        {...grabProps(direction)}
      />
    ))}
  </>
);

export default ResizeEdges;

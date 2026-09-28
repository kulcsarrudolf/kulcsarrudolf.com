import { useEffect, useId } from "react";

import { BOARD_SIZE, CENTER, type Cut, formatTenths, type PlacedShape, RIM_RADIUS } from "./board";
import { chord, halfPlane, type Line, type Side, toPath } from "./geometry";
import { type AimSource, useCutGesture } from "./useCutGesture";

interface BisectBoardProps {
  shape: PlacedShape;
  /** The line being drawn. */
  aim: Line | null;
  /** The last cut let go of, drawn with its halves pulled apart. */
  cut: Cut | null;
  onAim: (line: Line | null, by: AimSource) => void;
  onCut: (line: Line) => void;
  /** Names the board for a screen reader. */
  label: string;
  /** The id of the text that says how to cut with the keyboard. */
  describedBy?: string;
}

/** How far each half moves off the cut once it is made, in board units. */
const GAP = 3.5;

const SIDES: readonly Side[] = [1, -1];

// Side 1 in the terminal's blue, side -1 in amber: two colours that part
// clearly on the dark board and do not lean on red against green.
const SIDE_FILL: Record<Side, string> = {
  1: "fill-brand-on-dark",
  [-1]: "fill-amber-300",
};

/**
 * The board: the circle, the shape inside it, and the line across it. While
 * a line is drawn the shape is coloured by side, so the two halves can be
 * weighed by eye, and its two ends carry handles to take hold of and slide
 * round the rim. Once it is cut the halves part along the line and each
 * carries its share. The numbers only come with the cut, as in Cutle.
 *
 * A press is marked where it lands, before there is a line to show for it,
 * and the mark is where to drag back to for taking the line back.
 */
const BisectBoard = ({ shape, aim, cut, onAim, onCut, label, describedBy }: BisectBoardProps) => {
  const id = useId();
  const line = aim ?? cut?.line ?? null;
  const parted = cut !== null && aim === null;
  const ends = line && chord(line, CENTER, RIM_RADIUS);

  const { svgRef, press, active, grabbing, handlers } = useCutGesture({
    aim,
    lastLine: cut?.line ?? null,
    onAim,
    onCut,
  });

  // Each new shape takes the focus, so the keyboard is on the board from the
  // moment it opens, and again after moving on, without a Tab to reach it.
  useEffect(() => {
    svgRef.current?.focus({ preventScroll: true });
  }, [svgRef, shape.id]);

  // The way side 1 lies from the line, as a unit vector, for pulling the
  // halves apart and setting their labels.
  const normal = (() => {
    if (!line) return [0, 0];
    const dx = line.to[0] - line.from[0];
    const dy = line.to[1] - line.from[1];
    const length = Math.hypot(dx, dy);
    return [-dy / length, dx / length];
  })();

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
      role="application"
      aria-label={label}
      aria-describedby={describedBy}
      tabIndex={0}
      // Square rather than round, corners and all: a rounded box only takes
      // presses inside its curve, and a cut is naturally started just outside
      // the rim. Keyboard focus lights the rim instead of ringing the box.
      // A touch on it is the game's alone: no scrolling or zooming the page,
      // no tap flash, and no callout when a finger rests on it.
      className={`group aspect-square w-full overflow-visible ${grabbing ? "cursor-grabbing" : active !== null ? "cursor-grab" : "cursor-crosshair"} touch-none select-none outline-hidden [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]`}
      {...handlers}
    >
      <circle
        cx={CENTER[0]}
        cy={CENTER[1]}
        r={RIM_RADIUS}
        className="fill-gray-900/40 stroke-gray-600 group-focus-visible:stroke-brand-on-dark"
        strokeWidth={1.5}
      />

      {line ? (
        SIDES.map((side) => {
          const shift = parted ? GAP * side : 0;
          return (
            <g key={side}>
              <clipPath id={`${id}-${side}`}>
                <path d={toPath([halfPlane(line, side, BOARD_SIZE * 2)])} />
              </clipPath>
              <g
                className="transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translate(${normal[0] * shift}px, ${normal[1] * shift}px)` }}
              >
                <path d={shape.path} clipPath={`url(#${id}-${side})`} className={SIDE_FILL[side]} />
              </g>
            </g>
          );
        })
      ) : (
        <path d={shape.path} className="fill-brand-on-dark" />
      )}

      {ends && (
        <g className={parted ? "opacity-0 transition-opacity duration-300" : ""}>
          <line
            x1={ends[0][0]}
            y1={ends[0][1]}
            x2={ends[1][0]}
            y2={ends[1][1]}
            className="stroke-white"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
          {ends.map(([x, y], i) =>
            aim ? (
              // A handle: a halo to aim a finger at, lit while it is held.
              <g key={i} className="pointer-events-none">
                <circle
                  cx={x}
                  cy={y}
                  r={active === i ? 11 : 8}
                  className={`transition-[r] duration-150 motion-reduce:transition-none ${active === i ? "fill-white/30" : "fill-white/15"}`}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={4.5}
                  className="fill-gray-900 stroke-white"
                  strokeWidth={1.5}
                />
              </g>
            ) : (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3}
                className="fill-gray-800 stroke-white"
                strokeWidth={1.2}
              />
            ),
          )}
        </g>
      )}

      {press && (
        <circle
          cx={press[0]}
          cy={press[1]}
          r={aim ? 2.5 : 4}
          className="pointer-events-none fill-white/90 stroke-gray-900"
          strokeWidth={1}
        />
      )}

      {parted &&
        cut &&
        cut.parts.map((part, i) => {
          if (!part.centroid) return null;
          const shift = GAP * SIDES[i] * 2;
          return (
            <text
              key={i}
              x={part.centroid[0] + normal[0] * shift}
              y={part.centroid[1] + normal[1] * shift}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none fill-white stroke-gray-900 font-mono text-[11px] font-bold"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {formatTenths(cut.tenths[i])}%
            </text>
          );
        })}
    </svg>
  );
};

export default BisectBoard;

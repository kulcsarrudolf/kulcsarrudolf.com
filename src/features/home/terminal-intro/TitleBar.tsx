import type { ComponentProps } from "react";

import TrafficLights from "./TrafficLights";
import type { GrabProps } from "./useFloatingFrame";

interface TitleBarProps extends ComponentProps<typeof TrafficLights> {
  /** What the window is showing, printed beside the dots. */
  path: string;
  /** The pointer handlers that drag a floating window. Absent while docked. */
  dragProps?: GrabProps;
  /** Names the bar as the window's handle while it floats. */
  dragLabel: string;
}

/**
 * The bar across the top of the terminal: the three buttons, and the path the
 * window is sitting in. While the window floats it is also what the window is
 * carried by, so it takes the grab cursor and the drag handlers; docked, it is
 * a bar like any other. A double-click on it rolls the window up or down,
 * which is what double-clicking a title bar does.
 */
const TitleBar = ({ path, dragProps, dragLabel, ...lights }: TitleBarProps) => (
  <div
    className={`flex h-10 shrink-0 select-none items-center gap-2 border-b border-white/10 bg-gray-700 px-4 ${
      dragProps ? "cursor-grab touch-none active:cursor-grabbing" : ""
    }`}
    aria-label={dragProps ? dragLabel : undefined}
    onDoubleClick={lights.onShade}
    {...dragProps}
  >
    <TrafficLights {...lights} />
    <span className="ml-2 truncate font-mono text-[13px] text-gray-400">{path}</span>
  </div>
);

export default TitleBar;

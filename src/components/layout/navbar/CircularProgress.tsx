interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  /**
   * Given, the ring starts at `progress` and fills to full over this many
   * milliseconds on the CSS animation clock, so it keeps time even where the
   * page gets no frame callbacks (an embedded or covered tab).
   */
  fillDurationMs?: number;
}

const CircularProgress = ({
  progress,
  size = 48,
  strokeWidth = 3,
  fillDurationMs,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // `size` is the viewBox, not a pixel width: the svg stretches to whatever
  // the avatar around it is, which is 36px on phones and 40px from 640px up.
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 h-full w-full transform -rotate-90 z-10 pointer-events-none"
    >
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#22c55e"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={
          fillDurationMs === undefined
            ? { transition: "stroke-dashoffset 50ms linear" }
            : { animation: `ring-fill ${fillDurationMs}ms linear forwards` }
        }
      />
    </svg>
  );
};

export default CircularProgress;

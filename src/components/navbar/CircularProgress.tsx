interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ progress, size = 48, strokeWidth = 3 }: CircularProgressProps) => {
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
        style={{ transition: "stroke-dashoffset 50ms linear" }}
      />
    </svg>
  );
};

export default CircularProgress;

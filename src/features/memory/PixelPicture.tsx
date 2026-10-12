import { useMemo } from "react";

import { type Picture, PICTURE_SIZE, runsOf } from "./picture";

interface PixelPictureProps {
  picture: Picture;
  className?: string;
}

/**
 * One of the pictures under the blocks, pixel for pixel. Drawn as an SVG with
 * crisp edges, so it scales to any block size without going soft. It is
 * decoration: the block it sits on carries the picture's name.
 */
const PixelPicture = ({ picture, className = "" }: PixelPictureProps) => {
  const runs = useMemo(() => runsOf(picture), [picture]);

  return (
    <svg
      viewBox={`0 0 ${PICTURE_SIZE} ${PICTURE_SIZE}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {runs.map(({ x, y, width, fill }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height={1} fill={fill} />
      ))}
    </svg>
  );
};

export default PixelPicture;

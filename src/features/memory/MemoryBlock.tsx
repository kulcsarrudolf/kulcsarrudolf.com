import type { KeyboardEvent, Ref } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import type { BlockState } from "./engine";
import type { Picture } from "./picture";
import PixelPicture from "./PixelPicture";
import { asText } from "./text";

interface MemoryBlockProps {
  picture: Picture;
  state: BlockState;
  /** Counted from one, for the name a screen reader reads out. */
  number: number;
  /** Whether Tab lands here: only one block of the board takes it at a time. */
  tabbable: boolean;
  onFlip: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onFocus: () => void;
  ref?: Ref<HTMLButtonElement>;
}

// The 1991 block in the grid's own units: a front face 40 across, and its
// side showing 5 to the left and 5 below, cut off at 45 degrees at the two
// corners where it meets the face. The face sits at the top right of the box.
const SIDE = "5,0 45,0 45,40 40,45 0,45 0,5";
const FACE =
  "absolute right-0 top-0 h-[calc(40/45*100%)] w-[calc(40/45*100%)] border border-black group-focus-visible:outline-1 group-focus-visible:-outline-offset-4 group-focus-visible:outline-black group-focus-visible:outline-dotted";

/** One side of the block as it turns: the side panel and the face, yellow or with the picture. */
const BlockSide = ({ picture, className = "" }: { picture?: Picture; className?: string }) => (
  <span className={`absolute inset-0 backface-hidden ${className}`}>
    <svg
      viewBox="0 0 45 45"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 size-full overflow-visible"
    >
      <polygon
        points={SIDE}
        vectorEffect="non-scaling-stroke"
        className="fill-win-ochre stroke-black"
      />
      <line
        x1={5}
        y1={40}
        x2={0}
        y2={45}
        vectorEffect="non-scaling-stroke"
        className="stroke-black"
      />
    </svg>
    <span className={`${FACE} ${picture ? "bg-white" : "bg-win-yellow"}`}>
      {picture && <PixelPicture picture={picture} className="size-full p-[5%]" />}
    </span>
  </span>
);

/**
 * One block of the board, drawn as the 1991 game drew it: a yellow face with
 * its darker side showing to the left and below.
 *
 * Flipping it turns the whole block over around its upright axis, the way
 * the original did, to the picture on its back; a pair that does not match
 * turns back the same way. A matched block shrinks away to nothing, and its
 * place in the grid is kept so the blocks around it stay where they were.
 * With reduced motion asked for, it changes without the movement.
 */
const MemoryBlock = ({
  picture,
  state,
  number,
  tabbable,
  onFlip,
  onKeyDown,
  onFocus,
  ref,
}: MemoryBlockProps) => {
  const { t } = useTranslation();
  const gone = state === "gone";

  const label = asText(
    state === "up"
      ? t("memory.block.up", {
          number: String(number),
          picture: t(`memory.pictures.${picture.id}`) as string,
        })
      : t("memory.block.down", { number: String(number) }),
  );

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabbable && !gone ? 0 : -1}
      aria-label={gone ? undefined : label}
      aria-hidden={gone || undefined}
      inert={gone}
      onClick={onFlip}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      className={`group relative aspect-square w-full perspective-[30rem] transition-[scale] duration-400 ease-in focus-visible:outline-hidden motion-reduce:transition-none ${
        gone ? "scale-0" : ""
      }`}
    >
      <span
        className={`absolute inset-0 transform-3d transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          state === "down" ? "" : "rotate-y-180"
        }`}
      >
        <BlockSide />
        <BlockSide picture={picture} className="rotate-y-180" />
      </span>
    </button>
  );
};

export default MemoryBlock;

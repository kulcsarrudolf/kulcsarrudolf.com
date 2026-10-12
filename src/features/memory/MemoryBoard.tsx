import { type FocusEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import type { Board, Skill } from "./engine";
import MemoryBlock from "./MemoryBlock";
import { PICTURES } from "./pictures";

interface MemoryBoardProps {
  board: Board;
  onFlip: (index: number) => void;
  /** Put the caret on the board once it is drawn, as the game window opens. */
  autoFocus?: boolean;
}

// The columns and the width of each skill's board. The expert board is ten
// across, which leaves a phone held upright with blocks too small to tap, so
// there it stands six across and ten down instead. On a `short` screen the
// width is held to what the height allows, so the bottom row is not cut off.
const LAYOUT: Record<Skill, string> = {
  beginner: "grid-cols-4 md:w-72 short:w-[min(18rem,(100dvh_-_9rem)*1.28)]",
  intermediate: "grid-cols-6 md:w-[26rem] short:w-[min(26rem,(100dvh_-_9rem)*1.28)]",
  expert:
    "grid-cols-6 sm:grid-cols-10 md:w-[42rem] short:grid-cols-10 short:w-[min(42rem,(100dvh_-_9rem)*2)]",
};

const STEP: Record<string, (columns: number) => number> = {
  ArrowLeft: () => -1,
  ArrowRight: () => 1,
  ArrowUp: (columns) => -columns,
  ArrowDown: (columns) => columns,
};

/**
 * The blocks, in a grid on the aqua board. One block takes Tab at a time and
 * the arrow keys move between them, skipping the places of the pairs already
 * gone, so the board is a single stop in the tab order however big it is.
 * Enter or Space flips the block, as a button does.
 */
const MemoryBoard = ({ board, onFlip, autoFocus = false }: MemoryBoardProps) => {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [current, setCurrent] = useState(0);

  const present = (index: number) => board.blocks[index]?.state !== "gone";

  // The block that takes Tab: the one last moved to, or the nearest still
  // there once it has gone.
  const nearest = (from: number) => {
    for (let distance = 0; distance < board.blocks.length; distance++) {
      if (present(from + distance)) return from + distance;
      if (present(from - distance) && from - distance >= 0) return from - distance;
    }
    return -1;
  };
  const tabStop = nearest(Math.min(current, board.blocks.length - 1));

  // Only as the board first appears, when every block is still there: later
  // the caret is wherever it was put.
  useEffect(() => {
    if (autoFocus) blockRefs.current[0]?.focus({ preventScroll: true });
  }, [autoFocus]);

  // A matched pair takes the focused block away with it, and the caret would
  // fall out of the board onto the page. It moves to the nearest block left
  // instead, unless it has already gone somewhere else of its own accord.
  const focusWithin = useRef(false);
  const blocks = board.blocks;
  useEffect(() => {
    if (!focusWithin.current || blocks[current]?.state !== "gone") return;
    const active = document.activeElement;
    if (active && active !== document.body && !gridRef.current?.contains(active)) return;
    blockRefs.current[tabStop]?.focus({ preventScroll: true });
  }, [blocks, current, tabStop]);

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Nowhere to go is what a block being taken away looks like, so it keeps the flag.
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next)) focusWithin.current = false;
  };

  const columns = () => {
    const grid = gridRef.current;
    if (!grid) return 1;
    return getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    let target = -1;
    if (event.key === "Home") target = nearest(0);
    else if (event.key === "End") target = nearest(board.blocks.length - 1);
    else if (STEP[event.key]) {
      const step = STEP[event.key](columns());
      for (let next = index + step; next >= 0 && next < board.blocks.length; next += step) {
        if (present(next)) {
          target = next;
          break;
        }
      }
    } else {
      return;
    }

    event.preventDefault();
    if (target === -1) return;
    setCurrent(target);
    blockRefs.current[target]?.focus();
  };

  return (
    <div
      ref={gridRef}
      role="group"
      aria-label={t("memory.board") as string}
      onFocus={() => {
        focusWithin.current = true;
      }}
      onBlur={onBlur}
      className={`grid w-full gap-3 md:gap-4 ${LAYOUT[board.skill]}`}
    >
      {board.blocks.map((block, index) => (
        <MemoryBlock
          // The board is dealt anew rather than reordered, so the place is the identity.
          key={index}
          ref={(element) => {
            blockRefs.current[index] = element;
          }}
          picture={PICTURES[block.picture]}
          state={block.state}
          number={index + 1}
          tabbable={index === tabStop}
          onFlip={() => onFlip(index)}
          onKeyDown={onKeyDown(index)}
          onFocus={() => setCurrent(index)}
        />
      ))}
    </div>
  );
};

export default MemoryBoard;

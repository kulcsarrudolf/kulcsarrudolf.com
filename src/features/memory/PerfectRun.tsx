import { useRef } from "react";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";

import MemoryBlock from "./MemoryBlock";
import MemoryTitleBar from "./MemoryTitleBar";
import { PICTURES } from "./pictures";
import PixelPicture from "./PixelPicture";
import { usePerfectRun } from "./usePerfectRun";
import { SYSTEM_TEXT } from "./win";

interface PerfectRunProps {
  /**
   * Deal the same board every time, so the text around it can describe the
   * run. A string too, since that is how a markdown attribute arrives.
   */
  seed?: number | string;
}

const noop = () => {};

/**
 * A player with a perfect memory clearing a beginner board, for the blog post
 * on the game's maths. It is the game's own window and blocks, played by
 * `perfectPlay`: each block it has seen keeps a small copy of its picture
 * while it lies face down, which is what the player remembers, and the line
 * under the window says why each turn went the way it did.
 *
 * The board only plays itself, so it is hidden from the tab order and from
 * screen readers, and the caption carries the run instead.
 */
const PerfectRun = ({ seed }: PerfectRunProps) => {
  const { t } = useTranslation();
  const viewRef = useRef<HTMLElement>(null);
  const run = usePerfectRun(viewRef, seed === undefined ? undefined : Number(seed));
  const { board, seen, turn, finished } = run;

  const caption = finished
    ? t("memory.perfectRun.done", { pairs: String(board.pairsFlipped) })
    : turn
      ? t(`memory.perfectRun.${turn.kind}`)
      : t("memory.perfectRun.intro");

  return (
    <figure ref={viewRef} className="not-prose my-8 flex flex-col items-center gap-4">
      <div
        inert
        aria-hidden="true"
        className={`w-full max-w-xs select-none border-2 border-black bg-win-silver ${SYSTEM_TEXT}`}
      >
        <MemoryTitleBar title={t("memory.perfectRun.title") as string} />
        <div className="grid grid-cols-4 gap-3 bg-win-aqua p-4">
          {board.blocks.map((block, index) => (
            // The board is dealt anew rather than reordered, so the place is the identity.
            <div key={index} className="relative">
              <MemoryBlock
                picture={PICTURES[block.picture]}
                state={block.state}
                number={index + 1}
                tabbable={false}
                onFlip={noop}
                onKeyDown={noop}
                onFocus={noop}
              />
              {block.state === "down" && seen.has(index) && (
                <span className="absolute left-[55.5%] top-[43%] w-[60%] -translate-x-1/2 -translate-y-1/2 border border-dashed border-black bg-white/85">
                  <PixelPicture picture={PICTURES[block.picture]} className="block w-full p-[6%]" />
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="border-t border-black bg-white px-3 py-1 text-right tabular-nums">
          {t("memory.pairs")} {board.pairsFlipped}
        </p>
      </div>

      <figcaption
        aria-live="polite"
        className="min-h-[2lh] max-w-md text-center font-normal text-gray-700 dark:text-gray-300"
      >
        {caption}
      </figcaption>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={run.toggle}>
          {finished
            ? t("memory.perfectRun.replay")
            : run.playing
              ? t("memory.perfectRun.pause")
              : t("memory.perfectRun.play")}
        </Button>
        <Button variant="secondary" onClick={run.dealAgain}>
          {t("memory.perfectRun.dealAgain")}
        </Button>
      </div>
    </figure>
  );
};

export default PerfectRun;

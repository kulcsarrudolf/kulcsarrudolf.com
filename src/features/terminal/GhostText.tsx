import type { MouseEvent } from "react";

interface GhostTextProps {
  /** The rest of the line on offer, as it would carry on from what is typed. */
  text: string;
  /** The name of the key that takes it, shown beside it where there is a keyboard. */
  keyName: string;
  /** What the button says to a screen reader: the suggestion in full. */
  label: string;
  onAccept: () => void;
}

// The caret stays in the prompt while the suggestion is pressed: a phone
// would fold its keyboard away otherwise, and bring it back a moment later.
const keepFocus = (event: MouseEvent) => event.preventDefault();

/**
 * What could finish the line, in a lighter grey than what was typed, carrying
 * on from the last letter with no gap: the cursor stands on the suggestion's
 * first letter rather than before it, so typing reads as writing over what is
 * offered. The cursor is drawn here for that reason, and the prompt leaves
 * its own out while there is a suggestion. Tab takes it, and so does a tap,
 * since a phone has no Tab. It is out of the tab order for the same reason it
 * exists: Tab belongs to the suggestion, not to the way to it.
 */
const GhostText = ({ text, keyName, label, onAccept }: GhostTextProps) => (
  <button
    type="button"
    tabIndex={-1}
    aria-label={label}
    className="group flex min-w-0 cursor-pointer items-center gap-2.5 font-mono text-base sm:text-[15px]"
    onMouseDown={keepFocus}
    onClick={onAccept}
  >
    <span className="relative flex min-w-0 items-center">
      <span className="truncate whitespace-pre text-gray-500 transition-colors group-hover:text-gray-300">
        {text}
      </span>
      {/* One `ch` wide, which in a mono font is the letter it stands on. The
          letter is drawn again inside it, since the block would hide it. */}
      <span
        className="absolute left-0 flex h-[18px] w-[1ch] items-center justify-center overflow-hidden whitespace-pre bg-white text-gray-500 animate-blink motion-reduce:animate-none"
        aria-hidden="true"
      >
        {text.slice(0, 1)}
      </span>
    </span>
    <kbd className="hidden shrink-0 rounded border border-gray-600 px-1.5 font-mono text-[11px] leading-[1.5] text-gray-400 transition-colors group-hover:border-gray-500 group-hover:text-gray-300 [@media(pointer:fine)]:inline">
      {keyName}
    </kbd>
  </button>
);

export default GhostText;

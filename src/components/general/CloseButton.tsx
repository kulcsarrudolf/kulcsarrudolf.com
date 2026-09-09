import type { Ref } from "react";

interface CloseButtonProps {
  onClick: () => void;
  label: string;
  /** Position it: the corner it sits in belongs to the surface around it. */
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * The × in the corner of a dialog or the menu sheet. The glyph is small but
 * the button is 44px, so it is comfortably tappable, and it announces itself
 * through `aria-label` since a multiplication sign is not a name.
 */
const CloseButton = ({
  onClick,
  label,
  className = "absolute right-3 top-3",
  ref,
}: CloseButtonProps) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`flex h-11 w-11 items-center justify-center rounded-lg text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
  >
    &times;
  </button>
);

export default CloseButton;

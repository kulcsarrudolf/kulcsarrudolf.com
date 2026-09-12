import type { Ref } from "react";

interface CloseButtonProps {
  onClick: () => void;
  label: string;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * The × in the corner of a dialog or the menu sheet. The glyph is small but
 * the button is 44px, so it is comfortably tappable, and it announces itself
 * through `aria-label` since a multiplication sign is not a name.
 */
const CloseButton = ({ onClick, label, ref }: CloseButtonProps) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    aria-label={label}
    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-2xl leading-none text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand dark:text-gray-500 dark:hover:text-gray-300 dark:focus-visible:ring-brand-on-dark"
  >
    &times;
  </button>
);

export default CloseButton;
